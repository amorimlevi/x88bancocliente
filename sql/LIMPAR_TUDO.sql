-- ================================================================
-- LIMPAR TUDO - Forçar reset completo
-- Execute TODO este SQL de uma vez no Supabase SQL Editor
-- ================================================================

-- ====================
-- 1. VER O QUE EXISTE AGORA
-- ====================

SELECT 'Clientes existentes' as info, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'Carteiras existentes', COUNT(*) FROM carteira_x88;

-- ====================
-- 2. DESABILITAR TUDO
-- ====================

ALTER TABLE carteira_x88 DROP CONSTRAINT IF EXISTS carteira_x88_cliente_id_key;
ALTER TABLE carteira_x88 DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;

-- Desabilitar triggers
DROP TRIGGER IF EXISTS criar_carteira_trigger ON clientes;
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;

-- ====================
-- 3. FORÇAR DELEÇÃO TOTAL
-- ====================

-- Deletar TODAS as carteiras sem exceção
DELETE FROM carteira_x88 WHERE true;

-- Deletar TODOS os clientes sem exceção  
DELETE FROM clientes WHERE true;

-- ====================
-- 4. VERIFICAR SE LIMPOU
-- ====================

SELECT 'Após limpeza - Clientes' as info, COUNT(*) as total FROM clientes
UNION ALL
SELECT 'Após limpeza - Carteiras', COUNT(*) FROM carteira_x88;

-- ====================
-- 5. RECRIAR FUNÇÕES
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
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Erro ao criar carteira: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================
-- 6. RECRIAR TRIGGERS
-- ====================

CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION criar_cliente_apos_signup();

CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION criar_carteira_apos_cliente();

-- ====================
-- 7. CRIAR CLIENTES DO AUTH
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
-- 8. VERIFICAR DUPLICATAS
-- ====================

SELECT 
  cliente_id, 
  COUNT(*) as quantidade
FROM carteira_x88
GROUP BY cliente_id
HAVING COUNT(*) > 1;

-- ====================
-- 9. SE HOUVER DUPLICATAS, DELETAR
-- ====================

DELETE FROM carteira_x88 a
USING carteira_x88 b
WHERE a.cliente_id = b.cliente_id 
  AND a.id > b.id;

-- ====================
-- 10. ADICIONAR CONSTRAINT
-- ====================

ALTER TABLE carteira_x88 ADD CONSTRAINT carteira_x88_cliente_id_key UNIQUE (cliente_id);

-- ====================
-- 11. REABILITAR RLS
-- ====================

ALTER TABLE carteira_x88 ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- ====================
-- 12. VERIFICAÇÃO FINAL
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
