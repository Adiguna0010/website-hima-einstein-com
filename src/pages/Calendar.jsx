import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function Calendar({ showToast }) {
  const DEFAULT_EVENTS = {};

  const [events, setEvents] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('hima_calendar_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    } else {
      localStorage.setItem('hima_calendar_events', JSON.stringify(DEFAULT_EVENTS));
      setEvents(DEFAULT_EVENTS);
    }
  }, []);

  const [activeDate, setActiveDate] = useState('2026-07-15');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed: 6)

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // July 2026 grid generation helper
  const daysInMonth = 31;
  const daysArray = [];

  // Previous month padding days (June ends on Tuesday, July starts on Wed)
  for (let i = 28; i <= 30; i++) {
    daysArray.push({ dayNum: i, currentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-0${currentMonth + 1}-${i < 10 ? '0' + i : i}`;
    daysArray.push({
      dayNum: i,
      currentMonth: true,
      dateString: dateStr,
      event: events[dateStr]
    });
  }

  // Next month padding days
  for (let i = 1; i <= 8; i++) {
    daysArray.push({ dayNum: i, currentMonth: false });
  }

  const handleCellClick = (cell) => {
    if (cell.currentMonth && cell.event) {
      setActiveDate(cell.dateString);
      showToast(`Event Terpilih: ${cell.event.title}`, 'info');
    }
  };

  const activeEvent = events[activeDate];

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gold/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">Agenda & Timeline Kegiatan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900">EINSTEN KALENDER</h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Pantau jadwal program kerja HIMA EINSTEN serta agenda ormawa eksternal kampus Politeknik Teknologi Nuklir Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Legend and details */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-3">
            <Info className="w-4.5 h-4.5 text-gold" /> Detail Agenda Terpilih
          </h3>

          {/* Active Event Display */}
          <div className="bg-white border border-gold-border rounded-2xl p-6 relative overflow-hidden space-y-4 shadow-md">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gold/5 rounded-full blur-xl"></div>
            
            {activeEvent ? (
              <div className="space-y-3 relative z-10">
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                  activeEvent.type === 'hima' 
                    ? 'bg-gold/10 text-gold-dark border-gold/20' 
                    : 'bg-slate-100 text-gold border border-gold-border'
                }`}>
                  {activeEvent.type === 'hima' ? 'HIMA EINSTEN' : 'ORMAWA Kampus'}
                </span>
                
                <h4 className="text-sm font-bold text-slate-950 uppercase tracking-wider">{activeEvent.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold font-mono">
                  Tanggal: {activeDate.split('-').reverse().join('/')}
                </p>
                {activeEvent.location && (
                  <p className="text-[10px] text-slate-550 font-semibold font-sans">
                    Tempat: <span className="text-slate-800">{activeEvent.location}</span>
                  </p>
                )}
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                  {activeEvent.desc}
                </p>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 text-slate-500">
                <HelpCircle className="w-10 h-10 text-slate-350 mx-auto" />
                <p className="text-xs leading-normal max-w-xs mx-auto">
                  Pilih tanggal berwarna emas pada kalender untuk melihat detail rencana program kerja.
                </p>
              </div>
            )}
          </div>

          {/* Legend panel */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Keterangan Warna</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gold shrink-0"></span>
              <span className="text-slate-700">Agenda Internal HIMA EINSTEN</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gold-light shrink-0"></span>
              <span className="text-slate-700">Agenda ORMAWA Kampus Eksternal</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Widget */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between bg-white border border-gold-border p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gold" />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {monthNames[currentMonth]} {currentYear}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => showToast('Navigasi bulan terkunci pada Juli 2026 (Kabinet Phótisma)', 'info')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => showToast('Navigasi bulan terkunci pada Juli 2026 (Kabinet Phótisma)', 'info')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="bg-white border border-gold-border rounded-2xl p-6 shadow-md space-y-4">
            
            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-550">
              <span>Ming</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
            </div>

            {/* Monthly grid */}
            <div className="grid grid-cols-7 gap-2">
              {daysArray.map((cell, idx) => {
                const hasEvent = cell.currentMonth && cell.event;
                const isSelected = cell.dateString === activeDate;

                return (
                  <div
                    key={idx}
                    onClick={() => handleCellClick(cell)}
                    className={`aspect-square rounded-xl p-2 flex flex-col justify-between transition-all ${
                      cell.currentMonth 
                        ? 'cursor-pointer hover:bg-slate-50 border border-transparent' 
                        : 'text-slate-300 pointer-events-none'
                    } ${
                      isSelected && hasEvent 
                        ? 'bg-gold/20 border-gold/50 scale-[1.03]' 
                        : ''
                    } ${
                      hasEvent && !isSelected
                        ? cell.event.type === 'hima'
                          ? 'border-gold/30 bg-gold/5'
                          : 'border-gold-light/30 bg-gold-light/5'
                        : ''
                    }`}
                  >
                    <span className={`text-xs font-bold text-left ${
                      cell.currentMonth 
                        ? isSelected 
                          ? 'text-gold-dark font-extrabold' 
                          : 'text-slate-700' 
                        : 'text-slate-300'
                    }`}>
                      {cell.dayNum}
                    </span>

                    {/* Event indicators dots */}
                    {hasEvent && (
                      <div className="flex justify-end items-center mt-auto">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          cell.event.type === 'hima' ? 'bg-gold-dark shadow-[0_0_8px_rgba(170,124,17,0.4)]' : 'bg-gold-light shadow-[0_0_8px_rgba(212,175,55,0.4)]'
                        }`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
