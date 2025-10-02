import { useState } from 'react'
import { XIcon, ArrowDownIcon, EuroIcon } from '../ui/Icons'

interface SaqueMBwayProps {
  saldoDisponivel: number
  taxaConversao: number
  onClose: () => void
  onSubmit: (valorX88: number, telefone: string) => void
}

const SaqueMBway = ({ saldoDisponivel, taxaConversao, onClose, onSubmit }: SaqueMBwayProps) => {
  const [valorX88, setValorX88] = useState('')
  const [telefone, setTelefone] = useState('+351 ')

  const valorEmEuros = Number(valorX88) * taxaConversao

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valorX88 && telefone && Number(valorX88) > 0 && Number(valorX88) <= saldoDisponivel) {
      onSubmit(Number(valorX88), telefone)
    }
  }

  const temSaldoSuficiente = Number(valorX88) <= saldoDisponivel

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 dark:bg-brand-500 rounded-lg flex items-center justify-center">
              <ArrowDownIcon size="md" className="text-white" />
            </div>
            <h3 className="heading-3">Saque via MBway</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <XIcon size="md" />
          </button>
        </div>

        {/* Saldo Disponível */}
        <div className="bg-brand-50 dark:bg-brand-950 p-4 rounded-xl mb-6">
          <p className="text-sm text-brand-700 dark:text-brand-400 mb-1">Saldo Disponível</p>
          <p className="text-2xl font-bold text-brand-600 dark:text-brand-500">
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
            <label htmlFor="valorX88" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
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
            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted mb-1">Você receberá</p>
                  <p className="text-2xl font-bold text-brand-600 dark:text-brand-500 flex items-center gap-2">
                    <EuroIcon size="md" />
                    €{valorEmEuros.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Taxa de conversão</p>
                  <p className="text-sm font-medium">1 X88 = {taxaConversao} €</p>
                </div>
              </div>
            </div>
          )}

          {/* Telefone MBway */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
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
            <p className="text-xs text-muted mt-2">📱 O dinheiro será enviado para este número via MBway</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!temSaldoSuficiente || !valorX88}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownIcon size="md" />
              <span>Confirmar Saque</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaqueMBway
