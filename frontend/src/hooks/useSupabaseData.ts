import { useState, useEffect } from 'react'
import { supabase, Cliente, CarteiraX88, TransacaoX88, Solicitacao } from '../lib/supabase'

export const useCliente = (clienteId: string | null) => {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clienteId || !supabase) {
      setLoading(false)
      return
    }

    const fetchCliente = async () => {
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', clienteId)
          .single()

        if (error) throw error
        setCliente(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCliente()
  }, [clienteId])

  return { cliente, loading, error }
}

export const useCarteira = (clienteId: string | null) => {
  const [carteira, setCarteira] = useState<CarteiraX88 | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clienteId || !supabase) {
      setLoading(false)
      return
    }

    const fetchCarteira = async () => {
      try {
        const { data, error } = await supabase
          .from('carteira_x88')
          .select('*')
          .eq('cliente_id', clienteId)
          .single()

        if (error) throw error
        setCarteira(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCarteira()

    const channel = supabase
      .channel(`carteira:${clienteId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'carteira_x88',
        filter: `cliente_id=eq.${clienteId}`
      }, (payload) => {
        setCarteira(payload.new as CarteiraX88)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clienteId])

  const atualizarCarteira = async () => {
    if (!clienteId) return
    
    try {
      const { data, error } = await supabase
        .from('carteira_x88')
        .select('*')
        .eq('cliente_id', clienteId)
        .single()

      if (error) throw error
      setCarteira(data)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return { carteira, loading, error, atualizarCarteira }
}

export const useTransacoes = (clienteId: string | null) => {
  const [transacoes, setTransacoes] = useState<TransacaoX88[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clienteId || !supabase) {
      setLoading(false)
      return
    }

    const fetchTransacoes = async () => {
      try {
        const { data, error } = await supabase
          .from('transacoes_x88')
          .select('*')
          .eq('cliente_id', clienteId)
          .order('criado_em', { ascending: false })

        if (error) throw error
        setTransacoes(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTransacoes()

    const channel = supabase
      .channel(`transacoes:${clienteId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'transacoes_x88',
        filter: `cliente_id=eq.${clienteId}`
      }, (payload) => {
        setTransacoes(prev => [payload.new as TransacaoX88, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clienteId])

  return { transacoes, loading, error }
}

export const useSolicitacoes = (clienteId: string | null) => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!clienteId || !supabase) {
      setLoading(false)
      return
    }

    const fetchSolicitacoes = async () => {
      try {
        const { data, error } = await supabase
          .from('solicitacoes')
          .select('*')
          .eq('cliente_id', clienteId)
          .order('data_solicitacao', { ascending: false })

        if (error) throw error
        setSolicitacoes(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSolicitacoes()

    const channel = supabase
      .channel(`solicitacoes:${clienteId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'solicitacoes',
        filter: `cliente_id=eq.${clienteId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setSolicitacoes(prev => [payload.new as Solicitacao, ...prev])
        } else if (payload.eventType === 'UPDATE') {
          setSolicitacoes(prev => prev.map(s => 
            s.id === payload.new.id ? payload.new as Solicitacao : s
          ))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [clienteId])

  return { solicitacoes, loading, error }
}
