import { useState } from 'react'
import { XIcon, PlusIcon } from '../ui/Icons'

interface NovaSolicitacaoProps {
  onClose: () => void
  onSubmit: (valor: number, motivo: string) => void
}

const NovaSolicitacao = ({ onClose, onSubmit }: NovaSolicitacaoProps) => {
  const [valor, setValor] = useState('')
  const [motivo, setMotivo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (valor && motivo) {
      onSubmit(Number(valor), motivo)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="heading-3">Nova Solicitação</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <XIcon size="md" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Valor */}
          <div>
            <label htmlFor="valor" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
              Valor (€)
            </label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="input w-full text-lg"
              placeholder="0"
              min="1"
              required
            />
          </div>

          {/* Motivo */}
          <div>
            <label htmlFor="motivo" className="block text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
              Motivo da Solicitação
            </label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="input w-full min-h-[120px] resize-none"
              placeholder="Descreva o motivo da solicitação..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <PlusIcon size="md" />
              <span>Solicitar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NovaSolicitacao
