-- FIX TRIGGERS E PERMISSÕES

-- 1. Remover triggers e funções antigas
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
DROP TRIGGER IF EXISTS criar_carteira_trigger ON public.clientes;
DROP FUNCTION IF EXISTS public.criar_cliente_apos_signup() CASCADE;
DROP FUNCTION IF EXISTS public.criar_carteira_apos_cliente() CASCADE;

-- 2. Criar função para criar cliente (com permissões corretas)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  novo_cliente_id INT;
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
  RETURNING id INTO novo_cliente_id;

  -- Inserir carteira para o cliente recém-criado
  INSERT INTO public.carteira_x88 (
    cliente_id,
    saldo,
    saldo_bloqueado,
    total_recebido,
    total_gasto
  )
  VALUES (
    novo_cliente_id,
    0,
    0,
    0,
    0
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Erro ao criar cliente/carteira: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Dar permissões para a função
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- 4. Criar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. Garantir que a tabela clientes aceita inserções do trigger
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.carteira_x88 DISABLE ROW LEVEL SECURITY;

-- 6. Recriar políticas RLS mais permissivas
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.clientes;
DROP POLICY IF EXISTS "Sistema pode inserir clientes" ON public.clientes;

CREATE POLICY "Permitir inserção via trigger"
  ON public.clientes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver seus próprios dados"
  ON public.clientes
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
  ON public.clientes
  FOR UPDATE
  USING (auth.uid() = auth_id);

-- Políticas para carteira_x88
DROP POLICY IF EXISTS "Usuários podem ver sua carteira" ON public.carteira_x88;
DROP POLICY IF EXISTS "Sistema pode inserir carteiras" ON public.carteira_x88;

CREATE POLICY "Permitir inserção via trigger carteira"
  ON public.carteira_x88
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver sua carteira"
  ON public.carteira_x88
  FOR SELECT
  USING (
    cliente_id IN (
      SELECT id FROM public.clientes WHERE auth_id = auth.uid()
    )
  );

-- 7. Reabilitar RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carteira_x88 ENABLE ROW LEVEL SECURITY;

-- 8. Processar usuários existentes que não têm cliente
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.clientes c WHERE c.auth_id = u.id
);

-- 9. Criar carteiras para clientes que não têm
INSERT INTO public.carteira_x88 (cliente_id, saldo, saldo_bloqueado, total_recebido, total_gasto)
SELECT 
  c.id,
  0,
  0,
  0,
  0
FROM public.clientes c
WHERE NOT EXISTS (
  SELECT 1 FROM public.carteira_x88 w WHERE w.cliente_id = c.id
);

-- 10. Verificar resultado
SELECT 'Verificação Final:' as status;
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_usuarios,
  (SELECT COUNT(*) FROM public.clientes) as total_clientes,
  (SELECT COUNT(*) FROM public.carteira_x88) as total_carteiras;
