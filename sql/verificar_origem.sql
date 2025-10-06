-- Verificar a constraint de origem
SELECT con.conname, pg_get_constraintdef(con.oid) 
FROM pg_constraint con
WHERE con.conname = 'clientes_origem_check';

-- Ver valores permitidos
-- Se não aparecer nada, execute isso:
-- SELECT * FROM clientes LIMIT 1;
