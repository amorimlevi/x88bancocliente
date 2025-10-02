import { useState } from 'react'
import { ArrowLeftIcon, MapPinIcon } from '../ui/Icons'

interface EnderecoPageProps {
  onVoltar: () => void
}

const EnderecoPage = ({ onVoltar }: EnderecoPageProps) => {
  const [endereco, setEndereco] = useState({
    morada: 'Rua da Liberdade, 123, 2º Andar',
    codigoPostal: '1250-142',
    cidade: 'Lisboa',
    distrito: 'Lisboa',
    pais: 'Portugal'
  })

  const [modoEdicao, setModoEdicao] = useState(false)
  const [enderecoTemp, setEnderecoTemp] = useState(endereco)

  const handleEditar = () => {
    setModoEdicao(true)
    setEnderecoTemp(endereco)
  }

  const handleCancelar = () => {
    setModoEdicao(false)
    setEnderecoTemp(endereco)
  }

  const handleSalvar = () => {
    setEndereco(enderecoTemp)
    setModoEdicao(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-brand-500 px-4 pt-8 pb-6">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-white mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeftIcon size="md" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-white text-2xl font-bold mb-2">Endereço</h1>
          <p className="text-white/90 text-sm">Gerencie suas informações de endereço</p>
        </div>

        {/* Content */}
        <div className="px-4 mt-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center">
                <MapPinIcon size="md" className="text-white" />
              </div>
              <div>
                <p className="text-black dark:text-white font-bold text-lg">Endereço Principal</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">Para correspondências</p>
              </div>
            </div>

            {/* Morada */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">Morada</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={enderecoTemp.morada}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, morada: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Rua, número, andar"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{endereco.morada}</p>
              )}
            </div>

            {/* Código Postal */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">Código Postal</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={enderecoTemp.codigoPostal}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, codigoPostal: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="0000-000"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{endereco.codigoPostal}</p>
              )}
            </div>

            {/* Cidade */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">Cidade</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={enderecoTemp.cidade}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, cidade: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Cidade"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{endereco.cidade}</p>
              )}
            </div>

            {/* Distrito */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">Distrito</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={enderecoTemp.distrito}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, distrito: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Distrito"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{endereco.distrito}</p>
              )}
            </div>

            {/* País */}
            <div className="p-4">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">País</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={enderecoTemp.pais}
                  onChange={(e) => setEnderecoTemp({ ...enderecoTemp, pais: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="País"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{endereco.pais}</p>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="mt-6">
            {modoEdicao ? (
              <div className="flex gap-3">
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-2xl py-4 font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvar}
                  className="flex-1 bg-brand-500 text-white rounded-2xl py-4 font-semibold hover:bg-brand-600 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditar}
                className="w-full bg-brand-500 text-white rounded-2xl py-4 font-semibold hover:bg-brand-600 transition-colors"
              >
                Editar Endereço
              </button>
            )}
          </div>

          {/* Informação */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-300 text-sm font-medium mb-2">📍 Endereço de correspondência</p>
            <p className="text-blue-800 dark:text-blue-400 text-xs">
              Este endereço será usado para correspondências oficiais e verificação de identidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnderecoPage
