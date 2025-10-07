-- REMOVER VALIDAÇÃO DE EMAIL/CARGO E SIMPLIFICAR TRIGGERS

-- 1. Verificar constraints na tabela clientes
SELECT 
  conname AS constraint_name,
  contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'public.clientes'::regclass;

-- 2. Remover constraint de email único se existir
ALTER TABLE public.clientes DROP CONSTRAINT IF EXISTS clientes_email_key;
ALTER TABLE public.clientes DROP CONSTRAINT IF EXISTS unique_email_cargo;

-- 2.1 Garantir que existe constraint única em carteira_x88.cliente_id
ALTER TABLE public.carteira_x88 DROP CONSTRAINT IF EXISTS carteira_x88_cliente_id_key;
ALTER TABLE public.carteira_x88 ADD CONSTRAINT carteira_x88_cliente_id_key UNIQUE (cliente_id);

-- 3. Remover triggers antigos
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS criar_cliente_trigger ON auth.users;
DROP TRIGGER IF EXISTS criar_carteira_trigger ON public.clientes;

-- 4. Remover funções antigas
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.criar_cliente_apos_signup() CASCADE;
DROP FUNCTION IF EXISTS public.criar_carteira_apos_cliente() CASCADE;
DROP FUNCTION IF EXISTS public.impedir_gestor_como_cliente() CASCADE;

-- 5. Criar nova função simplificada
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  novo_cliente_id INT;
  is_gestor BOOLEAN;
  user_type TEXT;
BEGIN
  -- Verificar se o usuário está sendo criado como gestor (via metadados)
  user_type := COALESCE(NEW.raw_user_meta_data->>'tipo', NEW.raw_user_meta_data->>'role', 'cliente');
  
  -- Se for gestor, não criar cliente (app de gestor criará o registro)
  IF user_type = 'gestor' THEN
    RETURN NEW;
  END IF;

  -- Verificar se o email já está cadastrado como gestor
  SELECT EXISTS (
    SELECT 1 FROM public.gestores WHERE email = NEW.email
  ) INTO is_gestor;

  -- Se for gestor, não criar cliente
  IF is_gestor THEN
    RAISE EXCEPTION 'Este email pertence a um GESTOR e não pode ser registrado como CLIENTE';
  END IF;

  -- Inserir cliente (ignorar se já existe)
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
  ON CONFLICT (auth_id) DO UPDATE
  SET email = EXCLUDED.email,
      nome = EXCLUDED.nome,
      telefone = EXCLUDED.telefone
  RETURNING id INTO novo_cliente_id;

  -- Inserir carteira (ignorar se já existe)
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
  )
  ON CONFLICT (cliente_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro mas não falha o signup
    RAISE WARNING 'Erro ao criar cliente/carteira para %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- 6. Criar trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Processar usuários existentes sem cliente
DO $$
DECLARE
  user_record RECORD;
  novo_cliente_id INT;
BEGIN
  FOR user_record IN 
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM public.clientes c WHERE c.auth_id = u.id
    )
  LOOP
    -- Criar cliente
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
      user_record.id,
      user_record.email,
      COALESCE(user_record.raw_user_meta_data->>'nome', 'Novo Cliente'),
      COALESCE(user_record.raw_user_meta_data->>'telefone', ''),
      'cliente',
      'ativo',
      true
    )
    ON CONFLICT (auth_id) DO NOTHING
    RETURNING id INTO novo_cliente_id;

    -- Criar carteira se cliente foi criado
    IF novo_cliente_id IS NOT NULL THEN
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
      )
      ON CONFLICT (cliente_id) DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- 8. Criar carteiras para clientes sem carteira
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
)
ON CONFLICT (cliente_id) DO NOTHING;

-- 9. Verificar resultado
SELECT 
  'Total de usuários:' as label,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Total de clientes:' as label,
  COUNT(*) as count
FROM public.clientes
UNION ALL
SELECT 
  'Total de carteiras:' as label,
  COUNT(*) as count
FROM public.carteira_x88;
