-- DIAGNOSTICAR TRIGGERS E FUNÇÕES

-- 1. Verificar se as funções existem
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN ('criar_cliente_apos_signup', 'criar_carteira_apos_cliente');

-- 2. Verificar se os triggers existem
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
OR event_object_schema = 'auth';

-- 3. Contar registros
SELECT 
    (SELECT COUNT(*) FROM auth.users) as usuarios,
    (SELECT COUNT(*) FROM clientes) as clientes,
    (SELECT COUNT(*) FROM carteira_x88) as carteiras;

-- 4. Verificar estrutura da tabela clientes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'clientes'
ORDER BY ordinal_position;
