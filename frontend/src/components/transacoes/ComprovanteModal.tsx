import { useRef, useEffect, useState } from 'react'
import { XIcon, CheckIcon, ArrowUpIcon, ArrowDownIcon } from '../ui/Icons'
import { useTimezone } from '../../hooks/useTimezone'
import { buscarDestinatarioPorIdCarteira } from '../../services/supabaseService'
import { supabase } from '../../lib/supabase'
import html2canvas from 'html2canvas'
import logoX88 from '../../assets/images/LOGOTIPO X88 BLACK PNG.fw.png'

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
  userEmail?: string
  userTelefone?: string
}

const ComprovanteModal = ({ transacao, onClose, userId = '0001', nomeUsuario = 'Usuário', userEmail, userTelefone }: ComprovanteModalProps) => {
  const comprovanteRef = useRef<HTMLDivElement>(null)
  const { formatDateTime, formatCurrency } = useTimezone()
  const [contraparteEmail, setContraparteEmail] = useState<string>('')
  const [contraparteTelefone, setContraparteTelefone] = useState<string>('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const buscarDadosContraparte = async () => {
      try {
        const contraparteId = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
          ? transacao.contraparte_carteira_id?.toString() || transacao.destinatarioId
          : transacao.contraparte_carteira_id?.toString() || transacao.remetenteId

        if (contraparteId) {
          const infoContraparte = await buscarDestinatarioPorIdCarteira(contraparteId)
          
          if (infoContraparte.success && infoContraparte.destinatario) {
            const dest = infoContraparte.destinatario
            
            if (dest.tipo === 'cliente' && dest.clienteId) {
              const { data } = await supabase
                .from('clientes')
                .select('email, telefone')
                .eq('id', dest.clienteId)
                .single()
              
              if (data) {
                setContraparteEmail(data.email || '')
                setContraparteTelefone(data.telefone || '')
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados da contraparte:', error)
      } finally {
        setCarregando(false)
      }
    }

    buscarDadosContraparte()
  }, [transacao])

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

  if (carregando) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const dataHoraFormatada = formatDateTime(transacao.data)
  
  const remetenteNome = transacao.tipo === 'debito' || transacao.tipo === 'transferencia' 
    ? nomeUsuario 
    : transacao.contraparte_nome || transacao.remetenteNome || 'Usuário'
  
  const remetenteConta = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? userId
    : transacao.contraparte_carteira_id?.toString() || transacao.remetenteId || ''
  
  const remetenteEmail = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? userEmail
    : contraparteEmail
  
  const remetenteTelefone = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? userTelefone
    : contraparteTelefone
  
  const destinatarioNome = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? transacao.contraparte_nome || transacao.destinatarioNome || 'Usuário'
    : nomeUsuario
  
  const destinatarioConta = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? transacao.contraparte_carteira_id?.toString() || transacao.destinatarioId || ''
    : userId
  
  const destinatarioEmail = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? contraparteEmail
    : userEmail
  
  const destinatarioTelefone = transacao.tipo === 'debito' || transacao.tipo === 'transferencia'
    ? contraparteTelefone
    : userTelefone

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Comprovante */}
        <div ref={comprovanteRef} className="bg-white dark:bg-neutral-900 p-6">
          {/* Logo e Título */}
          <div className="text-center mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <img 
              src={logoX88} 
              alt="X88"
              className="w-20 h-12 object-contain mx-auto mb-4 opacity-60"
            />
            <h3 className="text-xl font-bold text-black dark:text-white mb-1">
              Comprovante de transferência
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {dataHoraFormatada}
            </p>
          </div>

          {/* Valor */}
          <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">Valor</p>
            <p className="text-3xl font-bold text-black dark:text-white">
              {formatCurrency(transacao.valor)} <span className="text-xl opacity-60">X88</span>
            </p>
          </div>

          {/* De (Remetente) */}
          <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <h4 className="text-sm font-bold text-black dark:text-white mb-3">
              De
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Nome</p>
                <p className="text-sm text-black dark:text-white font-medium">{remetenteNome}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Conta</p>
                <p className="text-sm text-black dark:text-white font-medium">{remetenteConta}</p>
              </div>

              {remetenteEmail && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">E-mail</p>
                  <p className="text-sm text-black dark:text-white font-medium break-all">{remetenteEmail}</p>
                </div>
              )}

              {remetenteTelefone && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Telefone</p>
                  <p className="text-sm text-black dark:text-white font-medium">{remetenteTelefone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Para (Destinatário) */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-black dark:text-white mb-3">
              Para
            </h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Nome</p>
                <p className="text-sm text-black dark:text-white font-medium">{destinatarioNome}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Conta</p>
                <p className="text-sm text-black dark:text-white font-medium">{destinatarioConta}</p>
              </div>

              {destinatarioEmail && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">E-mail</p>
                  <p className="text-sm text-black dark:text-white font-medium break-all">{destinatarioEmail}</p>
                </div>
              )}

              {destinatarioTelefone && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Telefone</p>
                  <p className="text-sm text-black dark:text-white font-medium">{destinatarioTelefone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={compartilharComprovante}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar Comprovante
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComprovanteModal
