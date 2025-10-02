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
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
              <HistoryIcon size="md" className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Histórico</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Todas as suas transações
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Transações */}
        <MinhasTransacoes transacoes={transacoes} />
      </div>
    </div>
  )
}

export default HistoricoPage
