-- ================================================================
-- FIX FINAL: Limpar e recriar sistema de autenticação
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. REMOVER CONSTRAINT UNIQUE TEMPORARIAMENTE
-- ====================

ALTER TABLE carteira_x88 DROP CONSTRAINT IF EXISTS carteira_x88_cliente_id_key;

-- ====================
-- 2. LIMPAR DADOS DUPLICADOS
-- ====================

-- Deletar carteiras duplicadas (manter a mais antiga)
DELETE FROM carteira_x88 a
USING carteira_x88 b
WHERE a.cliente_id = b.cliente_id 
  AND a.criado_em > b.criado_em;

-- Deletar clientes sem auth_id
DELETE FROM clientes WHERE auth_id IS NULL;

-- ====================
-- 3. RECRIAR UNIQUE CONSTRAINT
-- ====================

ALTER TABLE carteira_x88 ADD CONSTRAINT carteira_x88_cliente_id_key UNIQUE (cliente_id);

-- ====================
-- 4. CORRIGIR TRIGGERS
-- ====================

-- Trigger de cliente
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

-- Trigger de carteira
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
-- 5. CRIAR CLIENTES FALTANTES
-- ====================

INSERT INTO public.clientes (auth_id, email, nome, status, origem, ativo)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'nome', ''),
  'ativo',
  'web',
  true
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM clientes c WHERE c.auth_id = u.id
);

-- ====================
-- 6. CRIAR CARTEIRAS FALTANTES
-- ====================

INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
SELECT 
  c.id,
  0.00,
  0.00,
  0.00,
  0.00
FROM clientes c
WHERE NOT EXISTS (
  SELECT 1 FROM carteira_x88 w WHERE w.cliente_id = c.id
);

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
