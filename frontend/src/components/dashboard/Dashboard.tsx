import { useState, useEffect } from 'react'
import BottomNav from './BottomNav'
import HomePage from '../pages/HomePage'
import SacarPage from '../pages/SacarPage'
import CreditoPage from '../pages/CreditoPage'
import HistoricoPage from '../pages/HistoricoPage'
import PerfilPage from '../pages/PerfilPage'
import TransferirX88Page from '../pages/TransferirX88Page'
import { DadosUsuario } from '../auth/Cadastro'

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

const Dashboard = ({ onLogout, dadosUsuario, userId = '0001', saldoInicial, creditoInicial, isNewAccount = false }: DashboardProps) => {
  const [paginaAtual, setPaginaAtual] = useState('inicio')
  const [paginaAnterior, setPaginaAnterior] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [paginaAtual])


  
  // Dados do usuário - se for nova conta, começa zerado
  const [saldoX88, setSaldoX88] = useState(saldoInicial ?? 5000)
  const [creditoDisponivel] = useState(creditoInicial ?? 3450)
  const taxaConversao = 1.0 // 1 X88 = 1 €
  
  const [dadosBancarios, setDadosBancarios] = useState({
    iban: '',
    titular: '',
    banco: '',
    nib: '',
    mbWay: ''
  })

  const handleSalvarDadosBancarios = (dados: typeof dadosBancarios) => {
    setDadosBancarios(dados)
    if (paginaAnterior === 'sacar') {
      setPaginaAtual('sacar')
      setPaginaAnterior(null)
    }
  }
  
  // Transações - se for nova conta, começa vazio
  const transacoesDefault = [
    {
      id: '1',
      tipo: 'saque' as const,
      valor: 200,
      valorEuro: 200,
      telefone: '+351 912 345 678',
      data: '2025-09-28',
      status: 'aprovado' as const
    },
    {
      id: '2',
      tipo: 'x88' as const,
      valor: 1250,
      data: '2025-10-02',
      status: 'aprovado' as const
    },
    {
      id: '3',
      tipo: 'credito' as const,
      valor: 2750,
      motivo: 'Investimento',
      data: '2025-10-02',
      status: 'aprovado' as const,
      parcelas: 5,
      periodo: 30,
      valorTotal: 3245,
      valorParcela: 649,
      juros: 18,
      parcelasPagas: 0
    },
    {
      id: '4',
      tipo: 'credito' as const,
      valor: 1000,
      motivo: 'Emergência médica',
      data: '2025-10-02',
      status: 'aprovado' as const,
      parcelas: 3,
      periodo: 30,
      valorTotal: 1180,
      valorParcela: 393.33,
      juros: 18,
      parcelasPagas: 0
    }
  ]

  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  // Atualiza transações baseado em isNewAccount
  useEffect(() => {
    console.log('isNewAccount:', isNewAccount)
    if (isNewAccount) {
      console.log('Limpando transações para nova conta')
      setTransacoes([])
    } else {
      console.log('Carregando transações padrão')
      setTransacoes(transacoesDefault)
    }
  }, [isNewAccount])

  // Monitora aprovação de empréstimos e solicitações X88
  useEffect(() => {
    transacoes.forEach(transacao => {
      const jaProcessado = localStorage.getItem(`transacao-${transacao.id}`)
      if (!jaProcessado && transacao.status === 'aprovado') {
        if (transacao.tipo === 'credito') {
          // Empréstimo aprovado: diminui do saldo (é uma dívida)
          setSaldoX88(prev => prev - transacao.valor)
          localStorage.setItem(`transacao-${transacao.id}`, 'processado')
        } else if (transacao.tipo === 'x88') {
          // Solicitação X88 aprovada: aumenta o saldo
          setSaldoX88(prev => prev + transacao.valor)
          localStorage.setItem(`transacao-${transacao.id}`, 'processado')
        }
      }
    })
  }, [transacoes])

  const handleSaque = (valorX88: number, telefone: string) => {
    const valorEuro = valorX88 * taxaConversao
    const novaTransacao: Transacao = {
      id: Date.now().toString(),
      tipo: 'saque',
      valor: valorX88,
      valorEuro,
      telefone,
      data: new Date().toISOString().split('T')[0],
      status: 'pendente'
    }
    setTransacoes([novaTransacao, ...transacoes])
    setPaginaAtual('inicio')
  }

  const handleSolicitarX88 = (valorX88: number) => {
    const novaTransacao: Transacao = {
      id: Date.now().toString(),
      tipo: 'x88',
      valor: valorX88,
      data: new Date().toISOString().split('T')[0],
      status: 'pendente'
    }
    setTransacoes([novaTransacao, ...transacoes])
    setPaginaAtual('inicio')
  }

  const handleSolicitarCredito = (
    valor: number, 
    motivo: string,
    parcelas: number, 
    periodo: number, 
    valorTotal: number, 
    valorParcela: number
  ) => {
    const jurosPercentual = ((valorTotal - valor) / valor) * 100
    const novaTransacao: Transacao = {
      id: Date.now().toString(),
      tipo: 'credito',
      valor,
      data: new Date().toISOString().split('T')[0],
      status: 'pendente',
      parcelas,
      periodo,
      valorTotal,
      valorParcela,
      juros: jurosPercentual
    }
    setTransacoes([novaTransacao, ...transacoes])
    setPaginaAtual('inicio')
  }

  const handleTransferencia = (destinatario: string, valor: number) => {
    const novaTransacao: Transacao = {
      id: Date.now().toString(),
      tipo: 'saque',
      valor,
      telefone: `ID: ${destinatario}`,
      data: new Date().toISOString().split('T')[0],
      status: 'pendente'
    }
    setTransacoes([novaTransacao, ...transacoes])
    setPaginaAtual('inicio')
  }

  const handleTransferenciaX88 = (destinatarioId: string, valor: number, destinatarioNome?: string) => {
    const novaTransacao: Transacao = {
      id: Date.now().toString(),
      tipo: 'transferencia',
      valor,
      telefone: `ID: ${destinatarioId}`,
      data: new Date().toISOString().split('T')[0],
      status: 'aprovado',
      destinatarioId,
      destinatarioNome
    }
    setTransacoes([novaTransacao, ...transacoes])
    setSaldoX88(saldoX88 - valor)
    setPaginaAtual('inicio')
  }

  const handlePagarParcela = (emprestimoId: string) => {
    setTransacoes(transacoes.map(t => {
      if (t.id === emprestimoId && t.tipo === 'credito') {
        const novasParcelasPagas = (t.parcelasPagas || 0) + 1
        return { ...t, parcelasPagas: novasParcelasPagas }
      }
      return t
    }))
  }

  const transacoesPendentes = transacoes.filter(t => t.status === 'pendente').length
  const saldoEmEuros = saldoX88 * taxaConversao

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
          />
        )
      case 'sacar':
        const dadosBancariosCompletos = !!(dadosBancarios.iban && dadosBancarios.titular && dadosBancarios.banco)
        return (
          <SacarPage
            saldoDisponivel={saldoX88}
            creditoDisponivel={creditoDisponivel}
            taxaConversao={taxaConversao}
            onSubmit={handleSolicitarX88}
            userId={userId}
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
          dadosUsuario={dadosUsuario}
          userId={userId}
          dadosBancarios={dadosBancarios}
          onSalvarDadosBancarios={handleSalvarDadosBancarios}
        />
      case 'transferir-x88':
        return (
          <TransferirX88Page
            saldoDisponivel={saldoX88}
            onSubmit={handleTransferenciaX88}
            userId={userId}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black">
      {/* Main Content - Páginas Completas */}
      <main className="flex-1 overflow-y-auto overscroll-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        {renderPagina()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        paginaAtual={paginaAtual}
        onNavigate={setPaginaAtual}
      />
    </div>
  )
}

export default Dashboard
