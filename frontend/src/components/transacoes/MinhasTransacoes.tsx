import { CheckIcon, XIcon, ClockIcon, ArrowDownIcon, CreditCardIcon } from '../ui/Icons'

interface Transacao {
  id: string
  tipo: 'saque' | 'credito'
  valor: number
  valorEuro?: number
  telefone?: string
  motivo?: string
  data: string
  status: 'pendente' | 'aprovado' | 'negado'
  parcelas?: number
  periodo?: number
  valorTotal?: number
  valorParcela?: number
  juros?: number
}

interface MinhasTransacoesProps {
  transacoes: Transacao[]
}

const MinhasTransacoes = ({ transacoes }: MinhasTransacoesProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckIcon size="md" className="text-brand-600 dark:text-brand-500" />
      case 'negado':
        return <XIcon size="md" className="text-red-600 dark:text-red-500" />
      default:
        return <ClockIcon size="md" className="text-yellow-600 dark:text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'Aprovado'
      case 'negado':
        return 'Negado'
      default:
        return 'Pendente'
    }
  }

  const getTipoIcon = (tipo: string) => {
    return tipo === 'saque' ? (
      <ArrowDownIcon size="md" className="text-brand-600 dark:text-brand-500" />
    ) : (
      <CreditCardIcon size="md" className="text-black dark:text-brand-400" />
    )
  }

  const getTipoText = (tipo: string) => {
    return tipo === 'saque' ? 'Saque MBway' : 'Solicitação de Crédito'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-3">Minhas Transações</h3>
        <span className="text-sm text-muted">{transacoes.length} total</span>
      </div>

      {transacoes.length === 0 ? (
        <div className="card text-center py-12">
          <ClockIcon size="lg" className="mx-auto mb-4 text-neutral-400" />
          <p className="text-body">Nenhuma transação ainda</p>
          <p className="text-muted text-sm mt-2">
            Faça um saque via MBway ou solicite crédito para começar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transacoes.map((transacao) => (
            <div key={transacao.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800">
              <div className="flex items-start gap-3">
                {/* Ícone do Tipo */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transacao.tipo === 'saque' 
                    ? 'bg-brand-100 dark:bg-brand-950' 
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  {getTipoIcon(transacao.tipo)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-black dark:text-white text-base">
                      {getTipoText(transacao.tipo)}
                    </p>
                    <span className={`status-${transacao.status} text-xs`}>
                      {getStatusText(transacao.status)}
                    </span>
                  </div>

                  <p className="text-brand-600 dark:text-brand-500 font-bold text-lg mb-1">
                    {transacao.valor.toLocaleString('pt-PT')} X88
                  </p>
                  
                  {transacao.valorEuro && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                      €{transacao.valorEuro.toFixed(2).replace('.', ',')}
                    </p>
                  )}

                  {transacao.telefone && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs flex items-center gap-1">
                      <span>📱</span>
                      <span>{transacao.telefone}</span>
                    </p>
                  )}

                  <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-2">
                    {formatDate(transacao.data)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MinhasTransacoes
