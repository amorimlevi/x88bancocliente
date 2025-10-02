import { CheckIcon, XIcon, ClockIcon, ArrowDownIcon, CreditCardIcon, ArrowUpIcon } from '../ui/Icons'

interface Transacao {
  id: string
  tipo: 'saque' | 'credito' | 'recebido' | 'transferencia'
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
  remetenteId?: string
  remetenteNome?: string
  destinatarioId?: string
  destinatarioNome?: string
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

  const getTipoIcon = (tipo: string, telefone?: string) => {
    // Detecta transferências antigas pelo campo telefone
    if (tipo === 'saque' && telefone?.includes('Transferência X88') || telefone?.startsWith('ID:')) {
      return <ArrowUpIcon size="md" className="text-red-600 dark:text-red-500" />
    }
    
    switch (tipo) {
      case 'saque':
        return <ArrowDownIcon size="md" className="text-brand-600 dark:text-brand-500" />
      case 'transferencia':
        return <ArrowUpIcon size="md" className="text-red-600 dark:text-red-500" />
      default:
        return <CreditCardIcon size="md" className="text-black dark:text-brand-400" />
    }
  }

  const getTipoText = (tipo: string, telefone?: string) => {
    // Detecta transferências antigas pelo campo telefone
    if (tipo === 'saque' && telefone?.includes('Transferência X88') || telefone?.startsWith('ID:')) {
      return 'Transferência X88'
    }
    
    switch (tipo) {
      case 'saque':
        return 'Saque MBway'
      case 'transferencia':
        return 'Transferência X88'
      default:
        return 'Solicitação de Crédito'
    }
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
                  (transacao.tipo === 'transferencia' || (transacao.tipo === 'saque' && (transacao.telefone?.includes('Transferência X88') || transacao.telefone?.startsWith('ID:'))))
                    ? 'bg-red-100 dark:bg-red-950'
                    : transacao.tipo === 'saque' 
                    ? 'bg-brand-100 dark:bg-brand-950' 
                    : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  {getTipoIcon(transacao.tipo, transacao.telefone)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-black dark:text-white text-base">
                      {getTipoText(transacao.tipo, transacao.telefone)}
                    </p>
                    <span className={`status-${transacao.status} text-xs`}>
                      {getStatusText(transacao.status)}
                    </span>
                  </div>

                  <p className={`font-bold text-lg mb-1 ${
                    (transacao.tipo === 'transferencia' || (transacao.tipo === 'saque' && (transacao.telefone?.includes('Transferência X88') || transacao.telefone?.startsWith('ID:'))))
                      ? 'text-red-600 dark:text-red-500' 
                      : 'text-brand-600 dark:text-brand-500'
                  }`}>
                    {(transacao.tipo === 'transferencia' || (transacao.tipo === 'saque' && (transacao.telefone?.includes('Transferência X88') || transacao.telefone?.startsWith('ID:')))) ? '-' : ''}{transacao.valor.toLocaleString('pt-PT')} X88
                  </p>
                  
                  {transacao.valorEuro && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                      €{transacao.valorEuro.toFixed(2).replace('.', ',')}
                    </p>
                  )}

                  {transacao.tipo === 'transferencia' && transacao.destinatarioId && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs flex items-center gap-1">
                      <span>👤</span>
                      <span>Para: {transacao.destinatarioNome || 'Usuário'} (ID: {transacao.destinatarioId})</span>
                    </p>
                  )}

                  {transacao.telefone && transacao.tipo !== 'transferencia' && (
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
