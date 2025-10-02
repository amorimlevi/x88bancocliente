import { useState } from 'react'
import { ArrowDownIcon, EuroIcon, WalletIcon } from '../ui/Icons'

interface SacarPageProps {
  saldoDisponivel: number
  taxaConversao: number
  onSubmit: (valorX88: number, telefone: string) => void
}

const SacarPage = ({ saldoDisponivel, taxaConversao, onSubmit }: SacarPageProps) => {
  const [valorX88, setValorX88] = useState('')
  const [telefone, setTelefone] = useState('+351 ')

  const valorEmEuros = Number(valorX88) * taxaConversao
  const temSaldoSuficiente = Number(valorX88) <= saldoDisponivel

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valorX88 && telefone && Number(valorX88) > 0 && temSaldoSuficiente) {
      onSubmit(Number(valorX88), telefone)
    }
  }

  return (
    <div className="p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
              <ArrowDownIcon size="md" className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Saque via MBway</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Converta X88 para €</p>
            </div>
          </div>
        </div>

        {/* Saldo Disponível */}
        <div className="bg-brand-50 dark:bg-brand-950 p-4 rounded-xl mb-6 border border-brand-200 dark:border-brand-800">
          <div className="flex items-center gap-2 mb-2">
            <WalletIcon size="sm" className="text-brand-600 dark:text-brand-500" />
            <p className="text-sm text-brand-700 dark:text-brand-400 font-medium">Saldo Disponível</p>
          </div>
          <p className="text-3xl font-bold text-brand-600 dark:text-brand-500">
            {saldoDisponivel.toLocaleString('pt-PT')} X88
          </p>
          <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
            ≈ €{(saldoDisponivel * taxaConversao).toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor X88 */}
          <div>
            <label htmlFor="valorX88" className="block text-sm font-semibold text-black dark:text-white mb-3">
              Quanto deseja sacar? (em X88)
            </label>
            <input
              type="number"
              id="valorX88"
              value={valorX88}
              onChange={(e) => setValorX88(e.target.value)}
              className={`input w-full text-lg ${!temSaldoSuficiente && valorX88 ? 'border-red-500' : ''}`}
              placeholder="0"
              min="1"
              max={saldoDisponivel}
              required
            />
            {!temSaldoSuficiente && valorX88 && (
              <p className="text-red-600 text-sm mt-2">⚠️ Saldo insuficiente</p>
            )}
          </div>

          {/* Conversão */}
          {valorX88 && (
            <div className="bg-white dark:bg-neutral-900 border-2 border-brand-200 dark:border-brand-800 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Você receberá</p>
                  <p className="text-3xl font-bold text-brand-600 dark:text-brand-500 flex items-center gap-2">
                    <EuroIcon size="md" />
                    €{valorEmEuros.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Taxa de conversão</p>
                  <p className="text-sm font-semibold text-black dark:text-white">1 X88 = 1 €</p>
                </div>
              </div>
            </div>
          )}

          {/* Telefone MBway */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-semibold text-black dark:text-white mb-3">
              Número de Telefone MBway
            </label>
            <input
              type="tel"
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="input w-full text-lg"
              placeholder="+351 912 345 678"
              required
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              📱 O dinheiro será enviado para este número via MBway
            </p>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={!temSaldoSuficiente || !valorX88}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownIcon size="md" />
            <span>Confirmar Saque</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default SacarPage
