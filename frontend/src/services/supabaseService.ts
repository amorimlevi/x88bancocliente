import { supabase } from '../lib/supabase'

export const criarSolicitacao = async (
  clienteId: string,
  clienteNome: string,
  tipo: 'adiantamento' | 'emprestimo' | 'reembolso' | 'x88',
  tipoMoeda: 'euro' | 'x88',
  valor: number,
  parcelas: number,
  descricao: string,
  justificativa: string,
  dataVencimento?: string
) => {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' }
  }
  
  try {
    const { data, error } = await supabase
      .from('solicitacoes')
      .insert({
        cliente_id: clienteId,
        cliente_nome: clienteNome,
        tipo,
        tipo_moeda: tipoMoeda,
        valor: valor.toString(),
        parcelas: parcelas.toString(),
        descricao,
        justificativa,
        data_solicitacao: new Date().toISOString(),
        data_vencimento: dataVencimento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pendente',
        prioridade: 'media'
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const criarTransacao = async (
  clienteId: string,
  tipo: 'credito' | 'debito',
  valor: number,
  descricao: string,
  categoria: string,
  referenciaId?: string
) => {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' }
  }
  
  try {
    console.log('🔍 Buscando carteira para cliente:', clienteId)
    const { data: carteira, error: carteiraError } = await supabase
      .from('carteira_x88')
      .select('saldo')
      .eq('cliente_id', clienteId)
      .single()

    if (carteiraError) {
      console.error('❌ Erro ao buscar carteira:', carteiraError)
      throw new Error(`Erro ao buscar carteira: ${carteiraError.message}`)
    }

    const saldoAnterior = parseFloat(carteira.saldo)
    const saldoNovo = tipo === 'credito' 
      ? saldoAnterior + valor 
      : saldoAnterior - valor

    console.log('💰 Criando transação:', { clienteId, tipo, valor, saldoAnterior, saldoNovo })

    const transacaoData: any = {
      cliente_id: clienteId,
      tipo,
      valor: valor.toString(),
      saldo_anterior: saldoAnterior.toString(),
      saldo_novo: saldoNovo.toString(),
      descricao,
      categoria
    }

    // Adicionar referencia_id como inteiro se fornecido
    if (referenciaId) {
      const referenciaNum = parseInt(referenciaId)
      if (!isNaN(referenciaNum)) {
        transacaoData.referencia_id = referenciaNum
      }
    }

    const { data: transacao, error: transacaoError } = await supabase
      .from('transacoes_x88')
      .insert(transacaoData)
      .select()
      .single()

    if (transacaoError) {
      console.error('❌ Erro ao criar transação:', transacaoError)
      throw new Error(`Erro ao criar transação: ${transacaoError.message}`)
    }

    console.log('✅ Transação criada, atualizando saldo...')

    const { error: updateError } = await supabase
      .from('carteira_x88')
      .update({ 
        saldo: saldoNovo.toString(),
        atualizado_em: new Date().toISOString()
      })
      .eq('cliente_id', clienteId)

    if (updateError) {
      console.error('❌ Erro ao atualizar saldo:', updateError)
      throw new Error(`Erro ao atualizar saldo: ${updateError.message}`)
    }

    console.log('✅ Transação completa!')
    return { success: true, data: transacao }
  } catch (error: any) {
    console.error('❌ Erro geral em criarTransacao:', error)
    return { success: false, error: error.message }
  }
}

// Buscar destinatário por ID da carteira (pode ser cliente ou gestor)
export const buscarDestinatarioPorIdCarteira = async (idCarteira: string) => {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' }
  }

  try {
    // Buscar em carteira_x88 (clientes)
    const { data: carteiraCliente, error: errCliente } = await supabase
      .from('carteira_x88')
      .select('id, cliente_id, clientes(id, nome, email, dados_bancarios)')
      .eq('id', parseInt(idCarteira))
      .maybeSingle()

    if (carteiraCliente && carteiraCliente.clientes) {
      return {
        success: true,
        destinatario: {
          id: String(carteiraCliente.id),
          clienteId: carteiraCliente.cliente_id,
          nome: carteiraCliente.clientes.nome,
          email: carteiraCliente.clientes.email,
          dados_bancarios: carteiraCliente.clientes.dados_bancarios,
          tipo: 'cliente'
        }
      }
    }

    // Buscar em carteira_x88_gestor (gestores)
    const { data: carteiraGestor, error: errGestor } = await supabase
      .from('carteira_x88_gestor')
      .select('id, gestor_id, gestores(id, nome_completo, email)')
      .eq('id', parseInt(idCarteira))
      .maybeSingle()

    if (carteiraGestor && carteiraGestor.gestores) {
      return {
        success: true,
        destinatario: {
          id: String(carteiraGestor.id),
          gestorId: carteiraGestor.gestor_id,
          nome: carteiraGestor.gestores.nome_completo,
          email: carteiraGestor.gestores.email,
          dados_bancarios: null,
          tipo: 'gestor'
        }
      }
    }

    return { success: false, error: 'Destinatário não encontrado' }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const transferirX88 = async (
  remetenteId: string,
  destinatarioIdCarteira: string,
  valor: number
) => {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' }
  }

  try {
    console.log('💸 Iniciando transferência:', { remetenteId, destinatarioIdCarteira, valor })

    // 1. Buscar destinatário (pode ser cliente ou gestor)
    console.log('🔍 Buscando destinatário...')
    const resultBusca = await buscarDestinatarioPorIdCarteira(destinatarioIdCarteira)
    
    if (!resultBusca.success || !resultBusca.destinatario) {
      console.error('❌ Destinatário não encontrado')
      throw new Error('Destinatário não encontrado')
    }

    const destinatario = resultBusca.destinatario
    console.log('✅ Destinatário encontrado:', destinatario.nome, 'Tipo:', destinatario.tipo)

    // 2. Executar função SQL registrar_transferencia_x88
    const destinatarioTipo = destinatario.tipo
    const destinatarioId = destinatario.tipo === 'cliente' 
      ? (destinatario as any).clienteId 
      : (destinatario as any).gestorId

    console.log('📞 Chamando função SQL registrar_transferencia_x88...')
    const { data, error } = await supabase.rpc('registrar_transferencia_x88', {
      p_remetente_tipo: 'cliente',
      p_remetente_id: parseInt(remetenteId),
      p_destinatario_tipo: destinatarioTipo,
      p_destinatario_id: parseInt(destinatarioId),
      p_valor: valor,
      p_categoria: 'transferencia',
      p_descricao: `Transferência para ${destinatario.nome}`
    })

    if (error) {
      console.error('❌ Erro ao chamar função SQL:', error)
      throw new Error(error.message)
    }

    if (!data || !data.sucesso) {
      console.error('❌ Função retornou erro:', data?.mensagem)
      throw new Error(data?.mensagem || 'Erro ao processar transferência')
    }

    console.log('✅ Transferência completa!', data)
    return { 
      success: true, 
      destinatario: {
        nome: destinatario.nome,
        tipo: destinatario.tipo
      },
      data
    }
  } catch (error: any) {
    console.error('❌ Erro geral em transferirX88:', error)
    return { success: false, error: error.message }
  }
}

export const atualizarCliente = async (
  clienteId: string,
  dados: Partial<{
    nome: string
    telefone: string
    endereco: any
    dados_bancarios: any
  }>
) => {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' }
  }
  
  try {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        ...dados,
        atualizado_em: new Date().toISOString()
      })
      .eq('id', clienteId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
