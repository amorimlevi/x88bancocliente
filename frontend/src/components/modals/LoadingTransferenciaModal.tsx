import React, { useState, useEffect } from 'react';

interface LoadingTransferenciaModalProps {
  isOpen: boolean;
  status: 'enviando' | 'enviado' | 'erro';
  mensagemErro?: string;
}

const LoadingTransferenciaModal: React.FC<LoadingTransferenciaModalProps> = ({
  isOpen,
  status,
  mensagemErro
}) => {
  const [progress, setProgress] = useState(0);

  // Resetar progress quando o modal abrir
  useEffect(() => {
    if (isOpen && status === 'enviando') {
      setProgress(0);
    }
  }, [isOpen, status]);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    if (status === 'enviando') {
      const startTime = Date.now();
      const duration = 5000; // 5 segundos total
      let animationFrameId: number;
      
      const updateProgress = () => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(percentage);
        
        if (percentage < 100) {
          animationFrameId = requestAnimationFrame(updateProgress);
        }
      };
      
      animationFrameId = requestAnimationFrame(updateProgress);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    } else if (status === 'enviado') {
      setProgress(100);
    } else if (status === 'erro') {
      setProgress(0);
    }
  }, [status, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        {status === 'enviando' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Processando...</h3>
            <p className="text-gray-600 text-sm">Aguarde enquanto processamos sua transferência</p>
            
            {/* Barra de progresso adicional estilo Nubank */}
            <div className="mt-6 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                style={{ width: `${progress}%`, transition: 'none' }}
              ></div>
            </div>
          </>
        )}

        {status === 'enviado' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Enviado!</h3>
            <p className="text-gray-600 text-sm">Transferência realizada com sucesso</p>
          </>
        )}

        {status === 'erro' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Erro!</h3>
            <p className="text-gray-600 text-sm">{mensagemErro || 'Ocorreu um erro ao processar a transferência'}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingTransferenciaModal;
