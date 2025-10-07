import { supabase } from '../lib/supabase'

export interface LoginResponse {
  sucesso: boolean
  mensagem: string
  cliente_id?: string
  email?: string
}

export interface RegistroResponse {
  sucesso: boolean
  mensagem: string
  cliente_id?: string
}

// Login com Supabase Auth
export async function login(email: string, senha: string): Promise<LoginResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password: senha,
    })

    if (error) {
      console.error('Erro no login:', error)
      
      // Mensagens de erro customizadas
      if (error.message.includes('Invalid login credentials')) {
        return {
          sucesso: false,
          mensagem: 'Email ou senha incorretos'
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return {
          sucesso: false,
          mensagem: 'Confirme seu email antes de fazer login'
        }
      }

      return {
        sucesso: false,
        mensagem: error.message
      }
    }

    if (!data.user) {
      return {
        sucesso: false,
        mensagem: 'Erro ao processar login'
      }
    }

    // Buscar cliente vinculado
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('auth_id', data.user.id)
      .single()

    console.log('Cliente encontrado:', cliente)

    // Atualizar último acesso
    if (cliente) {
      await supabase
        .from('clientes')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('id', cliente.id)
    }

    return {
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      cliente_id: String(cliente?.id),
      email: data.user.email
    }

  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return {
      sucesso: false,
      mensagem: 'Erro ao processar login. Tente novamente.'
    }
  }
}

// Registrar com Supabase Auth
export async function registrar(
  nome: string,
  email: string,
  telefone: string,
  senha: string,
  endereco: {
    morada: string
    codigoPostal: string
    cidade: string
    distrito: string
  }
): Promise<RegistroResponse> {
  try {
    // 1. Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password: senha,
      options: {
        data: {
          nome: nome,
          telefone: telefone
        }
      }
    })

    if (error) {
      console.error('Erro no registro:', error)
      
      if (error.message.includes('already registered')) {
        return {
          sucesso: false,
          mensagem: 'Este email já está cadastrado'
        }
      }

      if (error.message.includes('GESTOR')) {
        return {
          sucesso: false,
          mensagem: 'Este email pertence a um gestor e não pode ser usado para criar conta de cliente'
        }
      }

      return {
        sucesso: false,
        mensagem: error.message
      }
    }

    if (!data.user) {
      return {
        sucesso: false,
        mensagem: 'Erro ao criar conta'
      }
    }

    // 2. Aguardar um momento para o trigger criar o cliente
    await new Promise(resolve => setTimeout(resolve, 500))

    // 3. Buscar o cliente criado pelo trigger
    const { data: cliente, error: erroCliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('auth_id', data.user.id)
      .single()

    if (erroCliente || !cliente) {
      console.error('Cliente não encontrado após signup:', erroCliente)
      
      // Tentar criar manualmente se o trigger falhou
      const { data: novoCliente } = await supabase
        .from('clientes')
        .insert({
          auth_id: data.user.id,
          nome,
          email: email.toLowerCase().trim(),
          telefone,
          endereco,
          status: 'ativo',
          origem: 'web',
          ativo: true
        })
        .select()
        .single()

      return {
        sucesso: true,
        mensagem: 'Conta criada com sucesso!',
        cliente_id: novoCliente?.id
      }
    }

    // 4. Atualizar cliente com dados completos
    await supabase
      .from('clientes')
      .update({
        nome,
        telefone,
        endereco
      })
      .eq('id', cliente.id)

    return {
      sucesso: true,
      mensagem: 'Conta criada com sucesso!',
      cliente_id: cliente.id
    }

  } catch (error) {
    console.error('Erro ao registrar:', error)
    return {
      sucesso: false,
      mensagem: 'Erro ao criar conta. Tente novamente.'
    }
  }
}

// Logout
export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

// Verificar se está logado
export async function verificarSessao() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Recuperar senha
export async function solicitarRecuperacao(email: string): Promise<{ sucesso: boolean, mensagem: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: `${window.location.origin}/redefinir-senha`
    })

    if (error) {
      return {
        sucesso: false,
        mensagem: error.message
      }
    }

    return {
      sucesso: true,
      mensagem: 'Se este email existir, você receberá instruções de recuperação.'
    }
  } catch (error) {
    return {
      sucesso: false,
      mensagem: 'Erro ao processar solicitação. Tente novamente.'
    }
  }
}
