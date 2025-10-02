import { useState } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'
import HomePage from '../pages/HomePage'
import SacarPage from '../pages/SacarPage'
import CreditoPage from '../pages/CreditoPage'
import HistoricoPage from '../pages/HistoricoPage'

interface Transacao {
  id: string
  tipo: 'saque' | 'credito'
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
}

const Dashboard = () => {
  const [paginaAtual, setPaginaAtual] = useState('inicio')
  
  // Dados fictícios do usuário
  const [saldoX88, setSaldoX88] = useState(1250)
  const [creditoDisponivel] = useState(5000)
  const taxaConversao = 1.5 // 1 X88 = 1.5 €
  
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    {
      id: '1',
      tipo: 'saque',
      valor: 200,
      valorEuro: 200,
      telefone: '+351 912 345 678',
      data: '2025-09-28',
      status: 'aprovado'
    },
    {
      id: '2',
      tipo: 'credito',
      valor: 1000,
      motivo: 'Investimento em negócio',
      data: '2025-09-25',
      status: 'pendente',
      parcelas: 3,
      periodo: 30,
      valorTotal: 1180,
      valorParcela: 393.33,
      juros: 18
    },
    {
      id: '3',
      tipo: 'saque',
      valor: 100,
      valorEuro: 150,
      telefone: '+351 912 345 678',
      data: '2025-09-20',
      status: 'negado'
    }
  ])

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

  const handleSolicitarCredito = (
    valor: number, 
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
        return (
          <SacarPage
            saldoDisponivel={saldoX88}
            taxaConversao={taxaConversao}
            onSubmit={handleSaque}
          />
        )
      case 'credito':
        return (
          <CreditoPage
            creditoDisponivel={creditoDisponivel}
            onSubmit={handleSolicitarCredito}
          />
        )
      case 'depositar':
        return <DepositarPage onVoltar={() => setPaginaAtual('inicio')} />
      case 'historico':
        return <HistoricoPage transacoes={transacoes} />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      {/* Main Content - Páginas Completas */}
      <main className="flex-1 overflow-y-auto">
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
