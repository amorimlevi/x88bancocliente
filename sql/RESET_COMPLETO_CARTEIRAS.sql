-- RESET COMPLETO - REMOVER TUDO E RECRIAR

-- 1. Desabilitar triggers
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
DROP TRIGGER IF EXISTS criar_carteira_trigger ON public.clientes;

-- 2. Desabilitar RLS temporariamente
ALTER TABLE carteira_x88 DISABLE ROW LEVEL SECURITY;

-- 3. DELETAR TODAS as carteiras
DELETE FROM public.carteira_x88;

-- 4. Criar funções
CREATE OR REPLACE FUNCTION public.criar_cliente_apos_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.clientes (auth_id, email, nome, telefone, cargo, status, ativo)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.criar_carteira_apos_cliente()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
  VALUES (NEW.id, 0, 0, 0, 0)
  ON CONFLICT (cliente_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar triggers
CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_cliente_apos_signup();

CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_carteira_apos_cliente();

-- 6. Processar usuários sem cliente
INSERT INTO public.clientes (auth_id, email, nome, telefone, cargo, status, ativo)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'nome', 'Novo Cliente'),
  COALESCE(u.raw_user_meta_data->>'telefone', ''),
  'cliente',
  'ativo',
  true
FROM auth.users u
LEFT JOIN public.clientes c ON c.auth_id = u.id
WHERE c.id IS NULL
ON CONFLICT (auth_id) DO NOTHING;

-- 7. Criar carteiras para TODOS os clientes
INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
SELECT 
  id,
  0,
  0,
  0,
  0
FROM public.clientes
ON CONFLICT (cliente_id) DO NOTHING;

-- 8. Reabilitar RLS
ALTER TABLE carteira_x88 ENABLE ROW LEVEL SECURITY;

-- 9. Verificar resultado
SELECT 
  (SELECT COUNT(*) FROM auth.users) as usuarios,
  (SELECT COUNT(*) FROM clientes) as clientes,
  (SELECT COUNT(*) FROM carteira_x88) as carteiras;
