import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    })
  : null as any

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase não configurado. Crie um arquivo .env com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  cargo: string
  salario: string
  data_contratacao: string
  status: string
  origem: string
  endereco: {
    rua: string
    numero: string
    cidade: string
    codigoPostal: string
    pais: string
  }
  dados_bancarios: {
    iban: string
    banco: string
    mbway: string
  }
  documentos: {
    cc: string
    nif: string
    cartaConducao: string
  }
  observacoes?: string
  foto_perfil?: string
  criado_em: string
  atualizado_em: string
}

export interface CarteiraX88 {
  id: string
  cliente_id: string
  saldo: string
  saldo_bloqueado: string
  total_recebido: string
  total_gasto: string
  criado_em: string
  atualizado_em: string
}

export interface TransacaoX88 {
  id: string
  cliente_id: string
  tipo: 'credito' | 'debito'
  valor: string
  saldo_anterior: string
  saldo_novo: string
  descricao: string
  categoria: string
  referencia_id?: string
  realizado_por?: string
  criado_em: string
}

export interface Solicitacao {
  id: string
  cliente_id: string
  cliente_nome: string
  tipo: 'adiantamento' | 'emprestimo' | 'reembolso' | 'x88'
  tipo_moeda: 'euro' | 'x88'
  valor: string
  parcelas: string
  descricao: string
  justificativa: string
  data_solicitacao: string
  data_vencimento: string
  status: 'pendente' | 'aprovado' | 'negado' | 'pago'
  prioridade: 'baixa' | 'media' | 'alta'
  documentos?: any
  observacoes?: string
  aprovado_por?: string
  data_aprovacao?: string
  motivo_negacao?: string
  criado_em: string
  atualizado_em: string
}
