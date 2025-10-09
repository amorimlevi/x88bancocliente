import React, { useState, useEffect } from 'react'
import { buscarDestinatarioPorIdCarteira } from '../../services/supabaseService'
import { supabase } from '../../lib/supabase'
import ComprovanteTransferenciaModal from './ComprovanteTransferenciaModal'

interface TransferirModalProps {
  isOpen: boolean
  onClose: () => void
  saldoDisponivel: number
  onSubmit: (destinatarioId: string, valor: number, destinatarioNome?: string, onSuccess?: (dados: any) => void) => void
  userId?: string
  remetenteConta?: string
  remetenteNome?: string
  remetenteEmail?: string
  remetenteTelefone?: string
}

interface UsuarioDestinatario {
  id: string
  nome: string
  email: string
}

const TransferirModal: React.FC<TransferirModalProps> = ({ 
  isOpen, 
  onClose, 
  saldoDisponivel, 
  onSubmit, 
  userId = '0001',
  remetenteConta = '0001',
  remetenteNome = 'Usuário',
  remetenteEmail,
  remetenteTelefone
}) => {
  const [destinatarioId, setDestinatarioId] = useState('')
  const [valorX88, setValorX88] = useState('')
  const [usuarioDestinatario, setUsuarioDestinatario] = useState<UsuarioDestinatario | null>(null)
  const [buscandoUsuario, setBuscandoUsuario] = useState(false)
  const [erroUsuario, setErroUsuario] = useState('')
  const [comprovanteAberto, setComprovanteAberto] = useState(false)
  const [dadosComprovante, setDadosComprovante] = useState<any>(null)
  const [contatosRecentes, setContatosRecentes] = useState<UsuarioDestinatario[]>([])
  const [mostrarContatos, setMostrarContatos] = useState(true)

  useEffect(() => {
    if (isOpen) {
      const contatos = localStorage.getItem(`contatos_recentes_${userId}`)
      if (contatos) {
        setContatosRecentes(JSON.parse(contatos))
      }
    }
  }, [isOpen, userId])

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
      
      onSubmit(destinatarioId, Number(valorX88), usuarioDestinatario?.nome, async () => {
        if (usuarioDestinatario) {
          const contatosAtualizados = [
            usuarioDestinatario,
            ...contatosRecentes.filter(c => c.id !== usuarioDestinatario.id)
          ].slice(0, 5)
          
          setContatosRecentes(contatosAtualizados)
          localStorage.setItem(`contatos_recentes_${userId}`, JSON.stringify(contatosAtualizados))
        }

        let destinatarioEmail = usuarioDestinatario?.email || ''
        let destinatarioTelefone = ''
        
        const infoDestinatario = await buscarDestinatarioPorIdCarteira(destinatarioId)
        if (infoDestinatario.success && infoDestinatario.destinatario) {
          const dest = infoDestinatario.destinatario
          
          if (dest.tipo === 'cliente' && dest.clienteId) {
            const { data } = await supabase
              .from('clientes')
              .select('email, telefone')
              .eq('id', dest.clienteId)
              .single()
            
            if (data) {
              destinatarioEmail = data.email || destinatarioEmail
              destinatarioTelefone = data.telefone || ''
            }
          }
        }
        
        setDadosComprovante({
          valor: Number(valorX88),
          destinatarioNome: usuarioDestinatario?.nome || 'Destinatário',
          destinatarioConta: destinatarioId,
          destinatarioEmail: destinatarioEmail,
          destinatarioTelefone: destinatarioTelefone,
          remetenteConta: remetenteConta,
          remetenteNome: remetenteNome,
          remetenteEmail: remetenteEmail,
          remetenteTelefone: remetenteTelefone
        })
        
        setDestinatarioId('')
        setValorX88('')
        setUsuarioDestinatario(null)
        setMostrarContatos(true)
        setComprovanteAberto(true)
      })
    }
  }

  const handleFechar = () => {
    setDestinatarioId('')
    setValorX88('')
    setUsuarioDestinatario(null)
    setErroUsuario('')
    setMostrarContatos(true)
    onClose()
  }

  const handleSelecionarContato = (contato: UsuarioDestinatario) => {
    setDestinatarioId(contato.id)
    setUsuarioDestinatario(contato)
    setMostrarContatos(false)
  }

  const definirValorRapido = (percentual: number) => {
    const valor = Math.floor((saldoDisponivel * percentual) / 100)
    setValorX88(valor.toString())
  }

  if (!isOpen) return null

  return (
    <>
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleFechar}
    >
      <div 
        className="bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">
                Transferir X88
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Envie para outro usuário
              </p>
            </div>
          </div>
          <button
            onClick={handleFechar}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Saldo Disponível */}
          <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800 rounded-2xl p-5">
            <p className="text-green-700 dark:text-green-300 text-sm font-medium mb-1">Saldo Disponível</p>
            <p className="text-green-900 dark:text-green-100 text-3xl font-bold">
              {saldoDisponivel.toLocaleString('pt-PT')} X88
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contatos Recentes */}
            {mostrarContatos && contatosRecentes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-black dark:text-white mb-3">
                  Contatos Recentes
                </label>
                <div className="space-y-2 mb-4">
                  {contatosRecentes.map((contato) => (
                    <button
                      key={contato.id}
                      type="button"
                      onClick={() => handleSelecionarContato(contato)}
                      className="w-full p-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl flex items-center gap-3 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {contato.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-black dark:text-white truncate">{contato.nome}</p>
                        <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
                          Conta: {contato.id}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400">ou digite a conta</span>
                  </div>
                </div>
              </div>
            )}

            {/* ID do Destinatário */}
            <div>
              <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                Conta do Destinatário
              </label>
              <input
                type="text"
                value={destinatarioId}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setDestinatarioId(valor)
                  setMostrarContatos(false)
                }}
                onFocus={() => setMostrarContatos(false)}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-lg font-mono font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
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
              {usuarioDestinatario && !buscandoUsuario && (
                <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-700 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-green-900 dark:text-green-100 truncate">{usuarioDestinatario.nome}</p>
                    <p className="text-xs text-green-700 dark:text-green-300 truncate">{usuarioDestinatario.email}</p>
                  </div>
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Erro */}
              {erroUsuario && !buscandoUsuario && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{erroUsuario}</p>
                </div>
              )}
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-semibold text-black dark:text-white mb-2">
                Valor
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={valorX88}
                  onChange={(e) => setValorX88(e.target.value)}
                  className="w-full px-4 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-2xl font-bold text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="1"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 font-semibold">
                  X88
                </span>
              </div>

              {/* Valores Rápidos */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[25, 50, 75, 100].map((percentual) => (
                  <button
                    key={percentual}
                    type="button"
                    onClick={() => definirValorRapido(percentual)}
                    className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    {percentual}%
                  </button>
                ))}
              </div>
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
                  <p>• Saldo após: <span className="font-bold">{(saldoDisponivel - Number(valorX88)).toLocaleString('pt-PT')} X88</span></p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={!destinatarioId || !valorX88 || Number(valorX88) <= 0 || Number(valorX88) > saldoDisponivel || !!erroUsuario}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-neutral-300 disabled:to-neutral-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg disabled:shadow-none"
              >
                Transferir X88
              </button>

              <button
                type="button"
                onClick={handleFechar}
                className="w-full py-3 px-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-semibold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* Modal de Comprovante - Fora do modal principal */}
    {comprovanteAberto && (
      <ComprovanteTransferenciaModal
        isOpen={comprovanteAberto}
        onClose={() => {
          setComprovanteAberto(false)
          onClose()
        }}
        dadosTransferencia={dadosComprovante}
      />
    )}
    </>
  )
}

export default TransferirModal
