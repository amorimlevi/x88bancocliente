# ✅ Sistema com Supabase Auth (Nativo)

## 🚀 Como Configurar

### 1. Execute o SQL no Supabase

1. Abra [SETUP_SUPABASE_AUTH.sql](./sql/SETUP_SUPABASE_AUTH.sql)
2. Copie **TODO** o conteúdo (Ctrl+A, Ctrl+C)
3. Vá no **Supabase SQL Editor**
4. Cole e clique em **RUN**

### 2. Pronto!

Agora o sistema usa **Supabase Auth** (sistema nativo):
- ✅ Os usuários aparecerão em **Authentication > Users**
- ✅ Login com `supabase.auth.signInWithPassword()`
- ✅ Cadastro com `supabase.auth.signUp()`
- ✅ Senhas gerenciadas pelo Supabase
- ✅ Triggers automáticos criam cliente e carteira

## 🔄 O que mudou

### Antes (Autenticação Customizada)
- ❌ Senha armazenada em `clientes.senha_hash`
- ❌ Login manual verificando hash
- ❌ Usuários não aparecem em Authentication

### Agora (Supabase Auth)
- ✅ Senha gerenciada pelo Supabase Auth
- ✅ Login usando `signInWithPassword()`
- ✅ Usuários aparecem em **Authentication > Users**
- ✅ Tabela `clientes` vinculada via `auth_id`

## 📊 Estrutura

```
auth.users (Supabase Auth)
    ↓ (auth_id)
clientes (seus dados)
    ↓ (cliente_id)
carteira_x88 (saldo)
```

## 🔧 Como Funciona

### Cadastro
1. User cria conta no app
2. `supabase.auth.signUp()` cria em **auth.users**
3. **Trigger automático** cria registro em **clientes**
4. **Trigger automático** cria **carteira_x88**
5. Usuário aparece em **Authentication > Users**

### Login
1. User faz login no app
2. `supabase.auth.signInWithPassword()` valida
3. Busca cliente vinculado pelo `auth_id`
4. Retorna `cliente_id` para o app

## 📁 Arquivos Atualizados

- ✅ `sql/SETUP_SUPABASE_AUTH.sql` - Setup completo
- ✅ `frontend/src/services/authServiceSupabase.ts` - Novo serviço
- ✅ `frontend/src/components/auth/Login.tsx` - Usa novo serviço
- ✅ `frontend/src/components/auth/Cadastro.tsx` - Usa novo serviço

## 🔍 Ver Usuários Cadastrados

### No Supabase Dashboard:
1. **Authentication > Users** - Ver todos os usuários
2. **Table Editor > clientes** - Ver dados dos clientes
3. **Table Editor > carteira_x88** - Ver saldos

### SQL:
```sql
-- Ver todos os usuários com seus dados
SELECT 
  u.id as auth_id,
  u.email,
  u.created_at as cadastrado_em,
  c.id as cliente_id,
  c.nome,
  c.telefone,
  c.status
FROM auth.users u
LEFT JOIN clientes c ON c.auth_id = u.id
ORDER BY u.created_at DESC;
```

## 🎯 Vantagens

1. ✅ **Segurança**: Senhas gerenciadas pelo Supabase
2. ✅ **Recuperação de senha**: Email automático
3. ✅ **Confirmação de email**: Opcional
4. ✅ **OAuth**: Pode adicionar Google, Facebook, etc
5. ✅ **Dashboard**: Ver usuários em Authentication
6. ✅ **Logs**: Ver atividade de login

## ⚙️ Configurações Opcionais

### Desabilitar confirmação de email (teste):
1. Vá em **Authentication > Settings**
2. **Email Auth** → Desmarque "Confirm email"

### Ativar recuperação de senha:
1. Configure um **Email Template** em Settings
2. A função `solicitarRecuperacao()` já está pronta

## 🔐 RLS (Row Level Security)

O RLS agora usa `auth.uid()`:
- Usuários só veem seus próprios dados
- Baseado no `auth_id` da tabela `clientes`
- Totalmente seguro

## ✨ Conclusão

Agora você tem autenticação profissional com Supabase Auth! Os usuários aparecem no dashboard e o sistema está mais seguro e escalável.
