-- Tabela de Clientes para Cadastro do App
-- Execute este SQL no Supabase SQL Editor

-- 1. Remover constraint antiga se existir
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_origem_check;

-- 2. Verificar se tabela existe, se não, criar
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados Pessoais
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  
  -- Dados Profissionais (opcional)
  cargo VARCHAR(100),
  salario DECIMAL(10,2),
  data_contratacao DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'ativo',
  origem VARCHAR(50) DEFAULT 'web',
  
  -- Endereço (JSONB)
  endereco JSONB,
  
  -- Dados Bancários (JSONB - opcional)
  dados_bancarios JSONB,
  
  -- Documentos (JSONB - opcional)
  documentos JSONB,
  
  -- Mídia
  foto_perfil TEXT,
  
  -- Observações
  observacoes TEXT,
  
  -- Auditoria
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_origem ON clientes(origem);

-- 4. Adicionar constraint flexível para origem
ALTER TABLE clientes ADD CONSTRAINT clientes_origem_check 
  CHECK (origem IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema', 'api'));

-- 5. Adicionar constraint para status
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_status_check;
ALTER TABLE clientes ADD CONSTRAINT clientes_status_check 
  CHECK (status IN ('ativo', 'inativo', 'pendente', 'bloqueado'));

-- 6. Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_clientes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS clientes_updated ON clientes;
CREATE TRIGGER clientes_updated
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_clientes_timestamp();

-- 7. Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- 8. Comentários
COMMENT ON TABLE clientes IS 'Tabela de clientes/colaboradores do sistema';
COMMENT ON COLUMN clientes.endereco IS 'JSON com morada, codigo_postal, cidade, distrito';
COMMENT ON COLUMN clientes.dados_bancarios IS 'JSON com iban, banco, titular';
COMMENT ON COLUMN clientes.documentos IS 'JSON com cc, nif, niss, etc';

-- ✅ Pronto! Agora a tabela aceita cadastros do app
