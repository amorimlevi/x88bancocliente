import { useState } from 'react'
import { ArrowDownIcon, WalletIcon } from '../ui/Icons'

interface SacarPageProps {
  saldoDisponivel: number
  creditoDisponivel: number
  taxaConversao: number
  onSubmit: (valorX88: number, telefone?: string) => void
  userId?: string
  dadosBancariosCompletos: boolean
  onNavigate?: (pagina: string) => void
}

const SacarPage = ({ saldoDisponivel, creditoDisponivel, taxaConversao, onSubmit, userId = '0001', dadosBancariosCompletos, onNavigate }: SacarPageProps) => {
  const [valorX88, setValorX88] = useState('')
  const [telefone, setTelefone] = useState('+351 ')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Chama onSubmit apenas com o valor (sem telefone) para solicitar X88
    if (valorX88 && Number(valorX88) > 0) {
      onSubmit(Number(valorX88))
    }
  }

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" 
            alt="X88"
            className="w-13 h-12 object-contain"
          />
          <h1 className="text-2xl font-bold text-black dark:text-white">X88</h1>
        </div>

        {/* Crédito Disponível */}
        <div className="rounded-2xl p-6 shadow-md mb-3 relative" style={{ backgroundColor: '#FFF700', borderColor: '#FFF700' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-dark black text-4x1 font-medium">Crédito Disponível</p>
            <WalletIcon size="sm" className="text-black" />
          </div>
          
          <div className="mb-3">
            <p className="text-black text-5xl font-bold leading-none mb-2">
              {creditoDisponivel.toLocaleString('pt-PT')} 
            </p>
            <p className="text-black/90 text-lg">
              
            </p>
          </div>

          <div className="absolute bottom-3 right-4">
            <img 
              src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
              alt="X88"
              className="w-14 h-9 object-contain"
            />
          </div>
        </div>

        {/* ID do Cliente */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl mb-6 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Seu ID</p>
          <p className="text-lg font-bold text-black dark:text-white font-mono tracking-wider">
            {userId}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor X88 */}
          <div>
            <label htmlFor="valorX88" className="block text-sm font-semibold text-black dark:text-white mb-3">
              Quanto deseja solicitar? (X88)
            </label>
            <input
              type="number"
              id="valorX88"
              value={valorX88}
              onChange={(e) => setValorX88(e.target.value)}
              className="input w-full text-lg"
              placeholder="0"
              min="1"
              required
            />
          </div>

          {!dadosBancariosCompletos && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Cadastre seus dados bancários para solicitar saques
              </p>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('perfil')}
                  className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 underline hover:no-underline"
                >
                  Ir para Perfil →
                </button>
              )}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={!valorX88 || !dadosBancariosCompletos}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownIcon size="md" />
            <span>Solicitar</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default SacarPage
