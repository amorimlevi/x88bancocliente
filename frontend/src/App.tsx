import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  return (
    <ThemeProvider>
      <div className="container-app">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default App
