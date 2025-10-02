import MinhasTransacoes from '../transacoes/MinhasTransacoes'
import { HistoryIcon } from '../ui/Icons'

interface HistoricoPageProps {
  transacoes: any[]
}

const HistoricoPage = ({ transacoes }: HistoricoPageProps) => {
  return (
    <div className="p-4 pb-24">
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

        {/* Lista de Transações */}
        <MinhasTransacoes transacoes={transacoes} />
      </div>
    </div>
  )
}

export default HistoricoPage
