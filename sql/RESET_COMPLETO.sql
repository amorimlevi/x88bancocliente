-- ================================================================
-- RESET COMPLETO: Limpar dados de teste e configurar autenticação
-- ⚠️ ATENÇÃO: Este SQL deleta TODOS os dados de clientes e carteiras
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. DESABILITAR RLS TEMPORARIAMENTE
-- ====================

ALTER TABLE carteira_x88 DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;

-- ====================
-- 2. LIMPAR TUDO
-- ====================

-- Deletar todas as carteiras
TRUNCATE TABLE carteira_x88 CASCADE;

-- Deletar todos os clientes
TRUNCATE TABLE clientes CASCADE;

-- ====================
-- 3. REABILITAR RLS
-- ====================

ALTER TABLE carteira_x88 ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- ====================
-- 4. GARANTIR UNIQUE CONSTRAINT
-- ====================

ALTER TABLE carteira_x88 DROP CONSTRAINT IF EXISTS carteira_x88_cliente_id_key;
ALTER TABLE carteira_x88 ADD CONSTRAINT carteira_x88_cliente_id_key UNIQUE (cliente_id);

-- ====================
-- 5. CORRIGIR TRIGGERS
-- ====================

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
  )
  ON CONFLICT (auth_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar cliente: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION criar_cliente_apos_signup();

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
  )
  ON CONFLICT (cliente_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar carteira: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NÃO criar o trigger ainda - vamos criar depois dos dados

-- ====================
-- 6. CRIAR CLIENTES A PARTIR DOS USUÁRIOS DO AUTH
-- ====================

INSERT INTO public.clientes (auth_id, email, nome, status, origem, ativo)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'nome', ''),
  'ativo',
  'web',
  true
FROM auth.users u;

-- ====================
-- 6.5. CRIAR CARTEIRAS MANUALMENTE
-- ====================

INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
SELECT 
  id,
  0.00,
  0.00,
  0.00,
  0.00
FROM clientes;

-- ====================
-- 6.6. AGORA SIM CRIAR O TRIGGER DE CARTEIRA
-- ====================

DROP TRIGGER IF EXISTS criar_carteira_trigger ON clientes;
CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION criar_carteira_apos_cliente();

-- ====================
-- 7. VERIFICAÇÃO
-- ====================

SELECT 
  'Usuários no Auth' as tipo, 
  COUNT(*) as total 
FROM auth.users

UNION ALL

SELECT 
  'Clientes criados', 
  COUNT(*) 
FROM clientes

UNION ALL

SELECT 
  'Carteiras criadas', 
  COUNT(*) 
FROM carteira_x88

UNION ALL

SELECT 
  'Usuários SEM cliente', 
  COUNT(*) 
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM clientes c WHERE c.auth_id = u.id)

UNION ALL

SELECT 
  'Clientes SEM carteira', 
  COUNT(*) 
FROM clientes c
WHERE NOT EXISTS (SELECT 1 FROM carteira_x88 w WHERE w.cliente_id = c.id);
