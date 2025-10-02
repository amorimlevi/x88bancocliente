import { useState } from 'react'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaremos a autenticação real
    onLogin(email)
  }

  if (mostrarRecuperar) {
    return <RecuperarSenha onVoltar={() => setMostrarRecuperar(false)} />
  }

  return (
    <div className="container-app flex items-center justify-center px-4 py-8">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img 
              src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759200105/logotipo_X88_green.fw_itwz41.png" 
              alt="X88 Logo"
              className="w-40 h-40 object-contain"
            />
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
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-black text-neutral-500 dark:text-neutral-400">ou</span>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onMostrarCadastro}
            className="w-full mt-6 py-3 px-6 rounded-2xl font-semibold border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors relative z-10 touch-manipulation"
          >
            Criar Nova Conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
