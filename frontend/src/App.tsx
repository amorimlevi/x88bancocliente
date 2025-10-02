import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/auth/Login'
import Cadastro from './components/auth/Cadastro'
import Dashboard from './components/dashboard/Dashboard'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mostrarCadastro, setMostrarCadastro] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleCadastro = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
    setMostrarCadastro(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail('')
  }

  return (
    <ThemeProvider>
      <div className="container-app">
        {isAuthenticated ? (
          <Dashboard onLogout={handleLogout} />
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
