# Configuração do Supabase

## Problema Resolvido ✅

A tela branca foi causada pela falta de configuração das variáveis de ambiente do Supabase. O sistema foi ajustado para:
1. Não quebrar quando Supabase não está configurado
2. Exibir warning no console em vez de erro
3. Permitir desenvolvimento local sem Supabase

## Configuração para Desenvolvimento Local

### Opção 1: Usar Supabase Real (Recomendado)

1. **Obtenha suas credenciais do Supabase:**
   - Acesse https://supabase.com/dashboard
   - Selecione seu projeto
   - Vá em Settings > API
   - Copie a URL e a chave anon/public

2. **Configure o arquivo .env:**
   ```bash
   cd frontend
   # Edite o arquivo .env
   ```

3. **Atualize com suas credenciais:**
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-real
   ```

4. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

### Opção 2: Modo de Desenvolvimento (Sem Supabase)

O aplicativo agora funciona sem Supabase configurado, mas com funcionalidade limitada:
- ✅ Login e navegação funcionam
- ❌ Dados não são persistidos
- ❌ Saldo sempre zerado
- ❌ Transações não são salvas

Para usar neste modo, deixe o `.env` com valores placeholder:
```env
VITE_SUPABASE_URL=https://placeholder.supabase.co
VITE_SUPABASE_ANON_KEY=placeholder-key
```

## Configuração para Produção (Netlify)

As variáveis já estão configuradas no Netlify:
- `VITE_SUPABASE_URL` ✅
- `VITE_SUPABASE_ANON_KEY` ✅

## Verificando a Configuração

Abra o console do navegador:
- ✅ **Se ver:** "Conectado ao Supabase" → Configurado corretamente
- ⚠️ **Se ver:** "Supabase não configurado" → Usando modo desenvolvimento

## Testando a Integração

Com Supabase configurado, você pode testar:

1. **Login:** Use um email/senha de cliente existente na tabela `clientes`
2. **Saldo:** Deve aparecer o saldo real da tabela `carteira_x88`
3. **Transações:** Deve listar do histórico real
4. **Solicitações:** Criar e ver em tempo real

## Problemas Comuns

### Tela branca
- Verifique se o `.env` existe
- Verifique se o servidor foi reiniciado após editar o `.env`

### "Supabase não configurado"
- Verifique se as credenciais estão corretas
- Verifique se o projeto Supabase está ativo

### Dados não aparecem
- Verifique se as tabelas têm dados
- Verifique se o userId no código corresponde ao `id` na tabela `clientes`

## Suporte

Para mais informações, consulte:
- [INTEGRACAO-SUPABASE.md](./INTEGRACAO-SUPABASE.md) - Documentação técnica
- [Supabase Docs](https://supabase.com/docs)
