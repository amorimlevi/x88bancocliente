-- ================================================================
-- FIX: Corrigir Trigger de Criação de Cliente
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. CORRIGIR FUNÇÃO DO TRIGGER DE CLIENTE
-- ====================

CREATE OR REPLACE FUNCTION criar_cliente_apos_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir cliente somente se não existir
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
    -- Log do erro mas não falhar o signup
    RAISE WARNING 'Erro ao criar cliente: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION criar_cliente_apos_signup();

-- ====================
-- 1.5. CORRIGIR FUNÇÃO DO TRIGGER DE CARTEIRA
-- ====================

CREATE OR REPLACE FUNCTION criar_carteira_apos_cliente()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir carteira somente se não existir
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
-- 2. CRIAR CLIENTES PARA USUÁRIOS EXISTENTES QUE NÃO TEM CLIENTE
-- ====================

-- Inserir clientes para todos os auth.users que não têm cliente
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
-- 3. VERIFICAÇÃO
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
  'Usuários SEM cliente', 
  COUNT(*) 
FROM auth.users u
LEFT JOIN clientes c ON c.auth_id = u.id
WHERE c.id IS NULL;
