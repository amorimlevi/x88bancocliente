import { useState, useEffect } from 'react'
import { WalletIcon, UserPlusIcon } from '../ui/Icons'
import { buscarDestinatarioPorIdCarteira } from '../../services/supabaseService'

interface TransferirX88PageProps {
  saldoDisponivel: number
  onSubmit: (destinatarioId: string, valor: number, destinatarioNome?: string) => void
  userId?: string
}

interface UsuarioDestinatario {
  id: string
  nome: string
  email: string
}

const TransferirX88Page = ({ saldoDisponivel, onSubmit, userId = '0001' }: TransferirX88PageProps) => {
  const [destinatarioId, setDestinatarioId] = useState('')
  const [valorX88, setValorX88] = useState('')
  const [mensagemSucesso, setMensagemSucesso] = useState(false)
  const [usuarioDestinatario, setUsuarioDestinatario] = useState<UsuarioDestinatario | null>(null)
  const [buscandoUsuario, setBuscandoUsuario] = useState(false)
  const [erroUsuario, setErroUsuario] = useState('')

  useEffect(() => {
    const buscarUsuario = async () => {
      if (destinatarioId.length === 6) {
        setBuscandoUsuario(true)
        setErroUsuario('')
        setUsuarioDestinatario(null)
        
        try {
          const result = await buscarDestinatarioPorIdCarteira(destinatarioId)
          
          if (result.success && result.destinatario) {
            setUsuarioDestinatario({
              id: result.destinatario.id,
              nome: result.destinatario.nome,
              email: result.destinatario.email
            })
          } else {
            setErroUsuario(result.error || 'Usuário não encontrado')
          }
        } catch (error) {
          setErroUsuario('Erro ao buscar usuário')
        } finally {
          setBuscandoUsuario(false)
        }
      } else {
        setUsuarioDestinatario(null)
        setErroUsuario('')
      }
    }

    const timer = setTimeout(buscarUsuario, 500)
    return () => clearTimeout(timer)
  }, [destinatarioId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (destinatarioId && valorX88 && Number(valorX88) > 0) {
      if (Number(valorX88) > saldoDisponivel) {
        alert('Saldo insuficiente!')
        return
      }
      onSubmit(destinatarioId, Number(valorX88), usuarioDestinatario?.nome)
      setMensagemSucesso(true)
      setTimeout(() => setMensagemSucesso(false), 3000)
      setDestinatarioId('')
      setValorX88('')
      setUsuarioDestinatario(null)
    }
  }

  const definirValorRapido = (percentual: number) => {
    const valor = Math.floor((saldoDisponivel * percentual) / 100)
    setValorX88(valor.toString())
  }

  return (
    <div className="p-4 bg-white dark:bg-black min-h-full">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <img 
            src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759416402/Design_sem_nome_9_z13spl.png" 
            alt="X88"
            className="w-13 h-12 object-contain"
          />
          <h1 className="text-2xl font-bold text-black dark:text-white">Transferir X88</h1>
        </div>

        {/* Saldo Disponível */}
        <div className="mb-3">
          <div className="rounded-2xl p-6 shadow-md relative" style={{ backgroundColor: '#15FF5D', borderColor: '#15FF5D' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-black text-sm font-medium">Saldo Disponível</p>
              <WalletIcon size="sm" className="text-black" />
            </div>
            
            <div className="mb-3">
              <p className="text-black text-5xl font-bold leading-none mb-2">
                {saldoDisponivel.toLocaleString('pt-PT')} 
              </p>
              <p className="text-black/90 text-lg">
                
              </p>
            </div>

            <div className="absolute bottom-4 right-4">
              <img 
                src="https://res.cloudinary.com/dxchbdcai/image/upload/v1759251700/LOGOTIPO_X88_BLACK_PNG.fw_zpepci.png" 
                alt="X88"
                className="w-14 h-9 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Conta do Cliente */}
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl mb-6 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Sua Conta</p>
          <p className="text-lg font-bold text-black dark:text-white font-mono tracking-wider">
            {userId}
          </p>
        </div>

        {/* Mensagem de Sucesso */}
        {mensagemSucesso && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-xl p-4 mb-4">
            <p className="text-green-800 dark:text-green-200 text-sm font-medium text-center">
              ✓ Transferência realizada com sucesso!
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conta do Destinatário */}
          <div>
            <label htmlFor="destinatarioId" className="block text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
              <UserPlusIcon size="sm" />
              Conta do Destinatário
            </label>
            <input
              type="text"
              id="destinatarioId"
              value={destinatarioId}
              onChange={(e) => setDestinatarioId(e.target.value)}
              className="input w-full text-lg"
              placeholder="Digite a conta do destinatário"
              maxLength={6}
              required
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
              <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Insira o ID de 6 dígitos da pessoa que receberá o X88
            </p>

            {/* Carregando */}
            {buscandoUsuario && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <svg className="w-4 h-4 inline mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscando usuário...
                </p>
              </div>
            )}

            {/* Usuário Encontrado */}
            {usuarioDestinatario && (
              <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
                  ✓ Usuário encontrado
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <span className="font-semibold">Nome:</span> {usuarioDestinatario.nome}
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <span className="font-semibold">Conta:</span> <span className="font-mono">{usuarioDestinatario.id}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Erro */}
            {erroUsuario && !buscandoUsuario && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  ❌ {erroUsuario}
                </p>
              </div>
            )}
          </div>

          {/* Valor X88 */}
          <div>
            <label htmlFor="valorX88" className="block text-sm font-semibold text-black dark:text-white mb-3">
              Quanto deseja transferir? (X88)
            </label>
            <input
              type="number"
              id="valorX88"
              value={valorX88}
              onChange={(e) => setValorX88(e.target.value)}
              className="input w-full text-lg"
              placeholder="0"
              min="1"
              max={saldoDisponivel}
              required
            />

            
          </div>

          {/* Resumo da Transferência */}
          {destinatarioId && valorX88 && Number(valorX88) > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resumo da Transferência
              </p>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <p>• Destinatário: <span className="font-bold">{usuarioDestinatario ? usuarioDestinatario.nome : destinatarioId}</span> <span className="font-mono font-bold">({destinatarioId})</span></p>
                <p>• Valor: <span className="font-bold">{Number(valorX88).toLocaleString('pt-PT')} X88</span></p>
                <p>• Saldo após transferência: <span className="font-bold">{(saldoDisponivel - Number(valorX88)).toLocaleString('pt-PT')} X88</span></p>
              </div>
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={!valorX88 || !destinatarioId || Number(valorX88) > saldoDisponivel}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Confirmar Transferência</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default TransferirX88Page
