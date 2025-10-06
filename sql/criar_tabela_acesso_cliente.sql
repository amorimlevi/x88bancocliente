-- Tabela de Acesso para Autenticação do Banco Cliente
-- Execute este SQL no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS acesso_cliente (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  
  -- Credenciais de acesso
  email VARCHAR(255) NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  pin_acesso VARCHAR(6), -- PIN de 6 dígitos para acesso rápido
  
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

-- Índices para performance
CREATE INDEX idx_acesso_cliente_email ON acesso_cliente(email);
CREATE INDEX idx_acesso_cliente_cliente_id ON acesso_cliente(cliente_id);
CREATE INDEX idx_acesso_cliente_ativo ON acesso_cliente(ativo);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_acesso_cliente_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER acesso_cliente_updated
  BEFORE UPDATE ON acesso_cliente
  FOR EACH ROW
  EXECUTE FUNCTION update_acesso_cliente_timestamp();

-- RLS (Row Level Security) - Habilitar
ALTER TABLE acesso_cliente ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver apenas seu próprio acesso"
  ON acesso_cliente FOR SELECT
  USING (auth.uid() = cliente_id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio acesso"
  ON acesso_cliente FOR UPDATE
  USING (auth.uid() = cliente_id);

-- Comentários na tabela
COMMENT ON TABLE acesso_cliente IS 'Tabela de autenticação e controle de acesso dos clientes';
COMMENT ON COLUMN acesso_cliente.pin_acesso IS 'PIN numérico de 6 dígitos para acesso rápido';
COMMENT ON COLUMN acesso_cliente.tentativas_falhas IS 'Contador de tentativas de login falhas';
COMMENT ON COLUMN acesso_cliente.bloqueado_ate IS 'Data/hora até quando a conta está bloqueada';
