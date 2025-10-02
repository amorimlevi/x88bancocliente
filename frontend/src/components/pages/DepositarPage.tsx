import { useState } from 'react'
import { ArrowLeftIcon } from '../ui/Icons'

interface DepositarPageProps {
  onVoltar: () => void
}

const DepositarPage = ({ onVoltar }: DepositarPageProps) => {
  const [abaAtiva, setAbaAtiva] = useState('recomendacao')

  return (
    <div className="h-full bg-neutral-900 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={onVoltar}
          className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center"
        >
          <ArrowLeftIcon size="md" className="text-white" />
        </button>
        <h1 className="text-white text-xl font-semibold">Depositar</h1>
        <button className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 px-5 border-b border-neutral-800 mb-6">
        <button
          onClick={() => setAbaAtiva('recomendacao')}
          className={`pb-3 font-semibold transition-all relative ${
            abaAtiva === 'recomendacao'
              ? 'text-white'
              : 'text-neutral-500'
          }`}
        >
          Recomendação
          {abaAtiva === 'recomendacao' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"></div>
          )}
        </button>
        <button
          onClick={() => setAbaAtiva('em-andamento')}
          className={`pb-3 font-semibold transition-all relative ${
            abaAtiva === 'em-andamento'
              ? 'text-white'
              : 'text-neutral-500'
          }`}
        >
          Em Andamento
          {abaAtiva === 'em-andamento' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"></div>
          )}
        </button>
      </div>

      {/* Conteúdo */}
      <div className="px-5 space-y-4">
        {/* Plano 1 */}
        <div className="bg-neutral-800 rounded-3xl p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-400 text-sm mb-2">A partir de</p>
              <p className="text-white text-2xl font-bold mb-1">€1.218.000,00</p>
              <div className="flex items-baseline gap-2">
                <p className="text-brand-500 text-5xl font-bold">7%</p>
                <p className="text-neutral-400 text-sm">5 Meses</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-transparent border-2 border-brand-500 text-brand-500 font-semibold py-3 rounded-xl hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2">
            <span>Abrir Depósito</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Plano 2 */}
        <div className="bg-neutral-800 rounded-3xl p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-400 text-sm mb-2">A partir de</p>
              <p className="text-white text-2xl font-bold mb-1">€2.318.000,00</p>
              <div className="flex items-baseline gap-2">
                <p className="text-brand-500 text-5xl font-bold">3%</p>
                <p className="text-neutral-400 text-sm">2 Meses</p>
              </div>
            </div>
          </div>
          <button className="w-full bg-transparent border-2 border-brand-500 text-brand-500 font-semibold py-3 rounded-xl hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2">
            <span>Abrir Depósito</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Estatísticas de Depósito */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Minhas Estatísticas de Depósito</h3>
          
          <div className="bg-neutral-800 rounded-3xl p-5">
            <p className="text-neutral-400 text-sm mb-4">Depósito Estatístico</p>
            
            {/* Gráfico Simples */}
            <div className="relative h-40 mb-4">
              <svg className="w-full h-full" viewBox="0 0 300 160">
                {/* Grid lines */}
                <line x1="0" y1="40" x2="300" y2="40" stroke="#374151" strokeDasharray="5,5" strokeWidth="1"/>
                <line x1="0" y1="80" x2="300" y2="80" stroke="#374151" strokeDasharray="5,5" strokeWidth="1"/>
                <line x1="0" y1="120" x2="300" y2="120" stroke="#374151" strokeDasharray="5,5" strokeWidth="1"/>
                
                {/* Linha do gráfico */}
                <path
                  d="M 0 120 L 50 100 L 100 90 L 150 70 L 200 60 L 250 50 L 300 40"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Ponto destacado */}
                <circle cx="200" cy="60" r="6" fill="#22c55e"/>
                <circle cx="200" cy="60" r="4" fill="#000"/>
              </svg>
              
              {/* Labels do eixo X */}
              <div className="flex justify-between mt-2 px-2">
                <span className="text-neutral-500 text-xs">5.00</span>
                <span className="text-neutral-500 text-xs">6.00</span>
                <span className="text-neutral-500 text-xs">7.00</span>
                <span className="text-neutral-500 text-xs">8.00</span>
                <span className="text-neutral-500 text-xs">9.00</span>
                <span className="text-neutral-500 text-xs">10.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepositarPage
