import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, Sparkles } from 'lucide-react';

export default function Election({ showToast }) {
  const navigate = useNavigate();

  // Countdown timer to a simulated future election date
  const [timeLeft, setTimeLeft] = useState({
    days: 35,
    hours: 14,
    minutes: 42,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative pt-24 pb-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800 overflow-hidden">
      {/* Premium glowing orbs backgrounds */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      {/* Header Badge & Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-xs font-bold text-gold-dark tracking-wider uppercase animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-gold" /> HIMA EINSTEN GRAND ELECTION
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold uppercase text-slate-900 tracking-wider font-heading leading-tight">
          Who is the Next Leader of <span className="bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">Cabinet 2027?</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light max-w-2xl mx-auto">
          The search for the next President and Vice President of HIMA Einsten is about to begin. Who will carry the torch of Kabinet Phótisma and lead our generation forward?
        </p>
      </div>

      {/* Hero Coming Soon & Timer Grid */}
      <div className="max-w-4xl mx-auto bg-white border border-gold-border rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-center space-y-8">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/5 rounded-full blur-xl"></div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gold-dark uppercase tracking-widest block">Teaser Portal</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-950 uppercase tracking-widest">
            COMING SOON
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto rounded-full mt-3"></div>
        </div>

        {/* Live Countdown Clock */}
        <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-lg mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-5 flex flex-col justify-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 leading-none">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Days</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-5 flex flex-col justify-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Hours</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-5 flex flex-col justify-center">
            <span className="text-2xl sm:text-4xl font-extrabold font-mono text-slate-900 leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Mins</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 sm:p-5 flex flex-col justify-center border-gold/30 bg-gold/5">
            <span className="text-2xl sm:text-4xl font-extrabold font-mono text-gold-dark leading-none animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[9px] font-bold text-gold-dark uppercase tracking-wider mt-1.5">Secs</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 font-light max-w-md mx-auto leading-relaxed">
          The registration of Presidential candidates will officially open in a few weeks. Stay tuned to review their vision, mission, and structure.
        </p>
      </div>

      {/* Navigation Return CTA */}
      <div className="text-center pt-4">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all"
        >
          Return to Homepage <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
