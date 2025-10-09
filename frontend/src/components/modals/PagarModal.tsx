import React, { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface PagarModalProps {
  isOpen: boolean
  onClose: () => void
  onScanQR: () => void
  onDigitarId: () => void
}

interface DadosPagamento {
  contaId: string
  valor: number
  nomeUsuario?: string
}

const PagarModal: React.FC<PagarModalProps> = ({ isOpen, onClose }) => {
  const [escaneando, setEscaneando] = useState(false)
  const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (isOpen && escaneando) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          videoConstraints: {
            facingMode: "environment"
          },
          rememberLastUsedCamera: true
        },
        /* verbose= */ false
      )

      html5QrcodeScanner.render(
        (decodedText) => {
          try {
            const dados: DadosPagamento = JSON.parse(decodedText)
            setDadosPagamento(dados)
            setConfirmando(true)
            setEscaneando(false)
            html5QrcodeScanner.clear()
          } catch (err) {
            console.error('Erro ao decodificar QR Code:', err)
            alert('QR Code inválido. Por favor, tente novamente.')
          }
        },
        (error) => {
          // Silenciar erros de scan contínuo
          if (!error.includes('NotFoundException')) {
            console.warn('Erro no scanner:', error)
          }
        }
      )

      setScanner(html5QrcodeScanner)

      return () => {
        html5QrcodeScanner.clear().catch(console.error).finally(() => {
          // Limpar completamente o elemento do DOM
          const qrReaderElement = document.getElementById('qr-reader')
          if (qrReaderElement) {
            qrReaderElement.innerHTML = ''
          }
        })
      }
    }
  }, [isOpen, escaneando])

  const handleIniciarScanner = () => {
    setEscaneando(true)
  }

  const handleVoltar = async () => {
    if (scanner) {
      try {
        await scanner.clear()
        setScanner(null)
      } catch (err) {
        console.error('Erro ao limpar scanner:', err)
      }
    }
    
    // Limpar completamente o elemento do DOM
    const qrReaderElement = document.getElementById('qr-reader')
    if (qrReaderElement) {
      qrReaderElement.innerHTML = ''
    }
    
    setEscaneando(false)
    setConfirmando(false)
    setDadosPagamento(null)
  }

  const handleFechar = async () => {
    if (scanner) {
      try {
        await scanner.clear()
        setScanner(null)
      } catch (err) {
        console.error('Erro ao limpar scanner:', err)
      }
    }
    
    // Limpar completamente o elemento do DOM
    const qrReaderElement = document.getElementById('qr-reader')
    if (qrReaderElement) {
      qrReaderElement.innerHTML = ''
    }
    
    setEscaneando(false)
    setConfirmando(false)
    setDadosPagamento(null)
    onClose()
  }

  const handleConfirmarPagamento = async () => {
    if (!dadosPagamento) return

    try {
      // TODO: Implementar lógica de transferência via API
      console.log('Pagamento confirmado:', dadosPagamento)
      alert(`Pagamento de ${dadosPagamento.valor} X88 para ${dadosPagamento.nomeUsuario || dadosPagamento.contaId} realizado com sucesso!`)
      handleFechar()
    } catch (err) {
      console.error('Erro ao realizar pagamento:', err)
      alert('Erro ao realizar pagamento. Tente novamente.')
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleFechar}
    >
      <div 
        className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {!escaneando && !confirmando ? (
          <>
            {/* Menu Inicial */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-12h8v8h-8V3zm2 2v4h4V5h-4zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                Pagar com QR Code
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Escaneie o QR Code para pagar
              </p>
            </div>

            {/* Botão Escanear */}
            <div className="space-y-3">
              <button
                onClick={handleIniciarScanner}
                className="w-full py-4 px-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-12h8v8h-8V3zm2 2v4h4V5h-4zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2z"/>
                </svg>
                Escanear QR Code
              </button>

              <button
                onClick={handleFechar}
                className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : escaneando ? (
          <>
            {/* Scanner QR Code */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                Escaneie o QR Code
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Posicione o QR Code dentro do quadro
              </p>
            </div>

            <div id="qr-reader" className="mb-4 rounded-xl overflow-hidden qr-reader-custom"></div>

            <button
              onClick={handleVoltar}
              className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
            >
              Voltar
            </button>

            <style>{`
              #qr-reader__dashboard_section_csr {
                display: none !important;
              }
              
              #qr-reader__camera_selection {
                display: none !important;
              }

              #qr-reader__dashboard_section_swaplink {
                display: none !important;
              }

              #qr-reader__dashboard_section_fsr {
                display: none !important;
              }

              #qr-reader__filescan_input {
                display: none !important;
              }

              #qr-reader__camera_permission_button {
                background: #eab308 !important;
                color: black !important;
                padding: 12px 24px !important;
                border-radius: 12px !important;
                font-weight: 600 !important;
                border: none !important;
              }

              .qr-reader-custom video {
                border-radius: 12px !important;
              }

              #qr-reader__scan_region {
                border-radius: 12px !important;
              }
            `}</style>
          </>
        ) : confirmando && dadosPagamento ? (
          <>
            {/* Confirmação de Pagamento */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-1">
                Confirmar Pagamento
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Revise os dados antes de confirmar
              </p>
            </div>

            {/* Detalhes do Pagamento */}
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4 mb-6 space-y-4">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Para</p>
                <p className="text-lg font-bold text-black dark:text-white">
                  {dadosPagamento.nomeUsuario || 'Destinatário'}
                </p>
                <p className="text-sm font-mono text-neutral-600 dark:text-neutral-400">
                  Conta: {dadosPagamento.contaId}
                </p>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Valor</p>
                <p className="text-3xl font-bold text-green-600">
                  {dadosPagamento.valor.toLocaleString('pt-PT')} X88
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <button
                onClick={handleConfirmarPagamento}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                Confirmar Pagamento
              </button>

              <button
                onClick={handleVoltar}
                className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default PagarModal
