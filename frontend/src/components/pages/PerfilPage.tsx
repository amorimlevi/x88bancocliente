import { useState } from 'react'
import { UserIcon, LogOutIcon, BellIcon, LockIcon, CreditCardIcon, MapPinIcon } from '../ui/Icons'
import DadosBancariosPage from './DadosBancariosPage'
import EnderecoPage from './EnderecoPage'
import { DadosUsuario } from '../auth/Cadastro'

interface PerfilPageProps {
  onLogout?: () => void
  dadosUsuario: DadosUsuario | null
  userId?: string
  dadosBancarios: {
    iban: string
    titular: string
    banco: string
    nib: string
    mbWay: string
  }
  onSalvarDadosBancarios: (dados: { iban: string; titular: string; banco: string; nib: string; mbWay: string }) => void
}

const PerfilPage = ({ onLogout, dadosUsuario, userId = '0001', dadosBancarios, onSalvarDadosBancarios }: PerfilPageProps) => {
  const [mostrarDadosBancarios, setMostrarDadosBancarios] = useState(false)
  const [mostrarEndereco, setMostrarEndereco] = useState(false)

  if (mostrarDadosBancarios) {
    return <DadosBancariosPage 
      onVoltar={() => setMostrarDadosBancarios(false)} 
      dadosBancarios={dadosBancarios}
      onSalvar={onSalvarDadosBancarios}
    />
  }

  if (mostrarEndereco) {
    return <EnderecoPage onVoltar={() => setMostrarEndereco(false)} dadosUsuario={dadosUsuario} />
  }

  const usuario = {
    id: userId,
    nome: dadosUsuario?.nome || 'João Silva',
    email: dadosUsuario?.email || 'joao.silva@email.com',
    telefone: dadosUsuario?.telefone || '+351 912 345 678',
    dataCadastro: '15/03/2024'
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-brand-500 px-4 pt-8 pb-20 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-white/90 text-sm">Gerencie suas informações pessoais</p>
        </div>

        {/* Avatar Card */}
        <div className="px-4 -mt-12">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <UserIcon size="lg" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div className="flex-1">
                <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">ID: {usuario.id}</p>
                <h2 className="text-black dark:text-white text-xl font-bold">{usuario.nome}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">{usuario.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Pessoais */}
        <div className="px-4 mt-6">
          <h3 className="text-black dark:text-white text-lg font-bold mb-3">Informações Pessoais</h3>
          
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Nome Completo</p>
              <p className="text-black dark:text-white font-medium">{usuario.nome}</p>
            </div>
            
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Email</p>
              <p className="text-black dark:text-white font-medium">{usuario.email}</p>
            </div>
            
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Telefone</p>
              <p className="text-black dark:text-white font-medium">{usuario.telefone}</p>
            </div>
            
            <div className="p-4">
              <p className="text-neutral-500 dark:text-neutral-400 text-xs mb-1">Membro desde</p>
              <p className="text-black dark:text-white font-medium">{usuario.dataCadastro}</p>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="px-4 mt-6">
          <h3 className="text-black dark:text-white text-lg font-bold mb-3">Configurações</h3>
          
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <button 
              onClick={() => setMostrarDadosBancarios(true)}
              className="w-full p-4 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <CreditCardIcon size="md" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-black dark:text-white font-medium">Dados Bancários</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Editar informações de pagamento</p>
              </div>
            </button>
            
            <button 
              onClick={() => setMostrarEndereco(true)}
              className="w-full p-4 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <MapPinIcon size="md" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-black dark:text-white font-medium">Endereço</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Editar endereço de correspondência</p>
              </div>
            </button>
            
            <button className="w-full p-4 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <BellIcon size="md" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-black dark:text-white font-medium">Notificações</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Gerencie suas preferências</p>
              </div>
            </button>
            
            <button className="w-full p-4 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <LockIcon size="md" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-black dark:text-white font-medium">Segurança</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Alterar senha e autenticação</p>
              </div>
            </button>
          </div>
        </div>

        {/* Botão de Sair */}
        <div className="px-4 mt-6">
          <button
            onClick={onLogout}
            className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 rounded-2xl p-4 flex items-center justify-center gap-2 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
          >
            <LogOutIcon size="md" />
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default PerfilPage
