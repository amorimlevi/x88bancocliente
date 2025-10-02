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
  const [mostrarModalParcelas, setMostrarModalParcelas] = useState(false)
  const [mostrarModalMotivo, setMostrarModalMotivo] = useState(false)

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
  const opcoesMotivo = [
    'Emergência médica',
    'Pagamento de contas',
    'Investimento',
    'Educação',
    'Reforma/Construção',
    'Compra de equipamento',
    'Capital de giro',
    'Viagem',
    'Outros'
  ]

  return (
    <div className="p-4 pb-24 overflow-y-auto">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12" style={{ color: '#15FF5D' }}>
              <path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Empréstimo</h1>
        </div>

        {/* Card Verde - Saldo Disponível */}
        <div className="mb-3">
          <div className="rounded-2xl p-6 shadow-md relative" style={{ backgroundColor: '#15FF5D', borderColor: '#15FF5D' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-dark black text-4x1 font-medium">Saldo Disponível</p>
              <WalletIcon size="sm" className="text-dark black" />
            </div>
            
            <div className="mb-3">
              <p className="text-dark black text-5xl font-bold leading-none mb-2">
                {saldoX88.toLocaleString('pt-PT')} 
              </p>
              <p className="text-dark black/90 text-lg">
               
              </p>
            </div>

            <div className="absolute bottom-4 right-4">
              <img 
                src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
                alt="X88"
                className="w-14 h-9 object-contain"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Valor solicitado
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className={`input w-full text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${!dentroDoLimite && valor ? 'border-red-500' : ''}`}
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
              Parcelas
            </label>
            <button
              type="button"
              onClick={() => setMostrarModalParcelas(true)}
              className="input w-full text-lg text-left"
            >
              {parcelas}x
            </button>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Vencimento
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
            <button
              type="button"
              onClick={() => setMostrarModalMotivo(true)}
              className="input w-full text-lg text-left"
            >
              <span className={motivo ? 'text-black dark:text-white' : 'text-neutral-400'}>
                {motivo || 'Selecione o motivo'}
              </span>
            </button>
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

        {/* Modal Flutuante de Parcelas */}
        {mostrarModalParcelas && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setMostrarModalParcelas(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                Em quantas vezes?
              </h3>
              <div className="grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
                {opcioesParcelas.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setParcelas(num)
                      setMostrarModalParcelas(false)
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-lg font-semibold ${
                      parcelas === num
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-300'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalParcelas(false)}
                className="w-full mt-4 p-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal Flutuante de Motivo */}
        {mostrarModalMotivo && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setMostrarModalMotivo(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                Motivo do Empréstimo
              </h3>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {opcoesMotivo.map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => {
                      setMotivo(opcao)
                      setMostrarModalMotivo(false)
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      motivo === opcao
                        ? 'border-brand-500 bg-brand-500 text-white font-semibold'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-300'
                    }`}
                  >
                    {opcao}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalMotivo(false)}
                className="w-full mt-4 p-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreditoPage
