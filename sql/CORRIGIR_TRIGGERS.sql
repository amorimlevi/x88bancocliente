-- CORRIGIR TRIGGERS DE AUTENTICAÇÃO

-- 1. Remover triggers antigos
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
DROP TRIGGER IF EXISTS criar_carteira_trigger ON public.clientes;

-- 2. Criar ou substituir função para criar cliente após signup
CREATE OR REPLACE FUNCTION public.criar_cliente_apos_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir novo cliente com auth_id
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

-- 3. Criar ou substituir função para criar carteira após criar cliente
CREATE OR REPLACE FUNCTION public.criar_carteira_apos_cliente()
RETURNS TRIGGER AS $$
BEGIN
  -- Inserir nova carteira apenas se não existir
  INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
  VALUES (NEW.id, 0, 0, 0, 0)
  ON CONFLICT (cliente_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar trigger para criar cliente após signup
CREATE TRIGGER criar_cliente_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_cliente_apos_signup();

-- 5. Criar trigger para criar carteira após criar cliente
CREATE TRIGGER criar_carteira_trigger
  AFTER INSERT ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_carteira_apos_cliente();

-- 6. Processar usuários existentes que não têm cliente
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

-- 7. Processar clientes existentes que não têm carteira
INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
SELECT 
  c.id,
  0,
  0,
  0,
  0
FROM public.clientes c
LEFT JOIN public.carteira_x88 w ON w.cliente_id = c.id
WHERE w.id IS NULL
ON CONFLICT (cliente_id) DO NOTHING;

-- 8. Verificar resultado final
SELECT 
  (SELECT COUNT(*) FROM auth.users) as usuarios,
  (SELECT COUNT(*) FROM clientes) as clientes,
  (SELECT COUNT(*) FROM carteira_x88) as carteiras;
