import React, { useRef } from 'react'
import html2canvas from 'html2canvas'
import { useTimezone } from '../../hooks/useTimezone'

interface ComprovanteTransferenciaModalProps {
  isOpen: boolean
  onClose: () => void
  dadosTransferencia: {
    valor: number
    destinatarioNome: string
    destinatarioConta: string
    destinatarioEmail?: string
    destinatarioTelefone?: string
    remetenteConta: string
    remetenteNome: string
    remetenteEmail?: string
    remetenteTelefone?: string
  } | null
}

const ComprovanteTransferenciaModal: React.FC<ComprovanteTransferenciaModalProps> = ({
  isOpen,
  onClose,
  dadosTransferencia
}) => {
  const comprovanteRef = useRef<HTMLDivElement>(null)
  const { formatDateTime, formatCurrency } = useTimezone()

  if (!isOpen || !dadosTransferencia) return null

  const dataHoraFormatada = formatDateTime(new Date().toISOString())

  const handleCompartilhar = async () => {
    if (!comprovanteRef.current) return

    try {
      const canvas = await html2canvas(comprovanteRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      })

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], 'comprovante-x88.png', { type: 'image/png' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Comprovante X88',
            text: 'Comprovante de Transferência X88'
          })
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = 'comprovante-x88.png'
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
        }
      })
    } catch (err) {
      console.error('Erro ao compartilhar:', err)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
              src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
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
              {formatCurrency(dadosTransferencia.valor)} <span className="text-xl opacity-60">X88</span>
            </p>
          </div>

          {/* De (Pagador) */}
          <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <h4 className="text-sm font-bold text-black dark:text-white mb-3">De</h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Nome</p>
                <p className="text-sm text-black dark:text-white font-medium">{dadosTransferencia.remetenteNome}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Conta</p>
                <p className="text-sm text-black dark:text-white font-medium">{dadosTransferencia.remetenteConta}</p>
              </div>

              {dadosTransferencia.remetenteEmail && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">E-mail</p>
                  <p className="text-sm text-black dark:text-white font-medium break-all">{dadosTransferencia.remetenteEmail}</p>
                </div>
              )}

              {dadosTransferencia.remetenteTelefone && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Telefone</p>
                  <p className="text-sm text-black dark:text-white font-medium">{dadosTransferencia.remetenteTelefone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Para (Destinatário) */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-black dark:text-white mb-3">Para</h4>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Nome</p>
                <p className="text-sm text-black dark:text-white font-medium">{dadosTransferencia.destinatarioNome}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Conta</p>
                <p className="text-sm text-black dark:text-white font-medium">{dadosTransferencia.destinatarioConta}</p>
              </div>

              {dadosTransferencia.destinatarioEmail && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">E-mail</p>
                  <p className="text-sm text-black dark:text-white font-medium break-all">{dadosTransferencia.destinatarioEmail}</p>
                </div>
              )}

              {dadosTransferencia.destinatarioTelefone && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Telefone</p>
                  <p className="text-sm text-black dark:text-white font-medium">{dadosTransferencia.destinatarioTelefone}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleCompartilhar}
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

export default ComprovanteTransferenciaModal
