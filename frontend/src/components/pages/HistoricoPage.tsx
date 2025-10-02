import { useState } from 'react'
import MinhasTransacoes from '../transacoes/MinhasTransacoes'
import { HistoryIcon } from '../ui/Icons'

interface HistoricoPageProps {
  transacoes: any[]
}

const HistoricoPage = ({ transacoes }: HistoricoPageProps) => {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')

  const transacoesFiltradas = transacoes.filter(transacao => {
    if (!dataInicio && !dataFim) return true
    
    const dataTransacao = new Date(transacao.data)
    const inicio = dataInicio ? new Date(dataInicio) : null
    const fim = dataFim ? new Date(dataFim) : null

    if (inicio && fim) {
      return dataTransacao >= inicio && dataTransacao <= fim
    } else if (inicio) {
      return dataTransacao >= inicio
    } else if (fim) {
      return dataTransacao <= fim
    }
    return true
  })

  const limparFiltros = () => {
    setDataInicio('')
    setDataFim('')
  }

  return (
    <div className="p-4 pt-6 pb-24 scroll-container-ios">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" style={{ color: '#15FF5D' }}>
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Histórico</h1>
        </div>

        {/* Filtro de Data */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 mb-4">
          <h3 className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
            <span>📅</span>
            Filtrar por período
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Data inicial</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-600 dark:text-neutral-400 mb-1">Data final</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-black dark:text-white text-sm"
              />
            </div>
          </div>
          {(dataInicio || dataFim) && (
            <button
              onClick={limparFiltros}
              className="mt-3 w-full py-2 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Lista de Transações */}
        <MinhasTransacoes transacoes={transacoesFiltradas} semLimite />
      </div>
    </div>
  )
}

export default HistoricoPage
