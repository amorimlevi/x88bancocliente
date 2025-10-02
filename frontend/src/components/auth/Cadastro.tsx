import { useState } from 'react'
import { UserIcon, EyeIcon, EyeOffIcon, MapPinIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'

export interface DadosUsuario {
  nome: string
  email: string
  telefone: string
  morada: string
  codigoPostal: string
  cidade: string
  distrito: string
}

interface CadastroProps {
  onVoltar: () => void
  onCadastro: (dados: DadosUsuario) => void
}

const Cadastro = ({ onVoltar, onCadastro }: CadastroProps) => {
  const [etapa, setEtapa] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Dados Pessoais
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Endereço
  const [morada, setMorada] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [cidade, setCidade] = useState('')
  const [distrito, setDistrito] = useState('')

  const handleSubmitEtapa1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!')
      return
    }
    setEtapa(2)
  }

  const handleSubmitEtapa2 = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria o cadastro real
    const dadosUsuario: DadosUsuario = {
      nome,
      email,
      telefone,
      morada,
      codigoPostal,
      cidade,
      distrito
    }
    onCadastro(dadosUsuario)
  }

  return (
    <div className="container-app flex items-center justify-center px-4 py-8">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-4 shadow-soft">
            <UserIcon size="lg" className="text-white" />
          </div>
          <h1 className="heading-1 mb-2">Criar Nova Conta</h1>
          <p className="text-body">Preencha seus dados para começar</p>
        </div>

        {/* Indicador de Etapas */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${etapa >= 1 ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
          <div className={`w-3 h-3 rounded-full ${etapa >= 2 ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
        </div>

        {/* Formulário */}
        <div className="card">
          {/* Etapa 1: Dados Pessoais */}
          {etapa === 1 && (
            <form onSubmit={handleSubmitEtapa1} className="space-y-5">
              <h2 className="text-lg font-bold text-black dark:text-white mb-4">Dados Pessoais</h2>

              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="input w-full"
                  placeholder="João Silva"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="input w-full"
                  placeholder="+351 912 345 678"
                  required
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Palavra-passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="input w-full pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted"
                  >
                    {showPassword ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Confirmar Palavra-passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmarSenha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="input w-full pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted"
                  >
                    {showConfirmPassword ? <EyeOffIcon size="md" /> : <EyeIcon size="md" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                Continuar
              </button>

              <button
                type="button"
                onClick={onVoltar}
                className="w-full py-3 px-6 rounded-2xl font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Voltar
              </button>
            </form>
          )}

          {/* Etapa 2: Endereço */}
          {etapa === 2 && (
            <form onSubmit={handleSubmitEtapa2} className="space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                  <MapPinIcon size="md" className="text-brand-600 dark:text-brand-500" />
                </div>
                <h2 className="text-lg font-bold text-black dark:text-white">Endereço</h2>
              </div>

              <div>
                <label htmlFor="morada" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Morada
                </label>
                <input
                  type="text"
                  id="morada"
                  value={morada}
                  onChange={(e) => setMorada(e.target.value)}
                  className="input w-full"
                  placeholder="Rua da Liberdade, 123, 2º Andar"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="codigoPostal" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    id="codigoPostal"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    className="input w-full"
                    placeholder="1250-142"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cidade" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="input w-full"
                    placeholder="Lisboa"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="distrito" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                  Distrito
                </label>
                <input
                  type="text"
                  id="distrito"
                  value={distrito}
                  onChange={(e) => setDistrito(e.target.value)}
                  className="input w-full"
                  placeholder="Lisboa"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEtapa(1)}
                  className="flex-1 py-3 px-6 rounded-2xl font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Voltar
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Criar Conta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cadastro
