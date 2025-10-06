-- ================================================================
-- SETUP COM SUPABASE AUTH (Sistema Nativo)
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. AJUSTAR TABELA CLIENTES PARA SUPABASE AUTH
-- ====================

-- Adicionar coluna auth_id para vincular com auth.users
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Tornar auth_id único
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_auth_id ON clientes(auth_id);

-- Remover colunas de autenticação customizada (não mais necessárias)
ALTER TABLE clientes DROP COLUMN IF EXISTS senha_hash;
ALTER TABLE clientes DROP COLUMN IF EXISTS tentativas_falhas;
ALTER TABLE clientes DROP COLUMN IF EXISTS bloqueado_ate;

-- Manter ultimo_acesso e ativo para controle
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP WITH TIME ZONE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- ====================
-- 2. CORRIGIR DADOS EXISTENTES
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
-- 3. CONSTRAINTS
-- ====================

ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_origem_check;
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_status_check;

ALTER TABLE clientes ADD CONSTRAINT clientes_origem_check 
  CHECK (origem IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema', 'api'));

ALTER TABLE clientes ADD CONSTRAINT clientes_status_check 
  CHECK (status IN ('ativo', 'inativo', 'pendente', 'bloqueado'));

-- ====================
-- 4. FUNÇÃO PARA CRIAR CLIENTE APÓS SIGNUP
-- ====================

-- Trigger que cria automaticamente um registro em clientes quando user é criado
CREATE OR REPLACE FUNCTION criar_cliente_apos_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.clientes (
    auth_id,
    email,
    nome,
    status,
    origem,
    ativo
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    'ativo',
    'web',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION criar_cliente_apos_signup();

-- ====================
-- 5. FUNÇÃO PARA CRIAR CARTEIRA APÓS CRIAR CLIENTE
-- ====================

CREATE OR REPLACE FUNCTION criar_carteira_apos_cliente()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.carteira_x88 (
    cliente_id,
    saldo,
    saldo_bloqueado,
    total_recebido,
    total_gasto
  ) VALUES (
    NEW.id,
    0.00,
    0.00,
    0.00,
    0.00
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS criar_carteira_trigger ON clientes;
CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION criar_carteira_apos_cliente();

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
-- 7. TRIGGERS DE TIMESTAMP
-- ====================

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
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios dados" ON clientes;
DROP POLICY IF EXISTS "Permitir insert carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Permitir select carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Permitir update carteira" ON carteira_x88;
DROP POLICY IF EXISTS "Usuários podem ver apenas sua carteira" ON carteira_x88;

-- Políticas para clientes (baseadas em auth.uid())
CREATE POLICY "Permitir insert durante signup" ON clientes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON clientes
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Usuários podem atualizar apenas seus dados" ON clientes
  FOR UPDATE USING (auth.uid() = auth_id);

-- Políticas para carteira (baseadas no auth_id do cliente)
CREATE POLICY "Permitir insert de carteira" ON carteira_x88
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem ver apenas sua carteira" ON carteira_x88
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clientes 
      WHERE clientes.id = carteira_x88.cliente_id 
      AND clientes.auth_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem atualizar apenas sua carteira" ON carteira_x88
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM clientes 
      WHERE clientes.id = carteira_x88.cliente_id 
      AND clientes.auth_id = auth.uid()
    )
  );

-- ====================
-- 9. ÍNDICES
-- ====================

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes(ativo);

-- ================================================================
-- ✅ SETUP COM SUPABASE AUTH COMPLETO!
-- Agora use supabase.auth.signUp() e supabase.auth.signInWithPassword()
-- Os usuários aparecerão em Authentication > Users
-- ================================================================

-- Verificação:
SELECT 'clientes' as tabela, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'carteira_x88', COUNT(*) FROM carteira_x88;
