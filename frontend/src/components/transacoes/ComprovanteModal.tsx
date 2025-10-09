import { useRef } from 'react'
import { XIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon } from '../ui/Icons'
import { useTimezone } from '../../hooks/useTimezone'
import html2canvas from 'html2canvas'

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

interface ComprovanteModalProps {
  transacao: Transacao
  onClose: () => void
  userId?: string
  nomeUsuario?: string
}

const ComprovanteModal = ({ transacao, onClose, userId = '0001', nomeUsuario = 'Usuário' }: ComprovanteModalProps) => {
  const comprovanteRef = useRef<HTMLDivElement>(null)
  const { formatDate, formatTime } = useTimezone()

  const getTipoTransacao = () => {
    if (transacao.tipo === 'debito' || transacao.tipo === 'transferencia') {
      return 'Transferência enviada'
    }
    if (transacao.tipo === 'credito' || transacao.tipo === 'recebido') {
      return 'Transferência recebida'
    }
    if (transacao.tipo === 'saque') {
      return 'Saque MBway'
    }
    if (transacao.tipo === 'x88') {
      return 'Solicitação X88'
    }
    return 'Transação'
  }

  const compartilharComprovante = async () => {
    if (!comprovanteRef.current) return

    try {
      const canvas = await html2canvas(comprovanteRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `comprovante-${transacao.id}.png`, { type: 'image/png' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Comprovante de Transação',
              text: `Comprovante - ${getTipoTransacao()}`,
            })
          } catch (err) {
            console.log('Compartilhamento cancelado ou erro:', err)
            baixarComprovante(canvas)
          }
        } else {
          baixarComprovante(canvas)
        }
      })
    } catch (error) {
      console.error('Erro ao gerar comprovante:', error)
    }
  }

  const baixarComprovante = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a')
    link.download = `comprovante-${transacao.id}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-black dark:text-white">Comprovante</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <XIcon size="md" className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Comprovante */}
        <div ref={comprovanteRef} className="p-6 bg-white">
          {/* Logo e Status */}
          <div className="text-center mb-6">
            <img 
              src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759232674/LOGOTIPO_X88_PNG.fw_vjg6f1.png" 
              alt="X88 Bank"
              className="w-24 h-20 object-contain mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-black mb-2">{getTipoTransacao()}</h3>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100">
              <CheckIcon size="sm" className="text-brand-600" />
              <span className="text-sm font-semibold text-brand-600">
                {transacao.status === 'aprovado' ? 'Concluída' : transacao.status === 'pendente' ? 'Pendente' : 'Negada'}
              </span>
            </div>
          </div>

          {/* Valor Principal */}
          <div className="text-center mb-8 pb-6 border-b-2 border-dashed border-neutral-200">
            <p className="text-sm text-neutral-500 mb-2">Valor</p>
            <p className={`text-5xl font-bold ${
              transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
                ? 'text-red-600'
                : 'text-green-600'
            }`}>
              {(transacao.tipo === 'debito' || transacao.tipo === 'transferencia') ? '-' : '+'}{transacao.valor.toLocaleString('pt-PT')} X88
            </p>
            {transacao.valorEuro && (
              <p className="text-lg text-neutral-600 mt-2">
                €{transacao.valorEuro.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>

          {/* Detalhes da Transação */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-start py-3 border-b border-neutral-100">
              <span className="text-sm text-neutral-500 font-medium">Data</span>
              <span className="text-sm text-black font-semibold text-right">{formatDate(transacao.data)}</span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-neutral-100">
              <span className="text-sm text-neutral-500 font-medium">Hora</span>
              <span className="text-sm text-black font-semibold text-right">{formatTime(transacao.data)}</span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-neutral-100">
              <span className="text-sm text-neutral-500 font-medium">ID da Transação</span>
              <span className="text-xs text-black font-mono font-semibold text-right break-all max-w-[60%]">{transacao.id}</span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-neutral-100">
              <span className="text-sm text-neutral-500 font-medium">Tipo</span>
              <span className="text-sm text-black font-semibold text-right">{getTipoTransacao()}</span>
            </div>

            {(transacao.tipo === 'debito' || transacao.tipo === 'transferencia') && (
              <>
                <div className="flex justify-between items-start py-3 border-b border-neutral-100">
                  <span className="text-sm text-neutral-500 font-medium">De</span>
                  <div className="text-right">
                    <p className="text-sm text-black font-semibold">{nomeUsuario}</p>
                    <p className="text-xs text-neutral-500">Conta: {userId}</p>
                  </div>
                </div>

                <div className="flex justify-between items-start py-3 border-b border-neutral-100">
                  <span className="text-sm text-neutral-500 font-medium">Para</span>
                  <div className="text-right">
                    <p className="text-sm text-black font-semibold">{transacao.contraparte_nome || transacao.destinatarioNome || 'Usuário'}</p>
                    <p className="text-xs text-neutral-500">Conta: {transacao.contraparte_carteira_id || transacao.destinatarioId}</p>
                  </div>
                </div>
              </>
            )}

            {(transacao.tipo === 'credito' || transacao.tipo === 'recebido') && (
              <>
                <div className="flex justify-between items-start py-3 border-b border-neutral-100">
                  <span className="text-sm text-neutral-500 font-medium">De</span>
                  <div className="text-right">
                    <p className="text-sm text-black font-semibold">{transacao.contraparte_nome || transacao.remetenteNome || 'Usuário'}</p>
                    <p className="text-xs text-neutral-500">Conta: {transacao.contraparte_carteira_id || transacao.remetenteId}</p>
                  </div>
                </div>

                <div className="flex justify-between items-start py-3 border-b border-neutral-100">
                  <span className="text-sm text-neutral-500 font-medium">Para</span>
                  <div className="text-right">
                    <p className="text-sm text-black font-semibold">{nomeUsuario}</p>
                    <p className="text-xs text-neutral-500">Conta: {userId}</p>
                  </div>
                </div>
              </>
            )}

            {transacao.telefone && (
              <div className="flex justify-between items-start py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-500 font-medium">Telefone</span>
                <span className="text-sm text-black font-semibold text-right">{transacao.telefone}</span>
              </div>
            )}

            {transacao.motivo && (
              <div className="flex justify-between items-start py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-500 font-medium">Descrição</span>
                <span className="text-sm text-black font-semibold text-right max-w-[60%]">{transacao.motivo}</span>
              </div>
            )}
          </div>

          {/* Rodapé */}
          <div className="pt-4 border-t-2 border-dashed border-neutral-200 text-center">
            <p className="text-xs text-neutral-400 mb-1">X88 Bank - Seu banco digital</p>
            <p className="text-xs text-neutral-400">Comprovante gerado em {formatDate(new Date().toISOString())} às {formatTime(new Date().toISOString())}</p>
          </div>
        </div>

        {/* Botão Compartilhar */}
        <div className="sticky bottom-0 bg-white dark:bg-neutral-900 p-4 border-t border-neutral-200 dark:border-neutral-800 rounded-b-3xl">
          <button
            onClick={compartilharComprovante}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Compartilhar Comprovante
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComprovanteModal
