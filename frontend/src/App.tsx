import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/auth/Login'
import Cadastro from './components/auth/Cadastro'
import Dashboard from './components/dashboard/Dashboard'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mostrarCadastro, setMostrarCadastro] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [isAuthenticated, mostrarCadastro])
  
  const [userId, setUserId] = useState<string>('')
  const [saldoInicial, setSaldoInicial] = useState<number | undefined>(undefined)
  const [creditoInicial, setCreditoInicial] = useState<number | undefined>(undefined)
  const [isNewAccount, setIsNewAccount] = useState(false)

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

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserId('')
    setSaldoInicial(undefined)
    setCreditoInicial(undefined)
    setIsNewAccount(false)
    localStorage.removeItem('clienteId')
    localStorage.removeItem('email')
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
