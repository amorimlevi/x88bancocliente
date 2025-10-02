import { useState } from 'react'
import { CreditCardIcon, WalletIcon } from '../ui/Icons'

interface Transacao {
  id: string
  tipo: 'saque' | 'credito' | 'transferencia' | 'x88'
  valor: number
  motivo?: string
  data: string
  status: 'pendente' | 'aprovado' | 'negado'
  parcelas?: number
  periodo?: number
  valorTotal?: number
  valorParcela?: number
  juros?: number
  parcelasPagas?: number
}

interface CreditoPageProps {
  creditoDisponivel: number
  saldoX88: number
  onSubmit: (valor: number, motivo: string, parcelas: number, periodo: number, valorTotal: number, valorParcela: number) => void
  transacoes?: Transacao[]
  onPagarParcela?: (emprestimoId: string) => void
}

const CreditoPage = ({ creditoDisponivel, saldoX88, onSubmit, transacoes = [], onPagarParcela }: CreditoPageProps) => {
  const [abaAtiva, setAbaAtiva] = useState<'solicitar' | 'meus'>('solicitar')
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')
  const [parcelas, setParcelas] = useState(1)
  const [periodo, setPeriodo] = useState(30)
  const [mostrarModalParcelas, setMostrarModalParcelas] = useState(false)
  const [mostrarModalMotivo, setMostrarModalMotivo] = useState(false)
  const [mostrarModalPeriodo, setMostrarModalPeriodo] = useState(false)
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false)
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState<Transacao | null>(null)
  const [dadosBancarios, setDadosBancarios] = useState<any>(null)

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
  const dentroDoLimite = Number(valor) <= saldoX88

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

  const meusEmprestimos = transacoes.filter(t => t.tipo === 'credito' && t.status === 'aprovado')

  const handleAbrirModalPagamento = async (emprestimo: Transacao) => {
    setEmprestimoSelecionado(emprestimo)
    
    // Buscar dados bancários do gestor
    try {
      const response = await fetch('http://localhost:3002/api/dados-bancarios-gestor')
      const data = await response.json()
      if (data.success) {
        setDadosBancarios(data.dadosBancarios)
      }
    } catch (error) {
      console.error('Erro ao buscar dados bancários:', error)
    }
    
    setMostrarModalPagamento(true)
  }

  const handleConfirmarPagamento = async () => {
    if (!emprestimoSelecionado) return
    
    try {
      const response = await fetch('http://localhost:3002/api/solicitar-pagamento-parcela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emprestimoId: emprestimoSelecionado.id,
          valorParcela: emprestimoSelecionado.valorParcela,
          userId: '1', // Em produção, pegar do contexto do usuário
          userName: 'Colaborador Teste'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Pagamento solicitado! Aguarde a aprovação do gestor.')
        setMostrarModalPagamento(false)
        setEmprestimoSelecionado(null)
      }
    } catch (error) {
      console.error('Erro ao solicitar pagamento:', error)
      alert('Erro ao solicitar pagamento. Tente novamente.')
    }
  }

  return (
    <div className="p-4 pt-12 pb-24 scroll-container-ios">
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

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setAbaAtiva('solicitar')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              abaAtiva === 'solicitar'
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Solicitar
          </button>
          <button
            onClick={() => setAbaAtiva('meus')}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              abaAtiva === 'meus'
                ? 'bg-brand-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Meus Empréstimos
          </button>
        </div>

        {abaAtiva === 'solicitar' ? (
          <>
            {/* Card Verde - Saldo Disponível */}
            <div className="mb-3">
              <div className="rounded-2xl p-6 shadow-md relative" style={{ backgroundColor: '#15FF5D', borderColor: '#15FF5D' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-dark black text-4x1 font-medium">Saldo Disponível</p>
                  <WalletIcon size="sm" className="text-dark black" />
                </div>
                
                <div className="mb-3">
                  <p className="text-dark black text-5xl font-bold leading-none mb-2">
                    {saldoX88.toLocaleString('pt-PT')} X88
                  </p>
                  <p className="text-dark black/90 text-lg">
                    {saldoX88.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
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
              disabled={!valor || !dentroDoLimite}
              className="input w-full text-lg text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {parcelas}x
            </button>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-semibold text-black dark:text-white mb-3">
              Vencimento
            </label>
            <button
              type="button"
              onClick={() => setMostrarModalPeriodo(true)}
              disabled={!valor || !dentroDoLimite || !parcelas}
              className="input w-full text-lg text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {opcoesPeriodo.find(op => op.dias === periodo)?.label}
            </button>
          </div>

          {/* Resumo */}
          {valorNumerico > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-300 dark:border-yellow-700 p-5 rounded-2xl">
              <h4 className="font-bold text-lg text-black dark:text-white mb-4">💰 Resumo</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Solicitado:</span>
                  <span className="font-bold text-black dark:text-white">{valorNumerico} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">Juros ({jurosPercentual}%):</span>
                  <span className="font-bold text-orange-600">+{valorJuros.toFixed(2)} €</span>
                </div>
                <div className="border-t-2 border-yellow-300 pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total a pagar:</span>
                    <span className="font-bold text-red-600 text-xl">{valorTotal.toFixed(2)} €</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">Você pagará:</p>
                      <p className="font-bold text-brand-600 text-lg">
                        {parcelas}x de {valorParcela.toFixed(2)} €
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
              disabled={!valor || !dentroDoLimite || !parcelas || !periodo}
              className="input w-full text-lg text-left disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Modal Flutuante de Período */}
        {mostrarModalPeriodo && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setMostrarModalPeriodo(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                Vencimento das Parcelas
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {opcoesPeriodo.map((op) => (
                  <button
                    key={op.dias}
                    type="button"
                    onClick={() => {
                      setPeriodo(op.dias)
                      setMostrarModalPeriodo(false)
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      periodo === op.dias
                        ? 'border-brand-500 bg-brand-500 text-white font-semibold'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-brand-300'
                    }`}
                  >
                    <p className="text-2xl font-bold mb-1">{op.dias}</p>
                    <p className="text-xs">{op.label.split(' ')[1]}</p>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setMostrarModalPeriodo(false)}
                className="w-full mt-4 p-3 bg-neutral-200 dark:bg-neutral-800 rounded-xl font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
          </>
        ) : (
          <div className="space-y-4">
            {meusEmprestimos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500 dark:text-neutral-400">Você ainda não possui empréstimos</p>
              </div>
            ) : (
              meusEmprestimos.map((emprestimo) => {
                const parcelasPagas = emprestimo.parcelasPagas || 0
                const totalParcelas = emprestimo.parcelas || 0
                const isFinalizado = parcelasPagas >= totalParcelas
                
                return (
                <div key={emprestimo.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-black dark:text-white">
                        {emprestimo.valor.toLocaleString('pt-PT')} €
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{emprestimo.motivo}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      isFinalizado 
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    }`}>
                      {isFinalizado ? 'Finalizado' : 'Ativo'}
                    </span>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Parcelas:</span>
                      <span className="font-semibold text-black dark:text-white">
                        {parcelasPagas}/{totalParcelas}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Valor da parcela:</span>
                      <span className="font-semibold text-black dark:text-white">
                        {emprestimo.valorParcela?.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Juros aplicados:</span>
                      <span className="font-semibold text-orange-600">{emprestimo.juros}%</span>
                    </div>
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Total a pagar:</span>
                        <span className="font-bold text-red-600 text-lg">
                          {emprestimo.valorTotal?.toFixed(2)} €
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">Vencimento:</span>
                      <div className="text-right">
                        <p className="font-semibold text-black dark:text-white">A cada {emprestimo.periodo} dias</p>
                        <p className="text-xs text-brand-600">
                          Próxima: {new Date(new Date(emprestimo.data).getTime() + (emprestimo.periodo || 30) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                    Solicitado em: {new Date(emprestimo.data).toLocaleDateString('pt-PT')}
                  </div>

                  {!isFinalizado && (
                    <button
                      onClick={() => handleAbrirModalPagamento(emprestimo)}
                      className="mt-4 w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-colors"
                    >
                      Pagar Parcela ({emprestimo.valorParcela?.toFixed(2)} €)
                    </button>
                  )}
                </div>
                )
              })
            )}
          </div>
        )}

        {/* Modal de Pagamento com Dados Bancários */}
        {mostrarModalPagamento && emprestimoSelecionado && dadosBancarios && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-8 pb-4 px-4 overflow-y-auto"
            onClick={() => setMostrarModalPagamento(false)}
          >
            <div 
              className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 animate-in fade-in zoom-in duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                Pagamento de Parcela
              </h3>

              <div className="bg-brand-50 dark:bg-brand-950 border-2 border-brand-300 dark:border-brand-700 p-3 rounded-xl mb-3">
                <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-1">
                  Valor da parcela:
                </p>
                <p className="text-2xl font-bold text-brand-600">
                  {emprestimoSelecionado.valorParcela?.toFixed(2)} €
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-300 dark:border-yellow-700 p-3 rounded-xl mb-3">
                <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Instruções de Pagamento
                </p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Faça uma transferência bancária para a conta abaixo e após a confirmação do gestor, sua parcela será marcada como paga.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 mb-3">
                <h4 className="font-bold text-black dark:text-white mb-2 text-sm">
                  Dados Bancários do Gestor
                </h4>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Nome</p>
                    <p className="font-semibold text-black dark:text-white text-sm">{dadosBancarios.nome}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Banco</p>
                    <p className="font-semibold text-black dark:text-white text-sm">{dadosBancarios.banco}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">IBAN</p>
                    <p className="font-mono font-semibold text-black dark:text-white text-xs">{dadosBancarios.iban}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">NIB</p>
                    <p className="font-mono font-semibold text-black dark:text-white text-xs">{dadosBancarios.nib}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">SWIFT/BIC</p>
                    <p className="font-mono font-semibold text-black dark:text-white text-xs">{dadosBancarios.swift}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalPagamento(false)}
                  className="flex-1 py-2.5 px-4 bg-neutral-200 dark:bg-neutral-800 rounded-xl font-semibold text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarPagamento}
                  className="flex-1 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors text-sm"
                >
                  Confirmar Pagamento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreditoPage
