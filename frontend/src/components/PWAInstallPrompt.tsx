import { useState, useEffect } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { Download, X, Share } from 'lucide-react'

export const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, isIOS, installPWA } = usePWAInstall()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-install-dismissed')
    if (isDismissed) {
      setDismissed(true)
      return
    }

    const timer = setTimeout(() => {
      if ((isInstallable || isIOS) && !isInstalled) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled, isIOS])

  const handleInstall = async () => {
    const success = await installPWA()
    if (success) {
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt || dismissed || isInstalled) {
    return null
  }

  if (isIOS) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 text-white p-4 z-50 border-t border-[#15FF5D]/20">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-2"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#15FF5D] rounded-xl flex items-center justify-center">
              <Download className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Instalar X88 Bank</h3>
              <p className="text-sm text-gray-400">Acesso rápido na tela inicial</p>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 space-y-2">
            <p className="text-sm">Para instalar no iOS:</p>
            <ol className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#15FF5D] text-black rounded-full text-xs font-bold">1</span>
                <span>Toque no ícone <Share className="w-4 h-4 inline" /> (Compartilhar)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#15FF5D] text-black rounded-full text-xs font-bold">2</span>
                <span>Selecione "Adicionar à Tela de Início"</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-[#15FF5D] text-black rounded-full text-xs font-bold">3</span>
                <span>Confirme tocando em "Adicionar"</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 text-white p-4 z-50 border-t border-[#15FF5D]/20">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-2"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="w-16 h-16 bg-[#15FF5D] rounded-xl flex items-center justify-center flex-shrink-0">
          <Download className="w-8 h-8 text-black" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Instalar X88 Bank</h3>
          <p className="text-sm text-gray-400">
            Instale o app para acesso rápido e funcionalidade offline
          </p>
        </div>
        
        <button
          onClick={handleInstall}
          className="bg-[#15FF5D] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#12DD4F] transition-colors flex-shrink-0"
        >
          Instalar
        </button>
      </div>
    </div>
  )
}
