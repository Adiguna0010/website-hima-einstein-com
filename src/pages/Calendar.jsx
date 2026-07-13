import React, { useState } from 'react';
import { Calendar as CalendarIcon, Info, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

export default function Calendar({ showToast }) {
  // Calendar Event Data
  const events = {
    '2026-07-15': { title: 'Einstein Festival (E-Fest) 🚀', type: 'hima', desc: 'Festival teknologi, seminar instrumentasi nuklir, dan pameran proyek IoT mahasiswa Elins.' },
    '2026-07-20': { title: 'Ristek Mengajar Sebaya 🔬', type: 'hima', desc: 'Bimbingan belajar internal persuratan pemrograman C++ dan Elektronika dasar untuk mahasiswa baru.' },
    '2026-07-24': { title: 'Musyawarah Perwakilan Mahasiswa 🏛️', type: 'ormawa', desc: 'Sidang evaluasi program kerja ormawa eksternal kampus Politeknik Teknologi Nuklir Indonesia.' },
    '2026-07-28': { title: 'Evaluasi Tengah Tahun Kabinet 🪙', type: 'hima', desc: 'Pemaparan laporan pertanggungjawaban setengah tahun Kabinet Phótisma.' }
  };

  const [activeDate, setActiveDate] = useState('2026-07-15');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed: 6)

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // July 2026 grid generation helper
  // 1 July 2026 starts on Wednesday (offset 2 in 0-indexed Sun-Sat week)
  const daysInMonth = 31;
  const startOffset = 3; // Wednesday (Sunday:0, Monday:1, Tuesday:2, Wednesday:3)
  const daysArray = [];

  // Previous month padding days
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
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-electricCyan/5 glow-orb"></div>

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-electricCyan uppercase tracking-widest">Agenda & Timeline Kegiatan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white">EINSTEIN KALENDER</h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
          Pantau jadwal program kerja HIMA EINSTEIN serta agenda ormawa eksternal kampus Politeknik Teknologi Nuklir Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        
        {/* Left Column: Legend and details */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Info className="w-4.5 h-4.5 text-electricCyan" /> Detail Agenda Terpilih
          </h3>

          {/* Active Event Display */}
          <div className="glass border border-white/10 rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-electricCyan/5 rounded-full blur-xl"></div>
            
            {activeEvent ? (
              <div className="space-y-3 relative z-10">
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                  activeEvent.type === 'hima' 
                    ? 'bg-limeGreen/10 text-limeGreen border-limeGreen/20' 
                    : 'bg-electricBlue/10 text-electricCyan border-electricBlue/20'
                }`}>
                  {activeEvent.type === 'hima' ? 'HIMA EINSTEIN' : 'ORMAWA Kampus'}
                </span>
                
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{activeEvent.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold font-mono">
                  Tanggal: {activeDate.split('-').reverse().join('/')}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  {activeEvent.desc}
                </p>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 text-slate-500">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs leading-normal max-w-xs mx-auto">
                  Pilih tanggal berwarna hijau atau biru pada kalender untuk melihat detail rencana program kerja.
                </p>
              </div>
            )}
          </div>

          {/* Legend panel */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Keterangan Warna</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-limeGreen shrink-0"></span>
              <span className="text-slate-300">Agenda Internal HIMA EINSTEIN</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-electricBlue shrink-0"></span>
              <span className="text-slate-300">Agenda ORMAWA Kampus Eksternal</span>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Widget */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-electricCyan" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">
                {monthNames[currentMonth]} {currentYear}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => showToast('Navigasi bulan terkunci pada Juli 2026 (Kabinet Phótisma)', 'info')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => showToast('Navigasi bulan terkunci pada Juli 2026 (Kabinet Phótisma)', 'info')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="glass border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            
            {/* Days header */}
            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
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
                        ? 'cursor-pointer hover:bg-white/5 border border-transparent' 
                        : 'text-slate-700 pointer-events-none'
                    } ${
                      isSelected && hasEvent 
                        ? 'bg-electricBlue/20 border-electricCyan/50 scale-[1.03]' 
                        : ''
                    } ${
                      hasEvent && !isSelected
                        ? cell.event.type === 'hima'
                          ? 'border-limeGreen/30 bg-limeGreen/5'
                          : 'border-electricBlue/30 bg-electricBlue/5'
                        : ''
                    }`}
                  >
                    <span className={`text-xs font-bold text-left ${
                      cell.currentMonth 
                        ? isSelected 
                          ? 'text-electricCyan' 
                          : 'text-slate-300' 
                        : 'text-slate-700'
                    }`}>
                      {cell.dayNum}
                    </span>

                    {/* Event indicators dots */}
                    {hasEvent && (
                      <div className="flex justify-end items-center mt-auto">
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          cell.event.type === 'hima' ? 'bg-limeGreen shadow-[0_0_8px_rgba(163,230,53,0.8)]' : 'bg-electricBlue shadow-[0_0_8px_rgba(0,82,255,0.8)]'
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
