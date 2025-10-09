import { useState } from 'react'
import { CheckIcon, XIcon, ClockIcon, ArrowDownIcon, CreditCardIcon, ArrowUpIcon } from '../ui/Icons'
import { useTimezone } from '../../hooks/useTimezone'
import ComprovanteModal from './ComprovanteModal'

interface Transacao {
  id: string
  tipo: 'saque' | 'credito' | 'debito' | 'recebido' | 'transferencia' | 'x88'
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
  contraparte_nome?: string
  contraparte_carteira_id?: number
}

interface MinhasTransacoesProps {
  transacoes: Transacao[]
  semLimite?: boolean
  userId?: string
  nomeUsuario?: string
}

const MinhasTransacoes = ({ transacoes, semLimite = false, userId = '0001', nomeUsuario = 'Usuário' }: MinhasTransacoesProps) => {
  const { formatDate, formatTime } = useTimezone()
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | null>(null)
  
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
      case 'debito':
        return <ArrowUpIcon size="md" className="text-red-600 dark:text-red-500" />
      case 'credito':
        return <ArrowDownIcon size="md" className="text-green-600 dark:text-green-500" />
      case 'saque':
        return <ArrowDownIcon size="md" className="text-brand-600 dark:text-brand-500" />
      case 'transferencia':
        return <ArrowUpIcon size="md" className="text-red-600 dark:text-red-500" />
      case 'recebido':
        return <img src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" alt="X88" className="w-6 h-6 object-contain" />
      case 'x88':
        return <img src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" alt="X88" className="w-6 h-6 object-contain" />
      default:
        return <span className="text-xl font-bold text-black dark:text-brand-400">€</span>
    }
  }

  const getTipoText = (tipo: string, telefone?: string) => {
    // Detecta transferências antigas pelo campo telefone
    if (tipo === 'saque' && telefone?.includes('Transferência X88') || telefone?.startsWith('ID:')) {
      return 'Transferência X88'
    }
    
    switch (tipo) {
      case 'debito':
        return 'Transferência X88'
      case 'credito':
        return 'X88 Recebido'
      case 'saque':
        return 'Saque MBway'
      case 'transferencia':
        return 'Transferência X88'
      case 'recebido':
        return 'X88 Recebido'
      case 'x88':
        return 'Solicitação X88'
      default:
        return 'Solicitação de Empréstimo'
    }
  }

  const transacoesFiltradas = transacoes.filter(t => t.tipo !== 'saque' || t.telefone?.includes('Transferência X88') || t.telefone?.startsWith('ID:'))
  const transacoesExibidas = semLimite ? transacoesFiltradas : transacoesFiltradas.slice(0, 10)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-3">Minhas Transações</h3>
        <span className="text-sm text-muted">{transacoesExibidas.length} total</span>
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
          {transacoesExibidas.map((transacao) => (
            <div 
              key={transacao.id} 
              onClick={() => setTransacaoSelecionada(transacao)}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                {/* Ícone do Tipo */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transacao.tipo === 'debito' || (transacao.tipo === 'transferencia' || (transacao.tipo === 'saque' && (transacao.telefone?.includes('Transferência X88') || transacao.telefone?.startsWith('ID:'))))
                    ? 'bg-red-100 dark:bg-red-950'
                    : transacao.tipo === 'credito'
                    ? 'bg-green-100 dark:bg-green-950'
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

                  <p 
                     style={{
                       color: (transacao.tipo === 'x88') && transacao.status === 'pendente'
                         ? '#fcc508'
                         : undefined
                     }}
                     className={`font-bold text-lg mb-1 ${
                       transacao.tipo === 'x88' && transacao.status === 'pendente'
                         ? ''
                         : transacao.tipo === 'recebido' || transacao.tipo === 'credito'
                         ? 'text-green-600 dark:text-green-500'
                         : (transacao.tipo === 'debito' || transacao.tipo === 'transferencia' || (transacao.tipo === 'saque' && (transacao.telefone?.includes('Transferência X88') || transacao.telefone?.startsWith('ID:'))))
                         ? 'text-red-600 dark:text-red-500' 
                         : 'text-brand-600 dark:text-brand-500'
                  }`}>
                    {(transacao.tipo === 'debito' || transacao.tipo === 'transferencia' || (transacao.tipo === 'saque' && (transacao.telefone?.includes('Transferência X88') || transacao.telefone?.startsWith('ID:')))) ? '-' : (transacao.tipo === 'recebido' || transacao.tipo === 'credito') ? '+' : ''}{transacao.valor.toLocaleString('pt-PT')} X88
                  </p>
                  
                  {transacao.valorEuro && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-1">
                      €{transacao.valorEuro.toFixed(2).replace('.', ',')}
                    </p>
                  )}

                  {(transacao.tipo === 'debito' || transacao.tipo === 'transferencia') && (transacao.destinatarioId || transacao.contraparte_nome) && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                      Para: {transacao.contraparte_nome || transacao.destinatarioNome || 'Usuário'} (Conta: {transacao.contraparte_carteira_id || transacao.destinatarioId})
                    </p>
                  )}

                  {(transacao.tipo === 'credito' || transacao.tipo === 'recebido') && (transacao.remetenteId || transacao.contraparte_nome) && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                      De: {transacao.contraparte_nome || transacao.remetenteNome || 'Usuário'} (Conta: {transacao.contraparte_carteira_id || transacao.remetenteId})
                    </p>
                  )}

                  {transacao.telefone && transacao.tipo !== 'transferencia' && transacao.tipo !== 'recebido' && (
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{transacao.telefone}</span>
                    </p>
                  )}

                  <p className="text-neutral-400 dark:text-neutral-500 text-xs mt-2">
                    {formatDate(transacao.data)} às {formatTime(transacao.data)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Comprovante */}
      {transacaoSelecionada && (
        <ComprovanteModal
          transacao={transacaoSelecionada}
          onClose={() => setTransacaoSelecionada(null)}
          userId={userId}
          nomeUsuario={nomeUsuario}
        />
      )}
    </div>
  )
}

export default MinhasTransacoes
