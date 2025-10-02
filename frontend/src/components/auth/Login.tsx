import { useState, useEffect } from 'react'
import { UserIcon, EyeIcon, EyeOffIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'
import RecuperarSenha from './RecuperarSenha'

interface LoginProps {
  onLogin: (email: string) => void
  onMostrarCadastro: () => void
}

const Login = ({ onLogin, onMostrarCadastro }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [manterConectado, setManterConectado] = useState(false)
  const [mostrarRecuperar, setMostrarRecuperar] = useState(false)

  useEffect(() => {
    // Define a cor da status bar quando o componente monta
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#15FF5D')
    }

    // Restaura a cor original quando o componente desmonta
    return () => {
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#ffffff')
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaremos a autenticação real
    onLogin(email)
  }

  if (mostrarRecuperar) {
    return <RecuperarSenha onVoltar={() => setMostrarRecuperar(false)} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ 
      backgroundColor: '#15FF5D', 
      paddingTop: 'calc(2rem + env(safe-area-inset-top))',
      paddingBottom: 'max(2rem, env(safe-area-inset-bottom))'
    }}>
      <div className="absolute ios-safe-top" style={{ top: '1.5rem', right: '1.5rem' }}>
        <ThemeToggle customClassName="p-3 rounded-xl hover:opacity-80 transition-opacity" />
      </div>
      
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
              alt="X88 Logo"
              className="w-60 h- object-contain"            />
          </div>
          <h1 className="heading-1 mb-2"></h1>
          <p className="text-body text-lg"></p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full text-base"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pr-12 text-base"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-primary dark:hover:text-dark-text-primary"
                >
                  {showPassword ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                </button>
              </div>
            </div>

            {/* Manter Conectado */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="manterConectado"
                checked={manterConectado}
                onChange={(e) => setManterConectado(e.target.checked)}
                className="w-4 h-4 text-brand-600 border-neutral-300 rounded focus:ring-brand-500 dark:border-neutral-700 dark:bg-neutral-800"
              />
              <label htmlFor="manterConectado" className="ml-2 text-sm text-light-text-primary dark:text-dark-text-primary">
                Mantenha-me conectado
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-3"
            >
              <UserIcon size="md" />
              <span>Entrar</span>
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-body">
              Esqueceu a sua palavra-passe?{' '}
              <button 
                type="button"
                onClick={() => setMostrarRecuperar(true)}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors"
              >
                Recuperar
              </button>
            </p>
          </div>
        </div>

        {/* Criar Conta */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-black font-semibold" style={{ backgroundColor: '#15FF5D' }}>ou</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onMostrarCadastro()
            }}
            className="w-full mt-6 py-3 px-6 rounded-2xl font-semibold border-2 text-black hover:opacity-80 transition-opacity relative z-10 touch-manipulation"
            style={{ borderColor: '#000', backgroundColor: 'transparent' }}
          >
            Criar Nova Conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
