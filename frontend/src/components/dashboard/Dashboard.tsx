import { useState, useEffect, useRef } from 'react'
import BottomNav from './BottomNav'
import HomePage from '../pages/HomePage'
import SacarPage from '../pages/SacarPage'
import CreditoPage from '../pages/CreditoPage'
import HistoricoPage from '../pages/HistoricoPage'
import PerfilPage from '../pages/PerfilPage'
import TransferirX88Page from '../pages/TransferirX88Page'
import { DadosUsuario } from '../auth/Cadastro'
import { useCarteira, useTransacoes, useSolicitacoes, useCliente } from '../../hooks/useSupabaseData'
import { criarSolicitacao, transferirX88 } from '../../services/supabaseService'

interface Transacao {
  id: string
  tipo: 'saque' | 'credito' | 'transferencia' | 'x88'
  valor: number
  valorEuro?: number
  telefone?: string
  motivo?: string
  data: string
  status: 'pendente' | 'aprovado' | 'negado'
  parcelas?: number
  periodo?: number
  valorTotal?: number
  valorParcela?: number
  juros?: number
  destinatarioId?: string
  destinatarioNome?: string
  parcelasPagas?: number
}

interface DashboardProps {
  onLogout: () => void
  dadosUsuario: DadosUsuario | null
  userId?: string
  saldoInicial?: number
  creditoInicial?: number
  isNewAccount?: boolean
}

const Dashboard = ({ onLogout, dadosUsuario, userId = '0001' }: DashboardProps) => {
  const [paginaAtual, setPaginaAtual] = useState('inicio')
  const [paginaAnterior, setPaginaAnterior] = useState<string | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const { cliente, loading: clienteLoading } = useCliente(userId)
  const { carteira, atualizarCarteira, loading: carteiraLoading } = useCarteira(userId)
  const { transacoes: transacoesSupabase } = useTransacoes(userId)
  const { solicitacoes } = useSolicitacoes(userId)

  const carteiraId = carteira?.id ? String(carteira.id) : userId

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0)
    }
  }, [paginaAtual])

  const saldoX88 = carteira ? parseFloat(carteira.saldo) : 0
  const creditoDisponivel = cliente?.credito_disponivel_x88 || 0
  const taxaConversao = 1.0
  
  const [dadosBancarios, setDadosBancarios] = useState({
    iban: cliente?.dados_bancarios?.iban || '',
    titular: cliente?.nome || '',
    banco: cliente?.dados_bancarios?.banco || '',
    nib: '',
    mbWay: cliente?.dados_bancarios?.mbway || ''
  })

  useEffect(() => {
    if (cliente) {
      setDadosBancarios({
        iban: cliente.dados_bancarios?.iban || '',
        titular: cliente.nome || '',
        banco: cliente.dados_bancarios?.banco || '',
        nib: '',
        mbWay: cliente.dados_bancarios?.mbway || ''
      })
    }
  }, [cliente])

  // Mostrar loading enquanto carrega dados essenciais
  if (clienteLoading || carteiraLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <img 
            src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" 
            alt="X88"
            className="w-20 h-20 mx-auto mb-4 animate-pulse"
          />
          <p className="text-neutral-500 dark:text-neutral-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const handleSalvarDadosBancarios = (dados: typeof dadosBancarios) => {
    setDadosBancarios(dados)
    if (paginaAnterior === 'sacar') {
      setPaginaAtual('sacar')
      setPaginaAnterior(null)
    }
  }
  
  const transacoes: Transacao[] = transacoesSupabase.map(t => ({
    id: t.id,
    tipo: t.tipo === 'credito' ? 'recebido' as const : 
          t.tipo === 'debito' ? 'transferencia' as const :
          t.categoria === 'transferencia' ? 'transferencia' as const : 
          t.tipo === 'credito' ? 'x88' as const : 'saque' as const,
    valor: typeof t.valor === 'string' ? parseFloat(t.valor) : t.valor,
    data: t.data || (t.criado_em ? new Date(t.criado_em).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
    status: 'aprovado' as const,
    contraparte_nome: t.contraparte_nome,
    contraparte_carteira_id: t.contraparte_carteira_id
  }))

  const solicitacoesPendentes = solicitacoes.filter(s => s.status === 'pendente')

  const handleSolicitarX88 = async (valorX88: number) => {
    if (!cliente) return
    
    await criarSolicitacao(
      cliente.id,
      cliente.nome,
      'x88',
      'x88',
      valorX88,
      1,
      'Solicitação de X88',
      'Solicitação de crédito X88'
    )
    
    setPaginaAtual('inicio')
  }

  const handleSolicitarCredito = async (
    valor: number, 
    motivo: string,
    parcelas: number, 
    periodo: number
  ) => {
    if (!cliente) return

    await criarSolicitacao(
      cliente.id,
      cliente.nome,
      'emprestimo',
      'euro',
      valor,
      parcelas,
      `Empréstimo - ${motivo}`,
      `Motivo: ${motivo}, Parcelas: ${parcelas}, Período: ${periodo} dias`
    )
    
    setPaginaAtual('inicio')
  }

  const handleTransferenciaX88 = async (destinatarioId: string, valor: number, destinatarioNome?: string, onSuccess?: (dados: any) => void) => {
    if (!cliente) return

    const result = await transferirX88(cliente.id, destinatarioId, valor)
    
    if (result.success) {
      await atualizarCarteira()
      onSuccess?.({})
    } else {
      alert(`Erro: ${result.error || 'Não foi possível realizar a transferência'}`)
    }
  }

  const handlePagarParcela = async (_emprestimoId: string) => {
    // Implementar lógica de pagamento de parcela via Supabase
  }

  const transacoesPendentes = solicitacoesPendentes.length
  const saldoEmEuros = saldoX88 * taxaConversao
  const dadosBancariosCompletos = !!(dadosBancarios.iban && dadosBancarios.titular && dadosBancarios.banco)

  const renderPagina = () => {
    switch (paginaAtual) {
      case 'inicio':
        return (
          <HomePage
            saldoX88={saldoX88}
            saldoEmEuros={saldoEmEuros}
            creditoDisponivel={creditoDisponivel}
            transacoesPendentes={transacoesPendentes}
            transacoes={transacoes}
            onNavigate={setPaginaAtual}
            userId={carteiraId}
            clienteId={userId}
            nomeUsuario={cliente?.nome_completo || cliente?.nome || dadosUsuario?.nome || 'Usuário'}
            onModalChange={setModalAberto}
            onTransferir={handleTransferenciaX88}
          />
        )
      case 'sacar':
        return (
          <SacarPage
            saldoDisponivel={saldoX88}
            creditoDisponivel={creditoDisponivel}
            taxaConversao={taxaConversao}
            onSubmit={handleSolicitarX88}
            userId={carteiraId}
            dadosBancariosCompletos={dadosBancariosCompletos}
            onNavigate={(pagina) => {
              setPaginaAnterior('sacar')
              setPaginaAtual(pagina)
            }}
          />
        )
      case 'credito':
        return (
          <CreditoPage
            creditoDisponivel={creditoDisponivel}
            saldoX88={saldoX88}
            onSubmit={handleSolicitarCredito}
            transacoes={transacoes}
            onPagarParcela={handlePagarParcela}
            dadosBancariosCompletos={dadosBancariosCompletos}
            onNavigate={(pagina) => {
              setPaginaAnterior('credito')
              setPaginaAtual(pagina)
            }}
          />
        )
      case 'depositar':
        setPaginaAtual('inicio')
        return null
      case 'historico':
        return <HistoricoPage transacoes={transacoes} />
      case 'perfil':
        return <PerfilPage 
          onLogout={onLogout} 
          dadosUsuario={cliente ? {
            nome: cliente.nome,
            email: cliente.email,
            telefone: cliente.telefone || '',
            morada: (cliente.endereco as any)?.morada || '',
            codigoPostal: (cliente.endereco as any)?.codigoPostal || '',
            cidade: (cliente.endereco as any)?.cidade || '',
            distrito: (cliente.endereco as any)?.distrito || ''
          } : dadosUsuario}
          userId={carteiraId}
          dadosBancarios={dadosBancarios}
          onSalvarDadosBancarios={handleSalvarDadosBancarios}
        />
      case 'transferir-x88':
        return (
          <TransferirX88Page
            saldoDisponivel={saldoX88}
            onSubmit={handleTransferenciaX88}
            userId={carteiraId}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-black">
      {/* Status Bar Spacer */}
      <div style={{ height: 'env(safe-area-inset-top)', backgroundColor: 'white' }} className="dark:bg-black" />
      
      {/* Main Content - Páginas Completas */}
      <main ref={mainRef} className="overflow-y-auto overscroll-none" style={{ 
        WebkitOverflowScrolling: 'touch',
        height: 'calc(100% - env(safe-area-inset-top))',
        paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))'
      }}>
        {renderPagina()}
      </main>

      {/* Bottom Navigation */}
      {!modalAberto && (
        <BottomNav 
          paginaAtual={paginaAtual}
          onNavigate={setPaginaAtual}
          scrollContainerRef={mainRef}
        />
      )}
    </div>
  )
}

export default Dashboard
