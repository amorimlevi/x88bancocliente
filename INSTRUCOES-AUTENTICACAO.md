# 🔐 Configuração da Autenticação - Guia Rápido

## ⚡ Passo a Passo

### 1️⃣ Criar Tabela no Supabase

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **+ New Query**
5. Cole o conteúdo de `sql/criar_tabela_acesso_cliente.sql`
6. Clique em **RUN** (ou F5)

### 2️⃣ Criar Funções de Hash

1. No mesmo **SQL Editor**
2. Clique em **+ New Query** novamente
3. Cole o conteúdo de `sql/funcoes_autenticacao.sql`
4. Clique em **RUN** (ou F5)

### 3️⃣ Verificar

Execute esta query para verificar:

```sql
-- Verificar se a tabela foi criada
SELECT * FROM acesso_cliente LIMIT 1;

-- Verificar se as funções existem
SELECT proname FROM pg_proc WHERE proname IN ('criar_hash_senha', 'verificar_senha');
```

## ✅ Pronto!

Agora você pode:

1. **Criar uma conta** no aplicativo (tela de cadastro)
2. **Fazer login** com email e senha
3. O acesso com emails fictícios está **bloqueado**

## 📋 O que foi criado

- ✅ Tabela `acesso_cliente` com segurança RLS
- ✅ Função `criar_hash_senha()` - Hash bcrypt da senha
- ✅ Função `verificar_senha()` - Valida credenciais
- ✅ Proteção contra força bruta (5 tentativas)
- ✅ Sistema completo de autenticação

## 🔍 Consultas Úteis

### Ver todos os acessos
```sql
SELECT id, email, ativo, tentativas_falhas, criado_em 
FROM acesso_cliente;
```

### Desbloquear conta
```sql
UPDATE acesso_cliente 
SET tentativas_falhas = 0, bloqueado_ate = NULL 
WHERE email = 'user@email.com';
```

### Ativar/Desativar conta
```sql
UPDATE acesso_cliente 
SET ativo = true  -- ou false
WHERE email = 'user@email.com';
```

## ⚠️ Importante

- As senhas são armazenadas com **hash bcrypt** (10 rounds)
- O hash é feito no **Supabase** (backend), não no frontend
- **Nunca** armazene senhas em texto plano
- RLS está habilitado para segurança

## 🆘 Problemas?

### "Função criar_hash_senha não existe"
→ Execute o SQL de `funcoes_autenticacao.sql`

### "Tabela acesso_cliente não existe"
→ Execute o SQL de `criar_tabela_acesso_cliente.sql`

### "Extensão pgcrypto não encontrada"
→ Execute: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`

## 📚 Documentação Completa

Ver [SISTEMA-AUTENTICACAO.md](./SISTEMA-AUTENTICACAO.md) para documentação técnica completa.
