import { LogOutIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'

const Header = () => {
  const handleLogout = () => {
    // Implementar logout
    window.location.reload()
  }

  return (
    <header className="bg-white dark:bg-black p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Logo - Estilo PagBank */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center">
            <svg 
              className="w-7 h-7 text-white" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-black dark:text-white leading-none">X88</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Bank</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-neutral-600 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Sair"
          >
            <LogOutIcon size="md" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
