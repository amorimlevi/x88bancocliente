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

  // Verificar sessão e escutar mudanças de autenticação
  useEffect(() => {
    let mounted = true
    let checkInterval: any
    
    // Timeout de segurança - máximo 2s de espera
    const timeout = setTimeout(() => {
      if (mounted) {
        setIsLoading(false)
      }
    }, 2000)

    // Verificar sessão existente e se usuário ainda existe
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        // Se houver erro ou não houver sessão, desloga
        if (error || !session?.user) {
          if (isAuthenticated) {
            setIsAuthenticated(false)
            setUserId('')
            setSaldoInicial(undefined)
            setCreditoInicial(undefined)
            setIsNewAccount(false)
          }
          return
        }

        // Verificar se o cliente ainda existe no banco
        const { data, error: clienteError } = await supabase
          .from('clientes')
          .select('id')
          .eq('auth_id', session.user.id)
          .maybeSingle()

        if (!mounted) return

        // Se cliente não existe mais, desloga
        if (clienteError || !data) {
          if (isAuthenticated) {
            setIsAuthenticated(false)
            setUserId('')
            setSaldoInicial(undefined)
            setCreditoInicial(undefined)
            setIsNewAccount(false)
          }
        } else if (data) {
          setUserId(data.id)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        if (isAuthenticated) {
          setIsAuthenticated(false)
          setUserId('')
        }
      } finally {
        if (mounted) {
          clearTimeout(timeout)
          setIsLoading(false)
        }
      }
    }

    // Verificação inicial
    checkSession()

    // Verificar sessão a cada 3 segundos (detecta quando usuário é deletado do Supabase)
    checkInterval = setInterval(() => {
      if (mounted && isAuthenticated) {
        checkSession()
      }
    }, 3000)

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false)
        setUserId('')
        setSaldoInicial(undefined)
        setCreditoInicial(undefined)
        setIsNewAccount(false)
      }
    })

    // Verificar quando a janela ganha foco
    const handleFocus = () => {
      if (mounted) {
        checkSession()
      }
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      mounted = false
      clearTimeout(timeout)
      clearInterval(checkInterval)
      subscription.unsubscribe()
      window.removeEventListener('focus', handleFocus)
    }
  }, [isAuthenticated])

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
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUserId('')
    setSaldoInicial(undefined)
    setCreditoInicial(undefined)
    setIsNewAccount(false)
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
