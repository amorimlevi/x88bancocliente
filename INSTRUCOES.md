# 🚀 Instruções de Instalação - X88 Colaborador

## Passo a Passo para Rodar o Aplicativo

### 1️⃣ Instalar Dependências Raiz
```bash
cd x88-colaborador
npm install
```

### 2️⃣ Instalar Dependências do Frontend
```bash
cd frontend
npm install
cd ..
```

### 3️⃣ Instalar Dependências do Backend
```bash
cd backend
npm install
cd ..
```

### 4️⃣ Iniciar o Aplicativo Completo
```bash
npm run dev
```

Isso vai iniciar:
- **Frontend** na porta **3001** → http://localhost:3001
- **Backend** na porta **3002** → http://localhost:3002

---

## 📱 Como Usar o App

1. **Login**: Entre com qualquer email e senha (por enquanto é mock)
2. **Dashboard**: Veja suas estatísticas e solicitações
3. **Nova Solicitação**: Clique no grande card verde para solicitar um pagamento
4. **Minhas Solicitações**: Acompanhe o status (Pendente, Aprovado, Negado)
5. **Tema**: Alterne entre modo claro/escuro no canto superior direito

---

## 🎨 Características do Design

- ✅ **Mesmo padrão de cores do app principal** (Verde #22c55e, Preto, Branco)
- ✅ **Interface super simples** (criança consegue usar)
- ✅ **Botões grandes e claros**
- ✅ **Cards com bordas verdes**
- ✅ **Modo escuro/claro**
- ✅ **Responsivo** (funciona em celular e desktop)

---

## 🔗 Próximos Passos

1. Conectar com banco de dados (MongoDB/PostgreSQL)
2. Integrar autenticação real com JWT
3. Sincronizar solicitações com o app do gestor
4. Adicionar notificações push
5. Implementar PWA completo (instalar no celular)

---

## 📂 Estrutura de Pastas

```
x88-colaborador/
├── frontend/           # App React
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/      # Login
│   │   │   ├── dashboard/ # Dashboard + Header
│   │   │   ├── solicitacoes/ # Nova Solicitação + Lista
│   │   │   └── ui/        # Componentes reutilizáveis
│   │   ├── contexts/      # ThemeContext
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/            # API Express
│   ├── src/
│   │   └── server.js   # Servidor com rotas mock
│   └── package.json
└── package.json        # Raiz (scripts para rodar tudo)
```

---

## 🎯 Diferenças entre Apps

| **App Gestor** | **App Colaborador** |
|----------------|---------------------|
| Dashboard completo com gráficos | Dashboard simples e direto |
| Gerenciar colaboradores | Apenas solicitar pagamentos |
| Aprovar/negar solicitações | Ver status das solicitações |
| Relatórios e analytics | Interface minimalista |
| Sidebar com várias seções | Uma tela principal |

---

## ⚡ Comandos Úteis

```bash
# Rodar apenas frontend
npm run dev:frontend

# Rodar apenas backend
npm run dev:backend

# Build para produção
npm run build

# Preview da build
npm run preview
```

---

## 🆘 Problemas Comuns

**Erro de porta ocupada?**
- Frontend: Altere a porta em `frontend/vite.config.ts`
- Backend: Altere a porta em `backend/.env`

**Dependências não instaladas?**
```bash
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

---

Pronto! Agora você tem um app completo para colaboradores! 🎉
