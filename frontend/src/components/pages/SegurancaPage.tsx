import { useState } from 'react'
import { ArrowLeftIcon, LockIcon, EyeIcon, EyeOffIcon } from '../ui/Icons'

interface SegurancaPageProps {
  onVoltar: () => void
}

const SegurancaPage = ({ onVoltar }: SegurancaPageProps) => {
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false)
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
  const [autenticacaoDoisFatores, setAutenticacaoDoisFatores] = useState(false)
  const [biometria, setBiometria] = useState(true)

  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault()
    if (novaSenha === confirmarSenha) {
      alert('Senha alterada com sucesso!')
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
    } else {
      alert('As senhas não coincidem!')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-brand-500 px-4 pt-8 pb-20 rounded-b-3xl">
          <button
            onClick={onVoltar}
            className="text-white mb-4 flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ArrowLeftIcon size="md" />
            <span>Voltar</span>
          </button>
          <h1 className="text-white text-2xl font-bold mb-2">Segurança</h1>
          <p className="text-white/90 text-sm">Proteja sua conta e seus dados</p>
        </div>

        {/* Content */}
        <div className="px-4 -mt-12">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-100 dark:border-neutral-800 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <LockIcon size="lg" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div>
                <h2 className="text-black dark:text-white text-lg font-bold">Alterar Senha</h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Mantenha sua senha segura</p>
              </div>
            </div>

            <form onSubmit={handleAlterarSenha} className="space-y-4">
              {/* Senha Atual */}
              <div>
                <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaAtual ? 'text' : 'password'}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    className="input w-full pr-12"
                    placeholder="Digite sua senha atual"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {mostrarSenhaAtual ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                  </button>
                </div>
              </div>

              {/* Nova Senha */}
              <div>
                <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarNovaSenha ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="input w-full pr-12"
                    placeholder="Digite sua nova senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {mostrarNovaSenha ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                  </button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Mínimo de 8 caracteres
                </p>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarConfirmarSenha ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="input w-full pr-12"
                    placeholder="Confirme sua nova senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    {mostrarConfirmarSenha ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
              >
                Alterar Senha
              </button>
            </form>
          </div>

          {/* Configurações de Segurança */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-100 dark:border-neutral-800 mb-6">
            <h3 className="text-black dark:text-white text-lg font-bold mb-4">Configurações Adicionais</h3>
            
            <div className="space-y-4">
              {/* Autenticação de Dois Fatores */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Autenticação de Dois Fatores</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Adicione uma camada extra de segurança
                  </p>
                </div>
                <button
                  onClick={() => setAutenticacaoDoisFatores(!autenticacaoDoisFatores)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autenticacaoDoisFatores ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      autenticacaoDoisFatores ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Biometria */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Login com Biometria</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Use digital ou reconhecimento facial
                  </p>
                </div>
                <button
                  onClick={() => setBiometria(!biometria)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    biometria ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      biometria ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Nunca compartilhe sua senha com ninguém. O X88 Bank nunca solicitará sua senha por email ou telefone.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SegurancaPage
