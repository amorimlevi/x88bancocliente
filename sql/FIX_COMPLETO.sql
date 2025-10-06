-- ================================================================
-- FIX COMPLETO: Limpar dados duplicados e corrigir triggers
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. LIMPAR CARTEIRAS DUPLICADAS (manter apenas a primeira)
-- ====================

-- Deletar carteiras duplicadas, mantendo apenas a primeira de cada cliente
DELETE FROM carteira_x88
WHERE id IN (
  SELECT c2.id
  FROM carteira_x88 c1
  JOIN carteira_x88 c2 ON c1.cliente_id = c2.cliente_id AND c1.id < c2.id
);

-- ====================
-- 2. GARANTIR UNIQUE INDEX NA CARTEIRA
-- ====================

-- Criar índice único se não existir
CREATE UNIQUE INDEX IF NOT EXISTS carteira_x88_cliente_id_key 
ON carteira_x88(cliente_id);

-- ====================
-- 3. CORRIGIR TRIGGER DE CLIENTE
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

-- ====================
-- 4. CORRIGIR TRIGGER DE CARTEIRA
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
  )
  ON CONFLICT (cliente_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar carteira: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS criar_carteira_trigger ON clientes;
CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION criar_carteira_apos_cliente();

-- ====================
-- 5. CRIAR CLIENTES PARA USUÁRIOS SEM CLIENTE
-- ====================

INSERT INTO public.clientes (auth_id, email, nome, status, origem, ativo)
SELECT 
  u.id as auth_id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'nome', '') as nome,
  'ativo' as status,
  'web' as origem,
  true as ativo
FROM auth.users u
LEFT JOIN public.clientes c ON c.auth_id = u.id
WHERE c.id IS NULL;

-- ====================
-- 6. RECRIAR TODAS AS CARTEIRAS
-- ====================

-- Deletar todas as carteiras
TRUNCATE TABLE carteira_x88;

-- Criar uma carteira para cada cliente
INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
SELECT 
  c.id as cliente_id,
  0.00 as saldo,
  0.00 as saldo_bloqueado,
  0.00 as total_recebido,
  0.00 as total_gasto
FROM clientes c;

-- ====================
-- 7. VERIFICAÇÃO FINAL
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
LEFT JOIN clientes c ON c.auth_id = u.id
WHERE c.id IS NULL

UNION ALL

SELECT 
  'Clientes SEM carteira', 
  COUNT(*) 
FROM clientes c
LEFT JOIN carteira_x88 w ON w.cliente_id = c.id
WHERE w.id IS NULL;
