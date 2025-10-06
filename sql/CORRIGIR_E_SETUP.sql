-- ================================================================
-- CORRIGIR DADOS EXISTENTES E SETUP COMPLETO
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. EXTENSÕES
-- ====================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ====================
-- 2. CORRIGIR DADOS EXISTENTES
-- ====================

-- Atualizar valores de origem inválidos para 'web'
UPDATE clientes 
SET origem = 'web' 
WHERE origem NOT IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema', 'api')
   OR origem IS NULL;

-- Atualizar valores de status inválidos
UPDATE clientes 
SET status = 'ativo' 
WHERE status NOT IN ('ativo', 'inativo', 'pendente', 'bloqueado')
   OR status IS NULL;

-- ====================
-- 3. REMOVER CONSTRAINTS ANTIGAS
-- ====================

ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_origem_check;
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_status_check;

-- ====================
-- 4. ADICIONAR NOVAS CONSTRAINTS
-- ====================

ALTER TABLE clientes ADD CONSTRAINT clientes_origem_check 
  CHECK (origem IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema', 'api'));

ALTER TABLE clientes ADD CONSTRAINT clientes_status_check 
  CHECK (status IN ('ativo', 'inativo', 'pendente', 'bloqueado'));

-- ====================
-- 5. TABELA ACESSO_CLIENTE
-- ====================

CREATE TABLE IF NOT EXISTS acesso_cliente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  pin_acesso VARCHAR(6),
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  ip_ultimo_acesso VARCHAR(45),
  dispositivo_info JSONB,
  tentativas_falhas INTEGER DEFAULT 0,
  bloqueado_ate TIMESTAMP WITH TIME ZONE,
  token_recuperacao TEXT,
  token_expira_em TIMESTAMP WITH TIME ZONE,
  ativo BOOLEAN DEFAULT true,
  primeiro_acesso BOOLEAN DEFAULT true,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_acesso_cliente_email ON acesso_cliente(email);
CREATE INDEX IF NOT EXISTS idx_acesso_cliente_cliente_id ON acesso_cliente(cliente_id);
CREATE INDEX IF NOT EXISTS idx_acesso_cliente_ativo ON acesso_cliente(ativo);

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

-- Índice
CREATE INDEX IF NOT EXISTS idx_carteira_cliente ON carteira_x88(cliente_id);

-- ====================
-- 7. FUNÇÕES DE HASH
-- ====================

CREATE OR REPLACE FUNCTION criar_hash_senha(p_senha TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(p_senha, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verificar_senha(p_senha TEXT, p_senha_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_senha_hash = crypt(p_senha, p_senha_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- 8. TRIGGERS
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

-- Trigger acesso_cliente
CREATE OR REPLACE FUNCTION update_acesso_cliente_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS acesso_cliente_updated ON acesso_cliente;
CREATE TRIGGER acesso_cliente_updated
  BEFORE UPDATE ON acesso_cliente
  FOR EACH ROW
  EXECUTE FUNCTION update_acesso_cliente_timestamp();

-- Trigger carteira_x88
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
-- 9. ROW LEVEL SECURITY (RLS)
-- ====================

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acesso_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE carteira_x88 ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "Permitir insert público" ON clientes;
DROP POLICY IF EXISTS "Permitir select público" ON clientes;
DROP POLICY IF EXISTS "Permitir update público" ON clientes;
DROP POLICY IF EXISTS "Permitir insert de acesso" ON acesso_cliente;
DROP POLICY IF EXISTS "Permitir select de acesso" ON acesso_cliente;
DROP POLICY IF EXISTS "Permitir update de acesso" ON acesso_cliente;
DROP POLICY IF EXISTS "Permitir insert carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Permitir select carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Permitir update carteira" ON carteira_x88;

-- Políticas clientes
CREATE POLICY "Permitir insert público" ON clientes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir select público" ON clientes
  FOR SELECT USING (true);

CREATE POLICY "Permitir update público" ON clientes
  FOR UPDATE USING (true);

-- Políticas acesso_cliente
CREATE POLICY "Permitir insert de acesso" ON acesso_cliente
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir select de acesso" ON acesso_cliente
  FOR SELECT USING (true);

CREATE POLICY "Permitir update de acesso" ON acesso_cliente
  FOR UPDATE USING (true);

-- Políticas carteira_x88
CREATE POLICY "Permitir insert carteira" ON carteira_x88
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir select carteira" ON carteira_x88
  FOR SELECT USING (true);

CREATE POLICY "Permitir update carteira" ON carteira_x88
  FOR UPDATE USING (true);

-- ====================
-- 10. PERMISSÕES
-- ====================

GRANT EXECUTE ON FUNCTION criar_hash_senha(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verificar_senha(TEXT, TEXT) TO anon, authenticated;

-- ====================
-- 11. ÍNDICES CLIENTES (se não existem)
-- ====================

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_origem ON clientes(origem);

-- ================================================================
-- ✅ SETUP COMPLETO FINALIZADO!
-- Os dados antigos foram corrigidos
-- Agora você pode criar contas no aplicativo
-- ================================================================

-- Verificação:
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'acesso_cliente', COUNT(*) FROM acesso_cliente
UNION ALL
SELECT 'carteira_x88', COUNT(*) FROM carteira_x88;
