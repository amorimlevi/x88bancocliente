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
        {/* Welcome Section */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-1">
            Bem-vindo ao X88 Bank! 🏦
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            Gerencie suas transações de forma simples e rápida
          </p>
        </div>

        {/* Card Verde - Saldo Disponível */}
        <div className="mb-3">
          <div className=" rounded-2xl p-6 shadow-md" style={{ backgroundColor: '#15FF5D', borderColor: '#15FF5D' }}>
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

        {/* Card Branco - Crédito Disponível */}
        <div className="mb-3">
          <button
            onClick={() => onNavigate('credito')}
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
