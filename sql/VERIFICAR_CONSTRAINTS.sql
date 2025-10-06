-- Verificar constraints da tabela clientes
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'public.clientes'::regclass
AND conname LIKE '%origem%';
