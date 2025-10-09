import { useState } from 'react'
import { ArrowLeftIcon, BellIcon } from '../ui/Icons'

interface NotificacoesPageProps {
  onVoltar: () => void
}

const NotificacoesPage = ({ onVoltar }: NotificacoesPageProps) => {
  const [notificacoesPush, setNotificacoesPush] = useState(true)
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesTransacoes, setNotificacoesTransacoes] = useState(true)
  const [notificacoesEmprestimos, setNotificacoesEmprestimos] = useState(true)
  const [notificacoesPromocoes, setNotificacoesPromocoes] = useState(false)

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
          <h1 className="text-white text-2xl font-bold mb-2">Notificações</h1>
          <p className="text-white/90 text-sm">Gerencie suas preferências de notificações</p>
        </div>

        {/* Content */}
        <div className="px-4 -mt-12">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                <BellIcon size="lg" className="text-brand-600 dark:text-brand-500" />
              </div>
              <div>
                <h2 className="text-black dark:text-white text-lg font-bold">Preferências</h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">Configure como deseja ser notificado</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Notificações Push */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Notificações Push</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Receba notificações no aplicativo
                  </p>
                </div>
                <button
                  onClick={() => setNotificacoesPush(!notificacoesPush)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificacoesPush ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notificacoesPush ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notificações Email */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Notificações por Email</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Receba notificações por email
                  </p>
                </div>
                <button
                  onClick={() => setNotificacoesEmail(!notificacoesEmail)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificacoesEmail ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notificacoesEmail ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Transações */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Transações</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Notificações sobre suas transações
                  </p>
                </div>
                <button
                  onClick={() => setNotificacoesTransacoes(!notificacoesTransacoes)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificacoesTransacoes ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notificacoesTransacoes ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Empréstimos */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Empréstimos</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Notificações sobre empréstimos e parcelas
                  </p>
                </div>
                <button
                  onClick={() => setNotificacoesEmprestimos(!notificacoesEmprestimos)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificacoesEmprestimos ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notificacoesEmprestimos ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Promoções */}
              <div className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">Promoções e Novidades</p>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
                    Receba ofertas e atualizações do X88 Bank
                  </p>
                </div>
                <button
                  onClick={() => setNotificacoesPromocoes(!notificacoesPromocoes)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notificacoesPromocoes ? 'bg-brand-500' : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notificacoesPromocoes ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Você pode alterar essas configurações a qualquer momento. Recomendamos manter as notificações de transações ativadas para sua segurança.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificacoesPage
