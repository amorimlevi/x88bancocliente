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
    console.log('🔍 Buscando usuário com ID de carteira:', idCarteira)
    
    // Buscar em carteira_x88 (clientes)
    const { data: carteiraCliente, error: errCliente } = await supabase
      .from('carteira_x88')
      .select('id, cliente_id, clientes(id, nome, email, dados_bancarios)')
      .eq('id', parseInt(idCarteira))
      .maybeSingle()

    console.log('📊 Resultado carteira_x88:', { data: carteiraCliente, error: errCliente })

    if (carteiraCliente && carteiraCliente.clientes) {
      console.log('✅ Cliente encontrado:', carteiraCliente.clientes.nome)
      return res.json({
        success: true,
        usuario: {
          id: String(carteiraCliente.id),
          nome: carteiraCliente.clientes.nome,
          email: carteiraCliente.clientes.email,
          tipo: 'cliente'
        }
      })
    }

    // Buscar em carteira_x88_gestor (gestores)
    const { data: carteiraGestor, error: errGestor } = await supabase
      .from('carteira_x88_gestor')
      .select('id, gestor_id, gestores(id, nome_completo, email)')
      .eq('id', parseInt(idCarteira))
      .maybeSingle()

    console.log('📊 Resultado carteira_x88_gestor:', { data: carteiraGestor, error: errGestor })

    if (carteiraGestor && carteiraGestor.gestores) {
      console.log('✅ Gestor encontrado:', carteiraGestor.gestores.nome_completo)
      return res.json({
        success: true,
        usuario: {
          id: String(carteiraGestor.id),
          nome: carteiraGestor.gestores.nome_completo,
          email: carteiraGestor.gestores.email,
          tipo: 'gestor'
        }
      })
    }

    console.log('❌ Usuário não encontrado para ID:', idCarteira)
    return res.json({
      success: false,
      message: 'Usuário não encontrado'
    })
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error)
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário',
      error: error.message
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
