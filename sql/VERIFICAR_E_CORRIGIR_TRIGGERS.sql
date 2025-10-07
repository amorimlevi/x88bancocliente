-- VERIFICAR E CORRIGIR TRIGGERS

-- 1. Verificar se os triggers existem
SELECT 
  t.tgname AS trigger_name,
  p.proname AS function_name,
  c.relname AS table_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relname IN ('users', 'clientes')
ORDER BY c.relname, t.tgname;

-- 2. Remover triggers antigos
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
DROP TRIGGER IF EXISTS criar_carteira_trigger ON public.clientes;

-- 3. Remover funções antigas
DROP FUNCTION IF EXISTS public.criar_cliente_apos_signup();
DROP FUNCTION IF EXISTS public.criar_carteira_apos_cliente();

-- 4. Criar função para criar cliente após signup
CREATE OR REPLACE FUNCTION public.criar_cliente_apos_signup()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Inserir cliente
  INSERT INTO public.clientes (
    auth_id, 
    email, 
    nome, 
    telefone, 
    cargo, 
    status, 
    ativo
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Novo Cliente'),
    COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
    'cliente',
    'ativo',
    true
  )
  ON CONFLICT (auth_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 5. Criar função para criar carteira após criar cliente
CREATE OR REPLACE FUNCTION public.criar_carteira_apos_cliente()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Inserir carteira
  INSERT INTO public.carteira_x88 (
    cliente_id, 
    saldo, 
    saldo_bloqueado, 
    total_recebido, 
    total_gasto
  )
  VALUES (
    NEW.id, 
    0, 
    0, 
    0, 
    0
  )
  ON CONFLICT (cliente_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 6. Criar trigger para criar cliente após signup
CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_cliente_apos_signup();

-- 7. Criar trigger para criar carteira após criar cliente
CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_carteira_apos_cliente();

-- 8. Verificar se os triggers foram criados
SELECT 
  t.tgname AS trigger_name,
  p.proname AS function_name,
  c.relname AS table_name,
  CASE 
    WHEN t.tgenabled = 'O' THEN 'Enabled'
    ELSE 'Disabled'
  END AS status
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
JOIN pg_class c ON t.tgrelid = c.oid
WHERE c.relname IN ('users', 'clientes')
ORDER BY c.relname, t.tgname;
