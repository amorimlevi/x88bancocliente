import { WalletIcon } from '../ui/Icons'
import MinhasTransacoes from '../transacoes/MinhasTransacoes'

interface HomePageProps {
  saldoX88: number
  saldoEmEuros: number
  creditoDisponivel: number
  transacoesPendentes: number
  transacoes: any[]
  onNavigate: (pagina: string) => void
}

const HomePage = ({
  saldoX88,
  saldoEmEuros,
  creditoDisponivel,
  transacoesPendentes,
  transacoes,
  onNavigate
}: HomePageProps) => {
  return (
    <div className="p-4 pb-24 bg-white dark:bg-black">
      <div className="max-w-md mx-auto">
        {/* Logo e Nome */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759232674/LOGOTIPO_X88_PNG.fw_vjg6f1.png" 
            alt="X88 Logo"
            className="w-16 h-12 object-contain"
          />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            X88 Bank
          </h1>
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

        {/* Card Branco - Crédito Disponível */}
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

       

        {/* Minhas Transações */}
        <MinhasTransacoes transacoes={transacoes} />
      </div>
    </div>
  )
}

export default HomePage
