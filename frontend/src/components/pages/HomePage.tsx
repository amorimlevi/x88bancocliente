import { WalletIcon, CopyIcon } from '../ui/Icons'
import MinhasTransacoes from '../transacoes/MinhasTransacoes'
import { useState } from 'react'

interface HomePageProps {
  saldoX88: number
  saldoEmEuros: number
  creditoDisponivel: number
  transacoesPendentes: number
  transacoes: any[]
  onNavigate: (pagina: string) => void
  userId?: string
  nomeUsuario?: string
}

const HomePage = ({
  saldoX88,
  saldoEmEuros,
  creditoDisponivel,
  transacoesPendentes,
  transacoes,
  onNavigate,
  userId = '0001',
  nomeUsuario = 'Usuário'
}: HomePageProps) => {
  const [copiado, setCopiado] = useState(false)

  const copiarNumeroConta = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-black min-h-full">
      <div className="max-w-md mx-auto">
        {/* Logo e Nome */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759232674/LOGOTIPO_X88_PNG.fw_vjg6f1.png" 
            alt="X88 Logo"
            className="w-20 h-16 object-contain"
          />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            X88 Bank
          </h1>
        </div>

        {/* Card Verde - Saldo Disponível */}
        <div className="mb-3">
          <div className="rounded-3xl p-5 shadow-lg relative overflow-hidden" style={{ 
            backgroundColor: '#15FF5D', 
            borderColor: '#15FF5D',
            minHeight: '180px'
          }}>
            {/* Header do Cartão */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-black/70 text-sm font-semibold uppercase tracking-wider mb-1">X88 Bank</p>
                <p className="text-black text-base font-bold">Saldo Disponível</p>
              </div>
              <WalletIcon size="md" className="text-black" />
            </div>
            
            {/* Valor Principal */}
            <div className="mb-5">
              <p className="text-black text-4xl font-bold leading-none mb-1">
                {saldoX88.toLocaleString('pt-PT')} 
              </p>
              <p className="text-black/80 text-lg font-semibold">
                {saldoX88.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </p>
            </div>

            {/* Número da Conta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-black/70 text-sm font-semibold mb-0.5">Conta</p>
                  <p className="text-black text-base font-mono font-bold tracking-wider">{userId}</p>
                </div>
                <button
                  onClick={copiarNumeroConta}
                  className="p-2 rounded-lg hover:bg-black/10 transition-colors active:scale-95"
                  title="Copiar número da conta"
                >
                  {copiado ? (
                    <span className="text-black text-sm font-bold">✓</span>
                  ) : (
                    <CopyIcon size="md" className="text-black" />
                  )}
                </button>
              </div>

              {/* Logo X88 */}
              <img 
                src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
                alt="X88"
                className="w-14 h-9 object-contain opacity-90"
              />
            </div>
          </div>
        </div>
         {/* Botão Transferir X88 */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('transferir-x88')}
            className="w-full rounded-2xl p-5 shadow-md text-center hover:shadow-lg transition-shadow relative"
            style={{ backgroundColor: '#FFF700', borderColor: '#FFF700' }}
          >
            <p className="text-black text-2xl mb-1 font-bold">
              Pagar
            </p>
            <p className="text-black text-sm font-medium">
             
            </p>
            <div className="absolute bottom-4 right-4">
              <img 
                src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
                alt="X88"
                className="w-12 h-4 object-contain"
              />
            </div>
          </button>
        </div>

        {/* Card Branco - Crédito Disponível (só aparece se creditoDisponivel > 0) */}
        {creditoDisponivel > 0 && (
        <div className="mb-3">
        <button
          onClick={() => onNavigate('sacar')}
            className="w-full bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow border border-neutral-100 dark:border-neutral-800"
        >
        <p className="text-dark black-500 dark :text-neutral-400 text-sm mb-2">
            Crédito Disponível
          </p>
        <p className="text-brand-600 dark:text-brand-500 text-3xl font-bold">
            {creditoDisponivel.toLocaleString('pt-PT')} X88
            </p>
            </button>
          </div>
        )}

       

        {/* Minhas Transações */}
        <MinhasTransacoes 
          transacoes={transacoes} 
          userId={userId}
          nomeUsuario={nomeUsuario}
        />
      </div>
    </div>
  )
}

export default HomePage
