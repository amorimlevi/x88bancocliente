import { useState } from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'

interface RecuperarSenhaProps {
  onVoltar: () => void
}

const RecuperarSenha = ({ onVoltar }: RecuperarSenhaProps) => {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui implementaremos o envio do email de recuperação
    setEnviado(true)
  }

  return (
    <div className="page-container flex items-center justify-center px-4 py-8">
      <div className="absolute right-6" style={{ top: 'max(24px, calc(env(safe-area-inset-top) + 8px))' }}>
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
          <h1 className="heading-1 mb-2">Recuperar Senha</h1>
          <p className="text-body text-lg">
            {!enviado 
              ? 'Informe seu email para recuperar a senha' 
              : 'Email enviado com sucesso!'}
          </p>
        </div>

        {/* Recuperar Form */}
        <div className="card">
          {!enviado ? (
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

              {/* Enviar Button */}
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Enviar link de recuperação
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-body mb-6">
                Enviamos um link de recuperação para <strong>{email}</strong>. 
                Verifique sua caixa de entrada.
              </p>
              <button
                onClick={onVoltar}
                className="btn-primary"
              >
                Voltar ao login
              </button>
            </div>
          )}

          {!enviado && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onVoltar}
                className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors text-sm"
              >
                ← Voltar ao login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecuperarSenha
