import { useState } from 'react'
import { CreditCardIcon, WalletIcon } from '../ui/Icons'

interface CreditoPageProps {
  creditoDisponivel: number
  saldoX88: number
  onSubmit: (valor: number, motivo: string, parcelas: number, periodo: number, valorTotal: number, valorParcela: number) => void
}

const CreditoPage = ({ creditoDisponivel, saldoX88, onSubmit }: CreditoPageProps) => {
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [parcelas, setParcelas] = useState(1)
  const [periodo, setPeriodo] = useState(30)

  const calcularJuros = (numParcelas: number): number => {
    const tabelaJuros: { [key: number]: number } = {
      1: 10, 2: 15, 3: 18, 4: 21, 5: 24, 6: 27,
      7: 30, 8: 33, 9: 36, 10: 39, 11: 42, 12: 45
    }
    return tabelaJuros[numParcelas] || 10
  }

  const jurosPercentual = calcularJuros(parcelas)
  const valorNumerico = Number(valor) || 0
  const valorJuros = valorNumerico * (jurosPercentual / 100)
  const valorTotal = valorNumerico + valorJuros
  const valorParcela = parcelas > 0 ? valorTotal / parcelas : 0
  const dentroDoLimite = Number(valor) <= creditoDisponivel

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valor && dentroDoLimite && motivo) {
      onSubmit(Number(valor), motivo, parcelas, periodo, valorTotal, valorParcela)
    }
  }

  const opcioesParcelas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const opcoesPeriodo = [
    { dias: 7, label: '7 dias (Semanal)' },
    { dias: 15, label: '15 dias (Quinzenal)' },
    { dias: 30, label: '30 dias (Mensal)' }
  ]

  return (
    <div className="p-4 pb-24 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
              <CreditCardIcon size="md" className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Solicitar Empréstimo</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Crédito X88</p>
            </div>
          </div>
        </div>

        {/* Card Verde - Saldo Disponível */}
        <div className="mb-3">
          <div className="rounded-2xl p-6 shadow-md" style={{ backgroundColor: '#15FF5D', borderColor: '#15FF5D' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-dark black text-4x1 font-medium">Saldo Disponível</p>
              <WalletIcon size="sm" className="text-dark black" />
            </div>
            
            <div className="mb-3">
              <p className="text-dark black text-5xl font-bold leading-none mb-2">
                {saldoX88.toLocaleString('pt-PT')} x88
              </p>
              <p className="text-dark black/90 text-lg">
               
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Quanto você precisa?
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className={`input w-full text-lg ${!dentroDoLimite && valor ? 'border-red-500' : ''}`}
              placeholder="0"
              min="1"
              max={saldoX88}
              required
            />
            {!dentroDoLimite && valor && (
              <p className="text-red-600 text-sm mt-2">⚠️ Valor acima do saldo disponível</p>
            )}
          </div>

          {/* Parcelas */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Em quantas vezes?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {opcioesParcelas.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setParcelas(num)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    parcelas === num
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 font-bold'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              A cada quanto tempo?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {opcoesPeriodo.map((op) => (
                <button
                  key={op.dias}
                  type="button"
                  onClick={() => setPeriodo(op.dias)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    periodo === op.dias
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <p className="text-2xl font-bold mb-1">{op.dias}</p>
                  <p className="text-xs">{op.label.split(' ')[1]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Resumo */}
          {valorNumerico > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-300 dark:border-yellow-700 p-5 rounded-2xl">
              <h4 className="font-bold text-lg text-black dark:text-white mb-4">💰 Resumo</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Solicitado:</span>
                  <span className="font-bold text-black dark:text-white">{valorNumerico} X88</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Juros ({jurosPercentual}%):</span>
                  <span className="font-bold text-orange-600">+{valorJuros.toFixed(2)} X88</span>
                </div>
                <div className="border-t-2 border-yellow-300 pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total a pagar:</span>
                    <span className="font-bold text-red-600 text-xl">{valorTotal.toFixed(2)} X88</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">Você pagará:</p>
                      <p className="font-bold text-brand-600 text-lg">
                        {parcelas}x de {valorParcela.toFixed(2)} X88
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">A cada:</p>
                      <p className="font-bold">{periodo} dias</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Motivo */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Motivo do Empréstimo
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="input w-full min-h-[100px] resize-none"
              placeholder="Explique o motivo..."
              required
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={!dentroDoLimite || !valor || !motivo}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCardIcon size="md" />
            <span>Enviar Solicitação</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreditoPage
