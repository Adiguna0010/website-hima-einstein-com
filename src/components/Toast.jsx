import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
    error: 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]',
    info: 'bg-slate-900/90 border-electricBlue/50 text-slate-200 shadow-[0_0_15px_-3px_rgba(0,82,255,0.3)]',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-electricCyan shrink-0" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg transition-all duration-300 animate-slide-in ${typeStyles[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium pr-2 max-w-xs">{message}</p>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
