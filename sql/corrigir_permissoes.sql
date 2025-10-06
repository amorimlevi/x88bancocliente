-- Corrigir permissões para permitir cadastro

-- Permitir INSERT na tabela clientes (necessário para cadastro)
DROP POLICY IF EXISTS "Permitir insert público" ON clientes;
CREATE POLICY "Permitir insert público"
  ON clientes FOR INSERT
  WITH CHECK (true);

-- Permitir SELECT na tabela clientes
DROP POLICY IF EXISTS "Permitir select público" ON clientes;
CREATE POLICY "Permitir select público"
  ON clientes FOR SELECT
  USING (true);

-- Permitir INSERT na tabela acesso_cliente (necessário para cadastro)
DROP POLICY IF EXISTS "Permitir insert de acesso" ON acesso_cliente;
CREATE POLICY "Permitir insert de acesso"
  ON acesso_cliente FOR INSERT
  WITH CHECK (true);

-- Permitir SELECT na tabela acesso_cliente para login
DROP POLICY IF EXISTS "Permitir select de acesso" ON acesso_cliente;
CREATE POLICY "Permitir select de acesso"
  ON acesso_cliente FOR SELECT
  USING (true);

-- Permitir UPDATE na tabela acesso_cliente (para tentativas falhas)
DROP POLICY IF EXISTS "Permitir update de acesso" ON acesso_cliente;
CREATE POLICY "Permitir update de acesso"
  ON acesso_cliente FOR UPDATE
  USING (true);

-- Permitir INSERT na tabela carteira_x88
DROP POLICY IF EXISTS "Permitir insert carteira" ON carteira_x88;
CREATE POLICY "Permitir insert carteira"
  ON carteira_x88 FOR INSERT
  WITH CHECK (true);

-- Permitir SELECT na tabela carteira_x88
DROP POLICY IF EXISTS "Permitir select carteira" ON carteira_x88;
CREATE POLICY "Permitir select carteira"
  ON carteira_x88 FOR SELECT
  USING (true);

-- Tornar as funções acessíveis publicamente
GRANT EXECUTE ON FUNCTION criar_hash_senha(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verificar_senha(TEXT, TEXT) TO anon, authenticated;
