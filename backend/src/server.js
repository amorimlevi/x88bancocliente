import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Configurar Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'X88 Colaborador API - Todas as funcionalidades migradas para Supabase',
    version: '2.0.0',
    status: 'running'
  })
})

// Endpoint para buscar usuário por ID da carteira
app.get('/api/usuario/:idCarteira', async (req, res) => {
  try {
    const { idCarteira } = req.params
    
    // Buscar em carteira_x88 (clientes)
    const { data: carteiraCliente, error: errCliente } = await supabase
      .from('carteira_x88')
      .select('id, cliente_id, clientes!inner(id, nome, email, dados_bancarios)')
      .eq('id', parseInt(idCarteira))
      .single()

    if (!errCliente && carteiraCliente) {
      return res.json({
        success: true,
        usuario: {
          id: carteiraCliente.cliente_id,
          nome: carteiraCliente.clientes.nome,
          email: carteiraCliente.clientes.email,
          dados_bancarios: carteiraCliente.clientes.dados_bancarios,
          tipo: 'cliente'
        }
      })
    }

    // Buscar em carteira_x88_gestor (gestores)
    const { data: carteiraGestor, error: errGestor } = await supabase
      .from('carteira_x88_gestor')
      .select('id, gestor_id, gestores!inner(id, nome_completo, email)')
      .eq('id', parseInt(idCarteira))
      .single()

    if (!errGestor && carteiraGestor) {
      return res.json({
        success: true,
        usuario: {
          id: carteiraGestor.gestor_id,
          nome: carteiraGestor.gestores.nome_completo,
          email: carteiraGestor.gestores.email,
          dados_bancarios: null,
          tipo: 'gestor'
        }
      })
    }

    return res.json({
      success: false,
      message: 'Usuário não encontrado'
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário'
    })
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📱 X88 Colaborador API - Supabase Integration`)
})
