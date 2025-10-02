#!/bin/bash

# Script automatizado para build do app Android X88 Bank
# Autor: Sistema de Build Automático
# Data: 2025

echo "🚀 X88 Bank - Build Android Automático"
echo "======================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função de log
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar Node.js
log_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Instale em https://nodejs.org"
    exit 1
fi
log_success "Node.js $(node -v) encontrado"

# Verificar npm
log_info "Verificando npm..."
if ! command -v npm &> /dev/null; then
    log_error "npm não encontrado"
    exit 1
fi
log_success "npm $(npm -v) encontrado"

# Menu de seleção
echo ""
echo "Selecione o método de build:"
echo "1) TWA com Bubblewrap (Recomendado para Play Store)"
echo "2) Capacitor (App híbrido com APIs nativas)"
echo "3) Apenas build PWA"
echo ""
read -p "Escolha (1-3): " choice

case $choice in
    1)
        echo ""
        log_info "🎯 Método selecionado: TWA com Bubblewrap"
        echo ""
        
        # Verificar se Bubblewrap está instalado
        if ! command -v bubblewrap &> /dev/null; then
            log_warning "Bubblewrap não encontrado. Instalando..."
            npm install -g @bubblewrap/cli
        fi
        
        # Build PWA primeiro
        log_info "Building PWA..."
        npm run build
        log_success "PWA build completo"
        
        # Verificar se já foi inicializado
        if [ ! -f "twa-manifest.json" ]; then
            log_warning "TWA não inicializado. Execute primeiro:"
            echo ""
            echo "  npm run android:init"
            echo ""
            log_info "Depois de inicializar, rode este script novamente"
            exit 0
        fi
        
        # Build APK
        log_info "Building APK com Bubblewrap..."
        npm run android:build
        
        if [ $? -eq 0 ]; then
            log_success "APK gerado com sucesso!"
            echo ""
            echo "📦 Arquivo: app-release-signed.apk"
            echo ""
            echo "Para instalar no dispositivo:"
            echo "  npm run android:install"
            echo ""
            echo "Ou manualmente:"
            echo "  adb install app-release-signed.apk"
        else
            log_error "Erro ao gerar APK"
            exit 1
        fi
        ;;
        
    2)
        echo ""
        log_info "🎯 Método selecionado: Capacitor"
        echo ""
        
        # Verificar se Capacitor está instalado
        if [ ! -d "node_modules/@capacitor/core" ]; then
            log_warning "Capacitor não encontrado. Instalando..."
            npm install @capacitor/core @capacitor/cli @capacitor/android
            npm install @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard
        fi
        
        # Build PWA
        log_info "Building PWA..."
        npm run build
        log_success "PWA build completo"
        
        # Verificar se Android foi adicionado
        if [ ! -d "android" ]; then
            log_warning "Plataforma Android não encontrada. Adicionando..."
            npx cap add android
        fi
        
        # Sync com Android
        log_info "Sincronizando com Android..."
        npx cap sync android
        log_success "Sync completo"
        
        echo ""
        log_success "Projeto pronto!"
        echo ""
        echo "Para abrir no Android Studio:"
        echo "  npm run capacitor:open"
        echo ""
        echo "Ou manualmente:"
        echo "  npx cap open android"
        echo ""
        log_info "No Android Studio, faça: Build > Generate Signed Bundle/APK"
        ;;
        
    3)
        echo ""
        log_info "🎯 Método selecionado: Build PWA apenas"
        echo ""
        
        log_info "Building PWA..."
        npm run build
        log_success "PWA build completo!"
        
        echo ""
        echo "Para testar localmente:"
        echo "  npm run preview"
        echo ""
        echo "Para fazer deploy:"
        echo "  - Vercel: vercel --prod"
        echo "  - Netlify: netlify deploy --prod"
        echo "  - Firebase: firebase deploy"
        ;;
        
    *)
        log_error "Opção inválida"
        exit 1
        ;;
esac

echo ""
log_success "Build completo! 🎉"
