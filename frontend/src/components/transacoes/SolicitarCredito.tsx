import { useState, useEffect } from 'react'
import { XIcon, CreditCardIcon } from '../ui/Icons'

interface SolicitarCreditoProps {
  creditoDisponivel: number
  onClose: () => void
  onSubmit: (valor: number, motivo: string, parcelas: number, periodo: number, valorTotal: number, valorParcela: number) => void
}

const SolicitarCredito = ({ creditoDisponivel, onClose, onSubmit }: SolicitarCreditoProps) => {
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [parcelas, setParcelas] = useState(1)
  const [periodo, setPeriodo] = useState(30) // 7, 15 ou 30 dias

  // Cálculo de juros baseado nas parcelas
  const calcularJuros = (numParcelas: number): number => {
    const tabelaJuros: { [key: number]: number } = {
      1: 10,   // 10%
      2: 15,   // 15%
      3: 18,   // 18%
      4: 21,   // 21%
      5: 24,   // 24%
      6: 27,   // 27%
      7: 30,   // 30%
      8: 33,   // 33%
      9: 36,   // 36%
      10: 39,  // 39%
      11: 42,  // 42%
      12: 45   // 45%
    }
    return tabelaJuros[numParcelas] || 10
  }

  const jurosPercentual = calcularJuros(parcelas)
  const valorNumerico = Number(valor) || 0
  const valorJuros = valorNumerico * (jurosPercentual / 100)
  const valorTotal = valorNumerico + valorJuros
  const valorParcela = parcelas > 0 ? valorTotal / parcelas : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valor && motivo && Number(valor) > 0 && Number(valor) <= creditoDisponivel) {
      onSubmit(Number(valor), motivo, parcelas, periodo, valorTotal, valorParcela)
    }
  }

  const dentroDoLimite = Number(valor) <= creditoDisponivel

  const opcioesParcelas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const opcoesPeriodo = [
    { dias: 7, label: '7 dias (Semanal)' },
    { dias: 15, label: '15 dias (Quinzenal)' },
    { dias: 30, label: '30 dias (Mensal)' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
              <CreditCardIcon size="md" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Solicitar Empréstimo X88</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <XIcon size="md" />
          </button>
        </div>

        {/* Crédito Disponível */}
        <div className="bg-brand-50 dark:bg-brand-950 p-4 rounded-xl mb-6 border border-brand-200 dark:border-brand-800">
          <p className="text-sm text-brand-700 dark:text-brand-400 mb-1">Crédito Disponível para Empréstimo</p>
          <p className="text-3xl font-bold text-brand-600 dark:text-brand-500">
            {creditoDisponivel.toLocaleString('pt-PT')} <span className="text-xl opacity-60">X88</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div>
            <label htmlFor="valor" className="block text-sm font-semibold text-black dark:text-white mb-3">
              Quanto você precisa? (em X88)
            </label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className={`input w-full text-lg ${!dentroDoLimite && valor ? 'border-red-500' : ''}`}
              placeholder="0"
              min="1"
              max={creditoDisponivel}
              required
            />
            {!dentroDoLimite && valor && (
              <p className="text-red-600 text-sm mt-2">⚠️ Valor acima do crédito disponível</p>
            )}
          </div>

          {/* Número de Parcelas */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Em quantas vezes deseja pagar?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {opcioesParcelas.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setParcelas(num)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    parcelas === num
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-300'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Quanto mais parcelas, maior o juros
            </p>
          </div>

          {/* Período de Pagamento */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              A cada quanto tempo vai pagar?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {opcoesPeriodo.map((op) => (
                <button
                  key={op.dias}
                  type="button"
                  onClick={() => setPeriodo(op.dias)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    periodo === op.dias
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-300'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-1">{op.dias}</p>
                    <p className="text-xs">{op.label.split(' ')[1]}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resumo do Empréstimo */}
          {valorNumerico > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-300 dark:border-yellow-700 p-5 rounded-2xl">
              <h4 className="font-bold text-lg text-black dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Resumo do Empréstimo
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Valor solicitado:</span>
                  <span className="font-bold text-black dark:text-white text-lg">
                    {valorNumerico.toLocaleString('pt-PT')} <span className="text-sm opacity-60">X88</span>
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Juros ({jurosPercentual}%):</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">
                    +{valorJuros.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm opacity-60">X88</span>
                  </span>
                </div>

                <div className="border-t-2 border-yellow-300 dark:border-yellow-700 pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-700 dark:text-neutral-300 font-semibold">Total a pagar:</span>
                    <span className="font-bold text-red-600 dark:text-red-400 text-2xl">
                      {valorTotal.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-lg opacity-60">X88</span>
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Você pagará:</p>
                      <p className="font-bold text-brand-600 dark:text-brand-500 text-xl">
                        {parcelas}x de {valorParcela.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm opacity-60">X88</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">A cada:</p>
                      <p className="font-bold text-black dark:text-white">{periodo} dias</p>
                    </div>
                  </div>
                </div>

                {/* Calendário de Parcelas */}
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl">
                  <p className="font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Datas de Pagamento:
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {Array.from({ length: parcelas }).map((_, index) => {
                      const diasTotal = periodo * (index + 1)
                      const dataPagamento = new Date()
                      dataPagamento.setDate(dataPagamento.getDate() + diasTotal)
                      
                      return (
                        <div key={index} className="flex justify-between text-sm p-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {index + 1}ª parcela:
                          </span>
                          <span className="font-semibold text-black dark:text-white">
                            {dataPagamento.toLocaleDateString('pt-PT')} - {valorParcela.toFixed(2)} <span className="text-xs opacity-60">X88</span>
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Motivo */}
          <div>
            <label htmlFor="motivo" className="block text-sm font-semibold text-black dark:text-white mb-3">
              Motivo do Empréstimo
            </label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="input w-full min-h-[100px] resize-none"
              placeholder="Explique o motivo do empréstimo..."
              required
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>⚠️ Importante:</strong> A análise pode levar até 24 horas. 
              Você receberá notificação da decisão. O pagamento das parcelas será cobrado automaticamente.
            </p>
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
              disabled={!dentroDoLimite || !valor || !motivo}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCardIcon size="md" />
              <span>Enviar Solicitação</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SolicitarCredito
