import { HomeIcon, ArrowDownIcon, CreditCardIcon, HistoryIcon, UserIcon } from '../ui/Icons'

interface BottomNavProps {
  paginaAtual: string
  onNavigate: (pagina: string) => void
}

const BottomNav = ({ paginaAtual, onNavigate }: BottomNavProps) => {
  const menuItems = [
    { id: 'inicio', icon: HomeIcon, label: 'Início' },
    { id: 'sacar', icon: ArrowDownIcon, label: 'X88' },
    { id: 'credito', icon: CreditCardIcon, label: 'Crédito' },
    { id: 'historico', icon: HistoryIcon, label: 'Histórico' },
    { id: 'perfil', icon: UserIcon, label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 safe-area-bottom z-50">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = paginaAtual === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-500'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Icon size="md" />
              <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
