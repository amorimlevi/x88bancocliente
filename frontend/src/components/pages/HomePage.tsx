import { WalletIcon, CopyIcon } from '../ui/Icons'
import MinhasTransacoes from '../transacoes/MinhasTransacoes'
import AcoesRapidas from '../ui/AcoesRapidas'
import ReceberModal from '../modals/ReceberModal'
import PagarModal from '../modals/PagarModal'
import TransferirModal from '../modals/TransferirModal'
import { useState, useEffect } from 'react'

interface HomePageProps {
  saldoX88: number
  saldoEmEuros: number
  creditoDisponivel: number
  transacoesPendentes: number
  transacoes: any[]
  onNavigate: (pagina: string) => void
  userId?: string
  nomeUsuario?: string
  onModalChange?: (isOpen: boolean) => void
  onTransferir?: (destinatarioId: string, valor: number, destinatarioNome?: string) => void
}

const HomePage = ({
  saldoX88,
  saldoEmEuros,
  creditoDisponivel,
  transacoesPendentes,
  transacoes,
  onNavigate,
  userId = '0001',
  nomeUsuario = 'Usuário',
  onModalChange,
  onTransferir
}: HomePageProps) => {
  const [copiado, setCopiado] = useState(false)
  const [modalReceber, setModalReceber] = useState(false)
  const [modalPagar, setModalPagar] = useState(false)
  const [modalTransferir, setModalTransferir] = useState(false)

  // Notificar quando modais abrem/fecham
  useEffect(() => {
    const modalAberto = modalReceber || modalPagar || modalTransferir
    onModalChange?.(modalAberto)
  }, [modalReceber, modalPagar, modalTransferir, onModalChange])

  const copiarNumeroConta = async () => {
    try {
      await navigator.clipboard.writeText(userId)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const acoes = [
    {
      id: 'receber',
      icone: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      ),
      titulo: 'Receber',
      cor: '#15FF5D',
      corIcone: '#000000',
      onClick: () => setModalReceber(true)
    },
    {
      id: 'pagar',
      icone: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-12h8v8h-8V3zm2 2v4h4V5h-4zM13 13h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm-2-2h2v2h-2v-2zm2 4h2v2h-2v-2z"/>
        </svg>
      ),
      titulo: 'Pagar QR Code',
      cor: '#FFF700',
      corIcone: '#000000',
      onClick: () => setModalPagar(true)
    },
    {
      id: 'transferir',
      icone: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      titulo: 'Transferir',
      cor: '#E8E8E8',
      corIcone: '#1F2937',
      onClick: () => setModalTransferir(true)
    },
    {
      id: 'extrato',
      icone: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      titulo: 'Extrato',
      cor: '#E8E8E8',
      corIcone: '#1F2937',
      onClick: () => onNavigate('historico')
    },
    {
      id: 'historico',
      icone: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titulo: 'Histórico',
      cor: '#E8E8E8',
      corIcone: '#1F2937',
      onClick: () => onNavigate('historico')
    },
    {
      id: 'solicitar',
      icone: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      titulo: 'Solicitar X88',
      cor: '#E8E8E8',
      corIcone: '#1F2937',
      onClick: () => onNavigate('sacar')
    },
    {
      id: 'emprestimo',
      icone: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      titulo: 'Empréstimo',
      cor: '#E8E8E8',
      corIcone: '#1F2937',
      onClick: () => onNavigate('credito')
    }
  ]

  return (
    <div className="p-4 bg-white dark:bg-black min-h-full">
      <div className="max-w-md mx-auto">
        {/* Logo e Nome */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759232674/LOGOTIPO_X88_PNG.fw_vjg6f1.png" 
            alt="X88 Logo"
            className="w-20 h-16 object-contain"
          />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            X88 Bank
          </h1>
        </div>

        {/* Card Verde - Saldo Disponível */}
        <div className="mb-3">
          <div className="rounded-3xl p-5 shadow-lg relative overflow-hidden" style={{ 
            backgroundColor: '#15FF5D', 
            borderColor: '#15FF5D',
            minHeight: '180px'
          }}>
            {/* Header do Cartão */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-black/70 text-sm font-semibold uppercase tracking-wider mb-1">X88 Bank</p>
                <p className="text-black text-base font-bold">Saldo Disponível</p>
              </div>
              <WalletIcon size="md" className="text-black" />
            </div>
            
            {/* Valor Principal */}
            <div className="mb-5">
              <p className="text-black text-4xl font-bold leading-none mb-1">
                {saldoX88.toLocaleString('pt-PT')} 
              </p>
              <p className="text-black/80 text-lg font-semibold">
                {saldoX88.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </p>
            </div>

            {/* Número da Conta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-black/70 text-sm font-semibold mb-0.5">Conta</p>
                  <p className="text-black text-base font-mono font-bold tracking-wider">{userId}</p>
                </div>
                <button
                  onClick={copiarNumeroConta}
                  className="p-2 rounded-lg hover:bg-black/10 transition-colors active:scale-95"
                  title="Copiar número da conta"
                >
                  {copiado ? (
                    <span className="text-black text-sm font-bold">✓</span>
                  ) : (
                    <CopyIcon size="md" className="text-black" />
                  )}
                </button>
              </div>

              {/* Logo X88 */}
              <img 
                src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
                alt="X88"
                className="w-14 h-9 object-contain opacity-90"
              />
            </div>
          </div>
        </div>

        {/* Ações Rápidas - Scroll Horizontal */}
        <AcoesRapidas acoes={acoes} />

        {/* Card Branco - Crédito Disponível (só aparece se creditoDisponivel > 0) */}
        {creditoDisponivel > 0 && (
        <div className="mb-3">
        <button
          onClick={() => onNavigate('sacar')}
            className="w-full bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow border border-neutral-100 dark:border-neutral-800"
        >
        <p className="text-dark black-500 dark :text-neutral-400 text-sm mb-2">
            Crédito Disponível
          </p>
        <p className="text-brand-600 dark:text-brand-500 text-3xl font-bold">
            {creditoDisponivel.toLocaleString('pt-PT')} X88
            </p>
            </button>
          </div>
        )}

       

        {/* Minhas Transações */}
        <MinhasTransacoes 
          transacoes={transacoes} 
          userId={userId}
          nomeUsuario={nomeUsuario}
        />
      </div>

      {/* Modals */}
      <ReceberModal 
        isOpen={modalReceber}
        onClose={() => setModalReceber(false)}
        contaId={userId}
        nomeUsuario={nomeUsuario}
      />

      <PagarModal
        isOpen={modalPagar}
        onClose={() => setModalPagar(false)}
        onScanQR={() => {
          // TODO: Implementar scanner QR Code
          console.log('Abrir scanner QR')
        }}
        onDigitarId={() => {
          onNavigate('transferir-x88')
        }}
        userId={userId}
      />

      <TransferirModal
        isOpen={modalTransferir}
        onClose={() => setModalTransferir(false)}
        saldoDisponivel={saldoX88}
        onSubmit={(destinatarioId, valor, destinatarioNome) => {
          onTransferir?.(destinatarioId, valor, destinatarioNome)
        }}
        userId={userId}
      />
    </div>
  )
}

export default HomePage
