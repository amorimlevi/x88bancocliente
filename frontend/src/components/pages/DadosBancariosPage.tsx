import { useState } from 'react'
import { ArrowLeftIcon, CreditCardIcon } from '../ui/Icons'

interface DadosBancariosPageProps {
  onVoltar: () => void
  dadosBancarios: {
    iban: string
    titular: string
    banco: string
    nib: string
    mbWay: string
  }
  onSalvar: (dados: { iban: string; titular: string; banco: string; nib: string; mbWay: string }) => void
}

const DadosBancariosPage = ({ onVoltar, dadosBancarios, onSalvar }: DadosBancariosPageProps) => {
  const [modoEdicao, setModoEdicao] = useState(false)
  const [dadosTemp, setDadosTemp] = useState(dadosBancarios)

  const handleEditar = () => {
    setModoEdicao(true)
    setDadosTemp(dadosBancarios)
  }

  const handleCancelar = () => {
    setModoEdicao(false)
    setDadosTemp(dadosBancarios)
  }

  const handleSalvar = () => {
    onSalvar(dadosTemp)
    setModoEdicao(false)
    onVoltar()
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
          <h1 className="text-white text-2xl font-bold mb-2">Dados Bancários</h1>
          <p className="text-white/90 text-sm">Gerencie suas informações de pagamento</p>
        </div>

        {/* Content */}
        <div className="px-4 mt-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center">
                <CreditCardIcon size="md" className="text-white" />
              </div>
              <div>
                <p className="text-black dark:text-white font-bold text-lg">Conta Principal</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs">Para receber saques</p>
              </div>
            </div>

            {/* IBAN */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">IBAN</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={dadosTemp.iban}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, iban: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white font-mono text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="PT50 0000 0000 0000 0000 0000 0"
                />
              ) : (
                <p className="text-black dark:text-white font-medium font-mono">{dadosBancarios.iban || 'Não informado'}</p>
              )}
            </div>

            {/* Titular */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">Titular da Conta</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={dadosTemp.titular}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, titular: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Nome completo"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{dadosBancarios.titular || 'Não informado'}</p>
              )}
            </div>

            {/* Banco */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">Banco</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={dadosTemp.banco}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, banco: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Nome do banco"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{dadosBancarios.banco || 'Não informado'}</p>
              )}
            </div>

            {/* NIB */}
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">NIB</label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={dadosTemp.nib}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, nib: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white font-mono text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="0000 0000 0000 0000 0000 0"
                />
              ) : (
                <p className="text-black dark:text-white font-medium font-mono">{dadosBancarios.nib || 'Não informado'}</p>
              )}
            </div>

            {/* MB Way */}
            <div className="p-4">
              <label className="text-neutral-500 dark:text-neutral-400 text-xs mb-2 block">MB Way</label>
              {modoEdicao ? (
                <input
                  type="tel"
                  value={dadosTemp.mbWay}
                  onChange={(e) => setDadosTemp({ ...dadosTemp, mbWay: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 text-black dark:text-white text-sm px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="+351 900 000 000"
                />
              ) : (
                <p className="text-black dark:text-white font-medium">{dadosBancarios.mbWay || 'Não informado'}</p>
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
                Editar Dados Bancários
              </button>
            )}
          </div>

          {/* Informação de Segurança */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-300 text-sm font-medium mb-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Seus dados estão seguros
              </p>
            <p className="text-blue-800 dark:text-blue-400 text-xs">
              Todas as informações bancárias são criptografadas e protegidas conforme as normas de segurança bancária em Portugal.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DadosBancariosPage
