import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Timer, Vote, HelpCircle, ArrowRight, Sparkles, Send } from 'lucide-react';

export default function Election({ showToast }) {
  const navigate = useNavigate();
  const [nomineeName, setNomineeName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleNominateSubmit = (e) => {
    e.preventDefault();
    if (!nomineeName.trim()) {
      showToast('Please enter a valid candidate name!', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      showToast(`Thank you! Your recommendation for "${nomineeName}" has been submitted to the Election Committee.`, 'success');
      setNomineeName('');
      setIsSubmitting(false);
    }, 800);
  };

  const timelinePhases = [
    {
      num: '01',
      title: 'Candidate Registration',
      date: 'Aug 10 - Aug 25, 2026',
      status: 'upcoming',
      desc: 'Submission of formal registration, administrative verification, and eligibility checks.'
    },
    {
      num: '02',
      title: 'Campaign & Debates',
      date: 'Sep 05 - Sep 20, 2026',
      status: 'upcoming',
      desc: 'Public declaration of vision, cabinet structure proposals, and open political debates.'
    },
    {
      num: '03',
      title: 'The Voting Day',
      date: 'Oct 01, 2026',
      status: 'upcoming',
      desc: 'Secure digital voting open to all active HIMA Einsten student members.'
    }
  ];

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

      {/* Timeline Phases Section */}
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
          <Timer className="w-4.5 h-4.5 text-gold animate-spin-slow" /> ELECTION ROADMAP & TIMELINE
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timelinePhases.map((phase) => (
            <div key={phase.num} className="bg-white border border-slate-200 hover:border-gold/30 p-5 rounded-2xl shadow-sm space-y-3 transition-colors relative group">
              <span className="absolute top-4 right-4 text-xs font-mono font-extrabold text-slate-250 group-hover:text-gold/20 select-none">
                PH_{phase.num}
              </span>
              <span className="inline-block px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[9px] font-mono text-slate-500">
                {phase.date}
              </span>
              <h4 className="text-xs font-bold text-slate-900 uppercase">{phase.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-light font-sans">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Recommendation Box */}
      <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-1.5">
            <Vote className="w-4 h-4 text-gold" /> Who is your choice?
          </h3>
          <p className="text-[11px] text-slate-500 font-light leading-relaxed font-sans max-w-lg">
            Do you have a potential candidate in mind for President of HIMA Einsten 2027? Recommend them to the Election Committee so we can contact them for verification.
          </p>
        </div>

        <div className="md:col-span-5 w-full">
          <form onSubmit={handleNominateSubmit} className="flex gap-2 w-full">
            <input 
              type="text" 
              required
              placeholder="Candidate's Name..."
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold transition-colors font-sans"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-gold text-white font-bold rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shadow-md shadow-gold/20 shrink-0 uppercase tracking-wider"
            >
              Submit <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
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
