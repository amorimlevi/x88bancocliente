# X88 Bank - Aplicativo de Transações Bancárias

## 📱 Sobre o Projeto

X88 Bank é um aplicativo bancário simples e intuitivo para gerenciar sua moeda X88, realizar saques via MBway e solicitar crédito.

## 🎨 Design

- **Cores**: Preto, Verde (#22c55e) e Branco
- **Estilo**: Simples, moderno e bancário
- **Responsive**: Otimizado para mobile e desktop

## ⚡ Funcionalidades

### Para Clientes
- Login seguro
- Dashboard com saldo em moeda X88
- **Saque via MBway** - Converter X88 para Euro (€)
- **Solicitar Crédito X88** - Pedir limite de crédito
- Histórico de transações
- Acompanhar status (Pendente, Aprovado, Negado)
- Modo claro/escuro

## 💰 Moeda X88

- **Moeda digital** própria do banco
- **Taxa de conversão**: 1 X88 = 1.5 €
- Pode ser convertida para Euro via saque MBway
- Solicitação de crédito quando não há saldo suficiente

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **PWA** com service workers

### Backend
- **Node.js** com Express
- **CORS** habilitado
- **API REST** simples

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Instalar dependências do frontend
cd frontend && npm install

# Instalar dependências do backend
cd backend && npm install

# Iniciar desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev          # Inicia frontend e backend
npm run dev:frontend # Apenas frontend
npm run dev:backend  # Apenas backend  
npm run build        # Build de produção
npm run preview      # Preview da build
```

## 📱 PWA Features

- ✅ Instalável no dispositivo
- ✅ Funciona offline
- ✅ Notificações push
- ✅ Ícones personalizados
- ✅ Tema adaptativo

## 📄 Licença

Projeto privado - Todos os direitos reservados.
