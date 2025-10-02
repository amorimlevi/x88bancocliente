import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Armazena IDs de usuários já criados (em produção, usar banco de dados)
const usedUserIds = new Set()

// Armazena saldos dos usuários (em produção, usar banco de dados)
const saldosUsuarios = {
  '1': 1250,
  '2756': 0
}

// Armazena dados dos usuários (em produção, usar banco de dados)
const usuariosCadastrados = {
  '0001': { id: '0001', nome: 'João Silva', email: 'joao@x88.com' },
  '0002': { id: '0002', nome: 'Maria Santos', email: 'maria@x88.com' },
  '1234': { id: '1234', nome: 'Pedro Costa', email: 'pedro@x88.com' },
  '5678': { id: '5678', nome: 'Ana Oliveira', email: 'ana@x88.com' }
}

// Gera um ID único de 4 dígitos
const generateUniqueUserId = () => {
  let userId
  do {
    userId = Math.floor(1000 + Math.random() * 9000).toString()
  } while (usedUserIds.has(userId))
  
  usedUserIds.add(userId)
  return userId
}

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rotas básicas
app.get('/', (req, res) => {
  res.json({
    message: 'X88 Colaborador API',
    version: '1.0.0',
    status: 'running'
  })
})

// Rota de cadastro (mock)
app.post('/api/auth/cadastro', (req, res) => {
  const { nome, email, password } = req.body
  
  if (nome && email && password) {
    const userId = generateUniqueUserId()
    
    res.json({
      success: true,
      user: {
        id: userId,
        email,
        nome
      },
      token: `token-${userId}`,
      message: 'Conta criada com sucesso!'
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Nome, email e senha são obrigatórios'
    })
  }
})

// Rota de autenticação (mock)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  
  // Mock - substituir por autenticação real
  if (email && password) {
    res.json({
      success: true,
      user: {
        id: '1',
        email,
        nome: 'Colaborador Teste'
      },
      token: 'mock-token-123'
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    })
  }
})

// Rota de saldo (mock)
app.get('/api/saldo', (req, res) => {
  res.json({
    success: true,
    saldoX88: 1250,
    creditoDisponivel: 5000,
    taxaConversao: 1.5,
    saldoEuro: 1875
  })
})

// Buscar usuário por ID
app.get('/api/usuario/:id', (req, res) => {
  const { id } = req.params
  
  const usuario = usuariosCadastrados[id]
  
  if (usuario) {
    res.json({
      success: true,
      usuario
    })
  } else {
    res.status(404).json({
      success: false,
      message: 'Usuário não encontrado'
    })
  }
})

// Armazena transações de transferências (em produção, usar banco de dados)
const transferencias = []

// Armazena pagamentos pendentes de aprovação
const pagamentosPendentes = []

// Dados bancários do gestor
const dadosBancariosGestor = {
  nome: 'X88 Bank Gestor',
  banco: 'Banco Português',
  iban: 'PT50 0000 0000 0000 0000 0000 1',
  nib: '0000 0000 0000 0000 0000 01',
  swift: 'BPTPPTPL'
}

// Rota de transações (mock)
app.get('/api/transacoes', (req, res) => {
  const userId = req.query.userId || req.headers.authorization?.replace('Bearer ', '')
  
  const transacoesPadrao = [
    {
      id: '1',
      tipo: 'saque',
      valor: 200,
      valorEuro: 300,
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
      status: 'pendente'
    }
  ]
  
  // Adiciona transferências recebidas do usuário
  const transferenciasUsuario = transferencias
    .filter(t => t.destinatarioId === userId)
    .map(t => ({
      id: t.id,
      tipo: 'recebido',
      valor: t.valor,
      remetenteId: t.remetenteId,
      remetenteNome: t.remetenteNome,
      data: t.data,
      status: 'aprovado'
    }))
  
  const todasTransacoes = [...transacoesPadrao, ...transferenciasUsuario]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  
  res.json({
    success: true,
    transacoes: todasTransacoes
  })
})

// Saque via MBway (mock)
app.post('/api/saque-mbway', (req, res) => {
  const { valorX88, telefone } = req.body
  
  if (valorX88 && telefone) {
    const valorEuro = valorX88 * 1.5
    res.json({
      success: true,
      transacao: {
        id: Date.now().toString(),
        tipo: 'saque',
        valor: valorX88,
        valorEuro,
        telefone,
        data: new Date().toISOString().split('T')[0],
        status: 'pendente'
      },
      message: 'Saque solicitado com sucesso! Aguarde aprovação.'
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Valor e telefone são obrigatórios'
    })
  }
})

// Solicitar crédito (mock)
app.post('/api/solicitar-credito', (req, res) => {
  const { valor, motivo } = req.body
  
  if (valor && motivo) {
    res.json({
      success: true,
      transacao: {
        id: Date.now().toString(),
        tipo: 'credito',
        valor,
        motivo,
        data: new Date().toISOString().split('T')[0],
        status: 'pendente'
      },
      message: 'Solicitação de crédito enviada! Você será notificado da decisão.'
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Valor e motivo são obrigatórios'
    })
  }
})

// Solicitar X88 (compra de crédito)
app.post('/api/solicitar-x88', (req, res) => {
  const { valorX88 } = req.body
  
  if (valorX88) {
    res.json({
      success: true,
      transacao: {
        id: Date.now().toString(),
        tipo: 'x88',
        valor: valorX88,
        data: new Date().toISOString().split('T')[0],
        status: 'pendente'
      },
      message: 'Solicitação de X88 enviada! Aguarde aprovação.'
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Valor é obrigatório'
    })
  }
})

// Enviar x88 para outro usuário pelo ID
app.post('/api/enviar-x88', (req, res) => {
  const { destinatarioId, valor, remetenteId, remetenteNome } = req.body
  
  if (!destinatarioId || !valor || !remetenteId) {
    return res.status(400).json({
      success: false,
      message: 'ID do destinatário, valor e remetente são obrigatórios'
    })
  }

  if (valor <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valor deve ser maior que zero'
    })
  }

  const transferencia = {
    id: Date.now().toString(),
    remetenteId,
    remetenteNome: remetenteNome || 'Usuário',
    destinatarioId,
    valor,
    data: new Date().toISOString().split('T')[0],
    status: 'aprovado'
  }

  transferencias.push(transferencia)

  res.json({
    success: true,
    transferencia,
    message: `${valor} X88 enviado com sucesso para o usuário ${destinatarioId}!`
  })
})

// Buscar dados bancários do gestor
app.get('/api/dados-bancarios-gestor', (req, res) => {
  res.json({
    success: true,
    dadosBancarios: dadosBancariosGestor
  })
})

// Solicitar pagamento de parcela (cria um pagamento pendente)
app.post('/api/solicitar-pagamento-parcela', (req, res) => {
  const { emprestimoId, valorParcela, userId, userName } = req.body
  
  if (!emprestimoId || !valorParcela || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Dados incompletos'
    })
  }

  const pagamento = {
    id: Date.now().toString(),
    emprestimoId,
    valorParcela,
    userId,
    userName: userName || 'Usuário',
    data: new Date().toISOString(),
    status: 'pendente'
  }

  pagamentosPendentes.push(pagamento)

  res.json({
    success: true,
    pagamento,
    message: 'Pagamento solicitado. Aguardando aprovação do gestor.'
  })
})

// Listar pagamentos pendentes (para o gestor)
app.get('/api/pagamentos-pendentes', (req, res) => {
  res.json({
    success: true,
    pagamentos: pagamentosPendentes.filter(p => p.status === 'pendente')
  })
})

// Aprovar pagamento de parcela (gestor)
app.post('/api/aprovar-pagamento-parcela', (req, res) => {
  const { pagamentoId } = req.body
  
  if (!pagamentoId) {
    return res.status(400).json({
      success: false,
      message: 'ID do pagamento é obrigatório'
    })
  }

  const pagamento = pagamentosPendentes.find(p => p.id === pagamentoId)
  
  if (!pagamento) {
    return res.status(404).json({
      success: false,
      message: 'Pagamento não encontrado'
    })
  }

  pagamento.status = 'aprovado'
  pagamento.dataAprovacao = new Date().toISOString()

  res.json({
    success: true,
    pagamento,
    message: 'Pagamento aprovado com sucesso!'
  })
})

// Rejeitar pagamento de parcela (gestor)
app.post('/api/rejeitar-pagamento-parcela', (req, res) => {
  const { pagamentoId, motivo } = req.body
  
  if (!pagamentoId) {
    return res.status(400).json({
      success: false,
      message: 'ID do pagamento é obrigatório'
    })
  }

  const pagamento = pagamentosPendentes.find(p => p.id === pagamentoId)
  
  if (!pagamento) {
    return res.status(404).json({
      success: false,
      message: 'Pagamento não encontrado'
    })
  }

  pagamento.status = 'rejeitado'
  pagamento.dataRejeicao = new Date().toISOString()
  pagamento.motivoRejeicao = motivo

  res.json({
    success: true,
    pagamento,
    message: 'Pagamento rejeitado.'
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📱 X88 Colaborador API`)
})
