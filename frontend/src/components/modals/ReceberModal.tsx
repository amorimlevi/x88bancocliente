import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../../lib/supabase'

interface ReceberModalProps {
  isOpen: boolean
  onClose: () => void
  contaId: string
  nomeUsuario?: string
  userId: string
}

const ReceberModal: React.FC<ReceberModalProps> = ({ isOpen, onClose, contaId, nomeUsuario, userId }) => {
  const [valor, setValor] = useState('')
  const [qrCodeGerado, setQrCodeGerado] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [carteiraId, setCarteiraId] = useState<string>('')

  // Buscar o ID da carteira quando o modal abre
  useEffect(() => {
    const buscarCarteiraId = async () => {
      if (isOpen && userId) {
        try {
          const { data, error } = await supabase
            .from('carteira_x88')
            .select('id')
            .eq('cliente_id', userId)
            .single()

          if (data && !error) {
            setCarteiraId(String(data.id))
          }
        } catch (err) {
          console.error('Erro ao buscar ID da carteira:', err)
        }
      }
    }

    buscarCarteiraId()
  }, [isOpen, userId])

  if (!isOpen) return null

  const handleGerarQRCode = () => {
    if (parseFloat(valor) > 0) {
      setQrCodeGerado(true)
    }
  }

  const handleVoltar = () => {
    setQrCodeGerado(false)
    setValor('')
  }

  const handleFechar = () => {
    setQrCodeGerado(false)
    setValor('')
    onClose()
  }

  const dadosPagamento = JSON.stringify({
    contaId: carteiraId, // ID da carteira para a transferência
    contaNumero: contaId, // Número da conta para exibição
    valor: parseFloat(valor),
    nomeUsuario
  })

  const handleCopiarId = () => {
    navigator.clipboard.writeText(contaId)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const handleCompartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pagamento X88',
          text: `Pague ${valor} X88 para ${nomeUsuario || 'mim'}. Conta: ${contaId}`,
        })
      } catch (err) {
        console.log('Erro ao compartilhar:', err)
      }
    } else {
      handleCopiarId()
    }
  }

  const handleBaixarQR = () => {
    const svg = document.querySelector('.qr-code-container svg')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      canvas.width = 250
      canvas.height = 250
      
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          const url = canvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.download = `x88-qrcode-${valor}x88.png`
          link.href = url
          link.click()
        }
      }
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleFechar}
    >
      <div 
        className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {!qrCodeGerado ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                Receber Pagamento
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Digite o valor que deseja receber
              </p>
            </div>

            {/* Input de Valor */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                Valor em X88
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-2xl font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 font-semibold">
                  X88
                </span>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <button
                onClick={handleGerarQRCode}
                disabled={!valor || parseFloat(valor) <= 0}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                Gerar QR Code
              </button>

              <button
                onClick={handleFechar}
                className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-700 dark:text-green-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-12h8v8h-8V3zm2 2v4h4V5h-4zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                QR Code Gerado
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Mostre este QR Code para receber
              </p>
            </div>

            {/* Valor */}
            <div className="text-center mb-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Valor</p>
              <p className="text-4xl font-bold text-green-600">{parseFloat(valor).toLocaleString('pt-PT')} X88</p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl mb-6 flex items-center justify-center qr-code-container">
              <QRCodeSVG 
                value={dadosPagamento}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* ID da Conta */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                Sua Conta
              </label>
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4">
                <span className="flex-1 font-mono text-lg font-bold text-black dark:text-white">
                  {contaId}
                </span>
                <button
                  onClick={handleCopiarId}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  {copiado ? (
                    <span className="text-green-600 text-sm font-semibold">✓</span>
                  ) : (
                    <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button
                onClick={handleCompartilhar}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartilhar
              </button>

              <button
                onClick={handleBaixarQR}
                className="w-full py-3 px-4 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-black dark:text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Salvar QR Code
              </button>

              <button
                onClick={handleVoltar}
                className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
              >
                Voltar
              </button>

              <button
                onClick={handleFechar}
                className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
              >
                Fechar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ReceberModal
