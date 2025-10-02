import { CheckIcon, XIcon, ClockIcon } from '../ui/Icons'

interface Solicitacao {
  id: string
  valor: number
  motivo: string
  data: string
  status: 'pendente' | 'aprovado' | 'negado'
}

interface MinhasSolicitacoesProps {
  solicitacoes: Solicitacao[]
}

const MinhasSolicitacoes = ({ solicitacoes }: MinhasSolicitacoesProps) => {
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
        <h3 className="heading-3">Minhas Solicitações</h3>
        <span className="text-sm text-muted">{solicitacoes.length} total</span>
      </div>

      {solicitacoes.length === 0 ? (
        <div className="card text-center py-12">
          <ClockIcon size="lg" className="mx-auto mb-4 text-neutral-400" />
          <p className="text-body">Nenhuma solicitação ainda</p>
          <p className="text-muted text-sm mt-2">Clique no botão acima para criar sua primeira solicitação</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitacoes.map((solicitacao) => (
            <div key={solicitacao.id} className="card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="heading-3 text-brand-600 dark:text-brand-500">
                      €{solicitacao.valor.toFixed(2)}
                    </p>
                    <span className={`status-${solicitacao.status}`}>
                      {getStatusText(solicitacao.status)}
                    </span>
                  </div>
                  <p className="text-body mb-2">{solicitacao.motivo}</p>
                  <p className="text-muted text-sm">{formatDate(solicitacao.data)}</p>
                </div>
                <div className="ml-4">
                  {getStatusIcon(solicitacao.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MinhasSolicitacoes
