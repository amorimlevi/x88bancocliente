import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/auth/Login'
import Cadastro from './components/auth/Cadastro'
import Dashboard from './components/dashboard/Dashboard'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { supabase } from './lib/supabase'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mostrarCadastro, setMostrarCadastro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [isAuthenticated, mostrarCadastro])
  
  const [userId, setUserId] = useState<string>('')
  const [saldoInicial, setSaldoInicial] = useState<number | undefined>(undefined)
  const [creditoInicial, setCreditoInicial] = useState<number | undefined>(undefined)
  const [isNewAccount, setIsNewAccount] = useState(false)

  // Verificar sessão ativa ao carregar o app
  useEffect(() => {
    const verificarSessao = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('✅ Sessão ativa encontrada:', session.user.id)
          
          // Buscar dados do cliente
          const { data: cliente, error } = await supabase
            .from('clientes')
            .select('id, email')
            .eq('auth_id', session.user.id)
            .single()

          if (!error && cliente) {
            console.log('✅ Cliente encontrado:', cliente.id)
            setUserId(cliente.id)
            setIsAuthenticated(true)
          } else {
            console.error('❌ Cliente não encontrado para auth_id:', session.user.id)
          }
        } else {
          console.log('ℹ️ Nenhuma sessão ativa')
        }
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error)
      } finally {
        setIsLoading(false)
      }
    }

    verificarSessao()

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        handleLogout()
      } else if (event === 'SIGNED_IN' && session?.user) {
        const { data: cliente } = await supabase
          .from('clientes')
          .select('id, email')
          .eq('auth_id', session.user.id)
          .single()

        if (cliente) {
          setUserId(cliente.id)
          setIsAuthenticated(true)
        }
      } else if (event === 'USER_DELETED') {
        handleLogout()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = (clienteId: string, email: string) => {
    setUserId(clienteId)
    setIsAuthenticated(true)
  }

  const handleCadastro = (clienteId: string, email: string) => {
    setUserId(clienteId)
    setSaldoInicial(0)
    setCreditoInicial(0)
    setIsNewAccount(true)
    setIsAuthenticated(true)
    setMostrarCadastro(false)
  }

  const handleLogout = async () => {
    try {
      console.log('🚪 Fazendo logout...')
      await supabase.auth.signOut()
      console.log('✅ Logout realizado')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
    
    setIsAuthenticated(false)
    setUserId('')
    setSaldoInicial(undefined)
    setCreditoInicial(undefined)
    setIsNewAccount(false)
    localStorage.removeItem('clienteId')
    localStorage.removeItem('email')
  }

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="container-app flex items-center justify-center min-h-screen bg-white dark:bg-black">
          <div className="text-center">
            <img 
              src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" 
              alt="X88"
              className="w-20 h-20 mx-auto mb-4 animate-pulse"
            />
            <p className="text-neutral-500 dark:text-neutral-400">Carregando...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="container-app">
        {isAuthenticated ? (
          <Dashboard 
            onLogout={handleLogout} 
            dadosUsuario={null} 
            userId={userId}
            saldoInicial={saldoInicial}
            creditoInicial={creditoInicial}
            isNewAccount={isNewAccount}
          />
        ) : mostrarCadastro ? (
          <Cadastro onVoltar={() => setMostrarCadastro(false)} onCadastro={handleCadastro} />
        ) : (
          <Login onLogin={handleLogin} onMostrarCadastro={() => setMostrarCadastro(true)} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
