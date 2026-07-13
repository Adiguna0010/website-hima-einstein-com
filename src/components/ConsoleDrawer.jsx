import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function ConsoleDrawer({ isOpen, onClose, title, icon, description, children }) {
  // Lock scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md md:max-w-lg glass-glow text-slate-100 flex flex-col justify-between shadow-2xl relative animate-slide-in h-full">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <h3 className="text-lg font-bold text-electricCyan uppercase tracking-wider">{title}</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed font-light">{description}</p>
            <div className="border-t border-white/5 pt-6">
              {children}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/5 bg-obsidian-deep/50 text-center">
            <span className="text-[10px] text-slate-500 tracking-widest uppercase font-mono">
              EINSTEIN SPHERE CONSOLE v2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
