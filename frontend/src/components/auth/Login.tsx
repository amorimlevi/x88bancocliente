import { useState } from 'react'
import { UserIcon, EyeIcon, EyeOffIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'

interface LoginProps {
  onLogin: (email: string) => void
}

const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaremos a autenticação real
    onLogin(email)
  }

  return (
    <div className="container-app flex items-center justify-center px-4 py-8">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-6 shadow-soft">
            <svg 
              className="w-10 h-10 text-white" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
          <h1 className="heading-1 mb-2">X88 Colaborador</h1>
          <p className="text-body text-lg">Solicite seus pagamentos de forma simples</p>
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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-3"
            >
              <UserIcon size="md" />
              <span>Entrar</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-body">
              Esqueceu a sua palavra-passe?{' '}
              <a href="#" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">
                Recuperar
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
