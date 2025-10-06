-- Remover a constraint de origem para permitir qualquer valor
ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_origem_check;

-- OU adicionar 'web' e 'app_cliente' aos valores permitidos
-- (execute apenas uma das opções acima ou abaixo)

-- Opção alternativa: Adicionar novos valores permitidos
-- ALTER TABLE clientes DROP CONSTRAINT IF EXISTS clientes_origem_check;
-- ALTER TABLE clientes ADD CONSTRAINT clientes_origem_check 
--   CHECK (origem IN ('manual', 'importacao', 'web', 'app_cliente', 'sistema'));
