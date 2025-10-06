import { supabase } from '../lib/supabase'

export interface Cliente {
  id: string
  nome: string
  email: string
  senha_hash?: string
  telefone?: string
  tentativas_falhas: number
  bloqueado_ate?: string
  ultimo_acesso?: string
  ativo: boolean
  status: string
  origem: string
  criado_em: string
  atualizado_em: string
}

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

// Login com email e senha
export async function login(email: string, senha: string): Promise<LoginResponse> {
  try {
    // Buscar cliente
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !cliente) {
      return {
        sucesso: false,
        mensagem: 'Email ou senha incorretos'
      }
    }

    // Verificar se tem senha cadastrada
    if (!cliente.senha_hash) {
      return {
        sucesso: false,
        mensagem: 'Conta sem senha cadastrada. Entre em contato com o suporte.'
      }
    }

    // Verificar se está bloqueado
    if (cliente.bloqueado_ate && new Date(cliente.bloqueado_ate) > new Date()) {
      return {
        sucesso: false,
        mensagem: 'Conta temporariamente bloqueada. Tente novamente mais tarde.'
      }
    }

    // Verificar se está ativo
    if (!cliente.ativo) {
      return {
        sucesso: false,
        mensagem: 'Conta desativada. Entre em contato com o suporte.'
      }
    }

    // Verificar senha usando função do Supabase
    const { data: verificacao } = await supabase.rpc('verificar_senha', {
      p_senha: senha,
      p_senha_hash: cliente.senha_hash
    })
    
    const senhaCorreta = verificacao === true

    if (!senhaCorreta) {
      // Incrementar tentativas falhas
      const novasTentativas = (cliente.tentativas_falhas || 0) + 1
      const bloqueadoAte = novasTentativas >= 5 
        ? new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
        : null

      await supabase
        .from('clientes')
        .update({ 
          tentativas_falhas: novasTentativas,
          bloqueado_ate: bloqueadoAte
        })
        .eq('id', cliente.id)

      if (bloqueadoAte) {
        return {
          sucesso: false,
          mensagem: 'Muitas tentativas falhas. Conta bloqueada por 30 minutos.'
        }
      }

      return {
        sucesso: false,
        mensagem: `Email ou senha incorretos. ${5 - novasTentativas} tentativas restantes.`
      }
    }

    // Login bem-sucedido - atualizar último acesso
    await supabase
      .from('clientes')
      .update({ 
        tentativas_falhas: 0,
        bloqueado_ate: null,
        ultimo_acesso: new Date().toISOString()
      })
      .eq('id', cliente.id)

    return {
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      cliente_id: cliente.id,
      email: cliente.email
    }

  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return {
      sucesso: false,
      mensagem: 'Erro ao processar login. Tente novamente.'
    }
  }
}

// Adicionar senha a um cliente existente
export async function adicionarSenha(
  clienteId: string,
  senha: string
): Promise<RegistroResponse> {
  try {
    // Criar hash da senha usando função do Supabase
    const { data: senhaHash } = await supabase.rpc('criar_hash_senha', {
      p_senha: senha
    })

    if (!senhaHash) {
      return {
        sucesso: false,
        mensagem: 'Erro ao processar senha'
      }
    }

    // Atualizar cliente com senha
    const { error } = await supabase
      .from('clientes')
      .update({
        senha_hash: senhaHash,
        ativo: true
      })
      .eq('id', clienteId)

    if (error) {
      console.error('Erro ao adicionar senha:', error)
      return {
        sucesso: false,
        mensagem: 'Erro ao configurar senha. Tente novamente.'
      }
    }

    return {
      sucesso: true,
      mensagem: 'Senha configurada com sucesso!',
      cliente_id: clienteId
    }

  } catch (error) {
    console.error('Erro ao adicionar senha:', error)
    return {
      sucesso: false,
      mensagem: 'Erro ao configurar senha. Tente novamente.'
    }
  }
}

// Verificar se email está disponível
export async function verificarEmailDisponivel(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('clientes')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single()

  return !data
}

// Solicitar recuperação de senha (simplificado - apenas para contato com suporte)
export async function solicitarRecuperacao(email: string): Promise<{ sucesso: boolean, mensagem: string }> {
  try {
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('email', email.toLowerCase().trim())
      .single()

    // Não revelar se email existe ou não por segurança
    return {
      sucesso: true,
      mensagem: 'Se este email existir, entre em contato com o suporte para recuperar sua senha.'
    }

  } catch (error) {
    return {
      sucesso: true,
      mensagem: 'Se este email existir, entre em contato com o suporte para recuperar sua senha.'
    }
  }
}
