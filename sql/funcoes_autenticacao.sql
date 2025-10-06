-- Funções para Autenticação com Hash de Senha
-- Execute este SQL no Supabase SQL Editor DEPOIS de criar a tabela acesso_cliente

-- Habilitar extensão pgcrypto para hash de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para criar hash de senha
CREATE OR REPLACE FUNCTION criar_hash_senha(p_senha TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(p_senha, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION verificar_senha(p_senha TEXT, p_senha_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_senha_hash = crypt(p_senha, p_senha_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON FUNCTION criar_hash_senha IS 'Cria hash bcrypt da senha com 10 rounds';
COMMENT ON FUNCTION verificar_senha IS 'Verifica se a senha corresponde ao hash armazenado';
