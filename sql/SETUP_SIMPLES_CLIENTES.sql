-- ================================================================
-- SETUP SIMPLES - AUTENTICAÇÃO NA TABELA CLIENTES
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. EXTENSÃO PARA HASH
-- ====================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ====================
-- 2. ADICIONAR COLUNAS DE AUTENTICAÇÃO NA TABELA CLIENTES
-- ====================

-- Adicionar coluna de senha (se não existir)
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS senha_hash TEXT;

-- Adicionar colunas de segurança
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tentativas_falhas INTEGER DEFAULT 0;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS bloqueado_ate TIMESTAMP WITH TIME ZONE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP WITH TIME ZONE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- ====================
-- 3. CORRIGIR DADOS EXISTENTES
-- ====================

-- Atualizar origem inválida
UPDATE clientes 
SET origem = 'web' 
WHERE origem NOT IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema', 'api')
   OR origem IS NULL;

-- Atualizar status inválido
UPDATE clientes 
SET status = 'ativo' 
WHERE status NOT IN ('ativo', 'inativo', 'pendente', 'bloqueado')
   OR status IS NULL;

-- Atualizar campo ativo
UPDATE clientes 
SET ativo = true 
WHERE ativo IS NULL;

-- ====================
-- 4. REMOVER E ADICIONAR CONSTRAINTS
-- ====================

ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_origem_check;
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_status_check;

ALTER TABLE clientes ADD CONSTRAINT clientes_origem_check 
  CHECK (origem IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema', 'api'));

ALTER TABLE clientes ADD CONSTRAINT clientes_status_check 
  CHECK (status IN ('ativo', 'inativo', 'pendente', 'bloqueado'));

-- ====================
-- 5. FUNÇÕES DE AUTENTICAÇÃO
-- ====================

-- Função para criar hash de senha
CREATE OR REPLACE FUNCTION criar_hash_senha(p_senha TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(p_senha, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION verificar_senha(p_senha TEXT, p_senha_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_senha_hash = crypt(p_senha, p_senha_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- 6. TABELA CARTEIRA_X88
-- ====================

CREATE TABLE IF NOT EXISTS carteira_x88 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  saldo DECIMAL(10,2) DEFAULT 0.00,
  saldo_bloqueado DECIMAL(10,2) DEFAULT 0.00,
  total_recebido DECIMAL(10,2) DEFAULT 0.00,
  total_gasto DECIMAL(10,2) DEFAULT 0.00,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carteira_cliente ON carteira_x88(cliente_id);

-- ====================
-- 7. TRIGGERS
-- ====================

-- Trigger clientes
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

-- Trigger carteira
CREATE OR REPLACE FUNCTION update_carteira_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS carteira_updated ON carteira_x88;
CREATE TRIGGER carteira_updated
  BEFORE UPDATE ON carteira_x88
  FOR EACH ROW
  EXECUTE FUNCTION update_carteira_timestamp();

-- ====================
-- 8. ROW LEVEL SECURITY
-- ====================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE carteira_x88 ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir insert público" ON clientes;
DROP POLICY IF EXISTS "Permitir select público" ON clientes;
DROP POLICY IF EXISTS "Permitir update público" ON clientes;
DROP POLICY IF EXISTS "Permitir insert carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Permitir select carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Permitir update carteira" ON carteira_x88;

-- Criar políticas públicas (simplificado)
CREATE POLICY "Permitir insert público" ON clientes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir select público" ON clientes
  FOR SELECT USING (true);

CREATE POLICY "Permitir update público" ON clientes
  FOR UPDATE USING (true);

CREATE POLICY "Permitir insert carteira" ON carteira_x88
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir select carteira" ON carteira_x88
  FOR SELECT USING (true);

CREATE POLICY "Permitir update carteira" ON carteira_x88
  FOR UPDATE USING (true);

-- ====================
-- 9. PERMISSÕES
-- ====================

GRANT EXECUTE ON FUNCTION criar_hash_senha(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verificar_senha(TEXT, TEXT) TO anon, authenticated;

-- ====================
-- 10. ÍNDICES
-- ====================

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes(ativo);

-- ================================================================
-- ✅ SETUP COMPLETO!
-- Agora use apenas a tabela CLIENTES para autenticação
-- ================================================================

-- Verificação:
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'carteira_x88', COUNT(*) FROM carteira_x88;
