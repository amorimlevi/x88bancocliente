import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/auth/Login'
import Cadastro, { DadosUsuario } from './components/auth/Cadastro'
import Dashboard from './components/dashboard/Dashboard'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mostrarCadastro, setMostrarCadastro] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [isAuthenticated, mostrarCadastro])
  const [dadosUsuario, setDadosUsuario] = useState<DadosUsuario | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [saldoInicial, setSaldoInicial] = useState<number | undefined>(undefined)
  const [creditoInicial, setCreditoInicial] = useState<number | undefined>(undefined)
  const [isNewAccount, setIsNewAccount] = useState(false)

  const handleLogin = (email: string) => {
    setIsAuthenticated(true)
  }

  const handleCadastro = async (dados: DadosUsuario) => {
    try {
      const response = await fetch('http://localhost:3002/api/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: dados.nome,
          email: dados.email,
          password: 'senha-temporaria'
        }),
      })

      const result = await response.json()

      if (result.success) {
        setUserId(result.user.id)
        setSaldoInicial(0)
        setCreditoInicial(0)
        setIsNewAccount(true)
        setDadosUsuario(dados)
        setIsAuthenticated(true)
        setMostrarCadastro(false)
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setDadosUsuario(null)
    setUserId('')
    setSaldoInicial(undefined)
    setCreditoInicial(undefined)
    setIsNewAccount(false)
  }

  return (
    <ThemeProvider>
      <div className="container-app">
        {isAuthenticated ? (
          <Dashboard 
            onLogout={handleLogout} 
            dadosUsuario={dadosUsuario} 
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
