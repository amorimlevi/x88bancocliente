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
.single()

if (!errCliente && carteiraCliente) {
      return {
    success: true,
        destinatario: {
      id: carteiraCliente.cliente_id,
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
.single()

if (!errGestor && carteiraGestor) {
return {
  success: true,
  destinatario: {
    id: carteiraGestor.gestor_id,
    nome: carteiraGestor.gestores.nome_completo,
      email: carteiraGestor.gestores.email,
          dados_bancarios: null, // Gestor pode ter dados bancários próprios
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
    // 1. Buscar carteira do remetente (sempre cliente)
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

    // 2. Buscar destinatário (pode ser cliente ou gestor)
    const resultBusca = await buscarDestinatarioPorIdCarteira(destinatarioIdCarteira)
    
    if (!resultBusca.success || !resultBusca.destinatario) {
      throw new Error('Destinatário não encontrado')
    }

    const destinatario = resultBusca.destinatario

    // 3. Débito do remetente
    await criarTransacao(
      remetenteId,
      'debito',
      valor,
      `Transferência para ${destinatario.nome}`,
      'transferencia',
      destinatarioIdCarteira
    )

    // 4. Crédito do destinatário (cliente ou gestor)
    if (destinatario.tipo === 'cliente') {
      await criarTransacao(
        destinatario.id,
        'credito',
        valor,
        `Transferência recebida de cliente`,
        'transferencia',
        remetenteId
      )
    } else {
      // Para gestor, criar transação na tabela de gestores (se existir)
      // Por enquanto, apenas atualizar saldo da carteira do gestor
      const { data: carteiraGestor } = await supabase
        .from('carteira_x88_gestor')
        .select('saldo')
        .eq('gestor_id', destinatario.id)
        .single()

      if (carteiraGestor) {
        const novoSaldo = parseFloat(carteiraGestor.saldo) + valor
        
        await supabase
          .from('carteira_x88_gestor')
          .update({
            saldo: novoSaldo.toString(),
            total_recebido: supabase.raw(`total_recebido + ${valor}`),
            atualizado_em: new Date().toISOString()
          })
          .eq('gestor_id', destinatario.id)
      }
    }

    return { 
      success: true, 
      destinatario: {
        nome: destinatario.nome,
        tipo: destinatario.tipo
      }
    }
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
