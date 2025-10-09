import React from 'react'

interface Acao {
  id: string
  icone: React.ReactNode
  titulo: string
  cor: string
  corIcone?: string
  onClick: () => void
}

interface AcoesRapidasProps {
  acoes: Acao[]
}

const AcoesRapidas: React.FC<AcoesRapidasProps> = ({ acoes }) => {
  return (
    <div className="bg-white dark:bg-black py-4">
      <h3 className="px-4 mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
        Pro dia a dia
      </h3>
      
      {/* Container com scroll horizontal */}
      <div 
        className="flex gap-3 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {acoes.map((acao) => (
          <button
            key={acao.id}
            onClick={acao.onClick}
            className="flex-shrink-0 snap-start group"
          >
            <div className="flex flex-col items-center gap-2.5 w-[100px]">
              {/* Botão Retangular - Estilo PicPay */}
              <div 
                className="w-[100px] h-[80px] rounded-[20px] flex items-center justify-center transition-all active:scale-95 group-hover:shadow-md"
                style={{ backgroundColor: acao.cor }}
              >
                <div style={{ color: acao.corIcone || '#000000' }}>
                  {acao.icone}
                </div>
              </div>
              
              {/* Título */}
              <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 text-center leading-tight max-w-full">
                {acao.titulo}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default AcoesRapidas
