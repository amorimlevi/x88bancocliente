import { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon } from '../ui/Icons'

interface PagamentoPendente {
  id: string
  emprestimoId: string
  valorParcela: number
  userId: string
  userName: string
  data: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
}

const GestorPagamentosPage = () => {
  const [pagamentos, setPagamentos] = useState<PagamentoPendente[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarModalRejeicao, setMostrarModalRejeicao] = useState(false)
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState<PagamentoPendente | null>(null)
  const [motivoRejeicao, setMotivoRejeicao] = useState('')

  const carregarPagamentos = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/pagamentos-pendentes')
      const data = await response.json()
      if (data.success) {
        setPagamentos(data.pagamentos)
      }
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPagamentos()
    // Recarregar a cada 10 segundos
    const interval = setInterval(carregarPagamentos, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleAprovar = async (pagamentoId: string) => {
    try {
      const response = await fetch('http://localhost:3002/api/aprovar-pagamento-parcela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pagamentoId })
      })

      const data = await response.json()

      if (data.success) {
        alert('Pagamento aprovado com sucesso!')
        carregarPagamentos()
      }
    } catch (error) {
      console.error('Erro ao aprovar pagamento:', error)
      alert('Erro ao aprovar pagamento. Tente novamente.')
    }
  }

  const handleAbrirModalRejeicao = (pagamento: PagamentoPendente) => {
    setPagamentoSelecionado(pagamento)
    setMostrarModalRejeicao(true)
  }

  const handleRejeitar = async () => {
    if (!pagamentoSelecionado) return

    try {
      const response = await fetch('http://localhost:3002/api/rejeitar-pagamento-parcela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pagamentoId: pagamentoSelecionado.id,
          motivo: motivoRejeicao || 'Sem motivo especificado'
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Pagamento rejeitado.')
        setMostrarModalRejeicao(false)
        setPagamentoSelecionado(null)
        setMotivoRejeicao('')
        carregarPagamentos()
      }
    } catch (error) {
      console.error('Erro ao rejeitar pagamento:', error)
      alert('Erro ao rejeitar pagamento. Tente novamente.')
    }
  }

  return (
    <div className="p-4 min-h-full">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
            Aprovação de Pagamentos
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Gerencie as solicitações de pagamento de parcelas
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">Carregando...</p>
          </div>
        ) : pagamentos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500 dark:text-neutral-400">
              Nenhum pagamento pendente no momento
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pagamentos.map((pagamento) => (
              <div 
                key={pagamento.id} 
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {pagamento.valorParcela.toFixed(2)} €
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {pagamento.userName} (ID: {pagamento.userId})
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                    Pendente
                  </span>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">ID do Empréstimo:</span>
                    <span className="font-semibold text-black dark:text-white text-sm">
                      {pagamento.emprestimoId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Data da Solicitação:</span>
                    <span className="font-semibold text-black dark:text-white text-sm">
                      {new Date(pagamento.data).toLocaleString('pt-PT')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAbrirModalRejeicao(pagamento)}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircleIcon size="sm" />
                    Rejeitar
                  </button>
                  <button
                    onClick={() => handleAprovar(pagamento.id)}
                    className="flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon size="sm" />
                    Aprovar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Rejeição */}
        {mostrarModalRejeicao && pagamentoSelecionado && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setMostrarModalRejeicao(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                Rejeitar Pagamento
              </h3>

              <div className="bg-red-50 dark:bg-red-950 border-2 border-red-300 dark:border-red-700 p-4 rounded-xl mb-4">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
                  Valor:
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {pagamentoSelecionado.valorParcela.toFixed(2)} €
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                  Usuário: {pagamentoSelecionado.userName}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Motivo da rejeição (opcional)
                </label>
                <textarea
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  className="input w-full min-h-[100px]"
                  placeholder="Digite o motivo da rejeição..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMostrarModalRejeicao(false)
                    setPagamentoSelecionado(null)
                    setMotivoRejeicao('')
                  }}
                  className="flex-1 p-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejeitar}
                  className="flex-1 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Confirmar Rejeição
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GestorPagamentosPage
