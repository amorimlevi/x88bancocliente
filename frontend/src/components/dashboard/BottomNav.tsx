import { useState, useEffect } from 'react'
import { HomeIcon, HistoryIcon, UserIcon } from '../ui/Icons'

interface BottomNavProps {
  paginaAtual: string
  onNavigate: (pagina: string) => void
}

const BottomNav = ({ paginaAtual, onNavigate }: BottomNavProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Rolando para baixo e passou de 100px
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Rolando para cima
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  const X88Icon = () => (
    <img 
      src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" 
      alt="X88"
      className="w-4 h-4 object-contain"
    />
  )

  const EuroIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M15 18.5c-2.51 0-4.68-1.42-5.76-3.5H15v-2H8.58c-.05-.33-.08-.66-.08-1s.03-.67.08-1H15V9H9.24C10.32 6.92 12.5 5.5 15 5.5c1.61 0 3.09.59 4.23 1.57L21 5.3C19.41 3.87 17.3 3 15 3c-3.92 0-7.24 2.51-8.48 6H3v2h3.06c-.04.33-.06.66-.06 1 0 .34.02.67.06 1H3v2h3.52c1.24 3.49 4.56 6 8.48 6 2.31 0 4.41-.87 6-2.3l-1.78-1.77c-1.13.98-2.6 1.57-4.22 1.57z"/>
    </svg>
  )
  
  const menuItems = [
    { id: 'inicio', icon: HomeIcon, label: 'Início' },
    { id: 'sacar', icon: X88Icon, label: 'X88' },
    { id: 'credito', icon: EuroIcon, label: 'Empréstimo' },
    { id: 'historico', icon: HistoryIcon, label: 'Histórico' },
    { id: 'perfil', icon: UserIcon, label: 'Perfil' },
  ]

  return (
    <nav 
      className={`fixed left-4 right-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-xl z-50 transition-all duration-300 ${
        isVisible ? 'bottom-4 translate-y-0 opacity-100' : 'bottom-4 translate-y-32 opacity-0'
      }`}
      style={{ 
        marginBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-3 backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 rounded-3xl">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = paginaAtual === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                isActive
                  ? 'text-brand-600 dark:text-brand-500'
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <Icon size="sm" />
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
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
