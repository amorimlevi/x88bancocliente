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
    const { data: carteira, error: carteiraError } = await supabase
      .from('carteira_x88')
      .select('saldo')
      .eq('cliente_id', clienteId)
      .single()

    if (carteiraError) throw carteiraError

    const saldoAnterior = parseFloat(carteira.saldo)
    const saldoNovo = tipo === 'credito' 
      ? saldoAnterior + valor 
      : saldoAnterior - valor

    const { data: transacao, error: transacaoError } = await supabase
      .from('transacoes_x88')
      .insert({
        cliente_id: clienteId,
        tipo,
        valor: valor.toString(),
        saldo_anterior: saldoAnterior.toString(),
        saldo_novo: saldoNovo.toString(),
        descricao,
        categoria,
        referencia_id: referenciaId
      })
      .select()
      .single()

    if (transacaoError) throw transacaoError

    const { error: updateError } = await supabase
      .from('carteira_x88')
      .update({ 
        saldo: saldoNovo.toString(),
        atualizado_em: new Date().toISOString()
      })
      .eq('cliente_id', clienteId)

    if (updateError) throw updateError

    return { success: true, data: transacao }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const transferirX88 = async (
  remetenteId: string,
  destinatarioId: string,
  valor: number
) => {
  if (!supabase) {
    return { success: false, error: 'Supabase não configurado' }
  }
  
  try {
    const { data: carteiraRemetente, error: errRemetente } = await supabase
      .from('carteira_x88')
      .select('saldo')
      .eq('cliente_id', remetenteId)
      .single()

    if (errRemetente) throw errRemetente

    const saldoRemetente = parseFloat(carteiraRemetente.saldo)

    if (saldoRemetente < valor) {
      throw new Error('Saldo insuficiente')
    }

    await criarTransacao(
      remetenteId,
      'debito',
      valor,
      `Transferência para ${destinatarioId}`,
      'transferencia',
      destinatarioId
    )

    await criarTransacao(
      destinatarioId,
      'credito',
      valor,
      `Transferência recebida de ${remetenteId}`,
      'transferencia',
      remetenteId
    )

    return { success: true }
  } catch (error: any) {
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
