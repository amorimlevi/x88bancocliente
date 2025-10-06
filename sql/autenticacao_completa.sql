-- ============================================
-- CONFIGURAÇÃO COMPLETA DE AUTENTICAÇÃO
-- Execute TODO este SQL no Supabase SQL Editor
-- ============================================

-- 1. Habilitar extensão pgcrypto para hash de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Criar tabela de acesso
CREATE TABLE IF NOT EXISTS acesso_cliente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  
  -- Credenciais de acesso
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  pin_acesso VARCHAR(6),
  
  -- Controle de sessão
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  ip_ultimo_acesso VARCHAR(45),
  dispositivo_info JSONB,
  
  -- Segurança
  tentativas_falhas INTEGER DEFAULT 0,
  bloqueado_ate TIMESTAMP WITH TIME ZONE,
  token_recuperacao TEXT,
  token_expira_em TIMESTAMP WITH TIME ZONE,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  primeiro_acesso BOOLEAN DEFAULT true,
  
  -- Auditoria
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_acesso_cliente_email ON acesso_cliente(email);
CREATE INDEX IF NOT EXISTS idx_acesso_cliente_cliente_id ON acesso_cliente(cliente_id);
CREATE INDEX IF NOT EXISTS idx_acesso_cliente_ativo ON acesso_cliente(ativo);

-- 4. Criar trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_acesso_cliente_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS acesso_cliente_updated ON acesso_cliente;
CREATE TRIGGER acesso_cliente_updated
  BEFORE UPDATE ON acesso_cliente
  FOR EACH ROW
  EXECUTE FUNCTION update_acesso_cliente_timestamp();

-- 5. Criar função para hash de senha
CREATE OR REPLACE FUNCTION criar_hash_senha(p_senha TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(p_senha, gen_salt('bf', 10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar função para verificar senha
CREATE OR REPLACE FUNCTION verificar_senha(p_senha TEXT, p_senha_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_senha_hash = crypt(p_senha, p_senha_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Habilitar RLS (Row Level Security)
ALTER TABLE acesso_cliente ENABLE ROW LEVEL SECURITY;

-- 8. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem ver apenas seu próprio acesso" ON acesso_cliente;
DROP POLICY IF EXISTS "Usuários podem atualizar apenas seu próprio acesso" ON acesso_cliente;

-- 9. Criar políticas RLS
CREATE POLICY "Usuários podem ver apenas seu próprio acesso"
  ON acesso_cliente FOR SELECT
  USING (auth.uid() = cliente_id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio acesso"
  ON acesso_cliente FOR UPDATE
  USING (auth.uid() = cliente_id);

-- 10. Adicionar comentários
COMMENT ON TABLE acesso_cliente IS 'Tabela de autenticação e controle de acesso dos clientes';
COMMENT ON COLUMN acesso_cliente.pin_acesso IS 'PIN numérico de 6 dígitos para acesso rápido';
COMMENT ON COLUMN acesso_cliente.tentativas_falhas IS 'Contador de tentativas de login falhas';
COMMENT ON COLUMN acesso_cliente.bloqueado_ate IS 'Data/hora até quando a conta está bloqueada';
COMMENT ON FUNCTION criar_hash_senha IS 'Cria hash bcrypt da senha com 10 rounds';
COMMENT ON FUNCTION verificar_senha IS 'Verifica se a senha corresponde ao hash armazenado';

-- ============================================
-- ✅ FINALIZADO!
-- Agora você pode testar o cadastro no app
-- ============================================
