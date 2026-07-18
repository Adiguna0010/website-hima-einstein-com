import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Check, Users, AlertCircle, ShieldAlert, BarChart3, Info } from 'lucide-react';

export default function Election({ showToast }) {
  const { currentUser } = useAuth();
  const [votedPaslon, setVotedPaslon] = useState(null);
  const [activeTabMap, setActiveTabMap] = useState({ '01': 'visi', '02': 'visi' });

  // Dummy initial results (mock state that updates on vote)
  const [voteStats, setVoteStats] = useState({
    '01': 88,
    '02': 81
  });

  const candidates = [
    {
      number: '01',
      tagline: 'KABINET SINERGIS PRESISI',
      kahim: 'M. Iqbal Nur Huda',
      wakahim: 'Nailah Qarirah',
      visi: 'Mewujudkan HIMA Einsten sebagai pusat pengembangan elektronika nuklir yang inovatif, mandiri, dan berdaya saing global.',
      misi: [
        'Digitalisasi seluruh administrasi kesekretariatan Himpunan agar efisien dan transparan.',
        'Mendorong penelitian aplikatif berbasis Internet of Things (IoT) dan Instrumentasi Nuklir otonom.',
        'Meningkatkan kemitraan strategis dengan institusi riset nasional (BRIN) serta sektor industri industri penunjang.'
      ],
      color: 'from-amber-500 to-amber-600',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80'
    },
    {
      number: '02',
      tagline: 'KABINET KOLABORATIF TRANSFORMATIF',
      kahim: 'Adiguna Nugroho Halomoan',
      wakahim: 'Rabbany Al-Malika',
      visi: 'Mentransformasikan HIMA Einsten menjadi wadah pengembangan softskill and hardskill yang inklusif, kolaboratif, dan berdampak nyata bagi masyarakat.',
      misi: [
        'Membangun platform kewirausahaan terintegrasi (Einsten Market) untuk kemandirian ekonomi mahasiswa.',
        'Menyelenggarakan sertifikasi kompetensi industri elektronika dan instrumentasi kendali.',
        'Digitalisasi logistik aset dan peminjaman instrumen lab melalui integrasi QR Code Scanner (Einsten Space).'
      ],
      color: 'from-gold to-gold-light',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80'
    }
  ];

  useEffect(() => {
    if (currentUser) {
      const savedVote = localStorage.getItem(`hima_vote_cast_${currentUser.email}`);
      if (savedVote) {
        setVotedPaslon(savedVote);
        // Simulate adding the current user's vote to the stats
        setVoteStats(prev => ({
          ...prev,
          [savedVote]: prev[savedVote] + 1
        }));
      }
    }
  }, [currentUser]);

  const handleVote = (paslonNumber) => {
    if (!currentUser) {
      showToast('Akses Ditolak: Silakan masuk (login) terlebih dahulu untuk memberikan hak suara!', 'error');
      return;
    }

    const savedVote = localStorage.getItem(`hima_vote_cast_${currentUser.email}`);
    if (savedVote) {
      showToast('Anda sudah memberikan suara sebelumnya!', 'warning');
      return;
    }

    // Process vote
    localStorage.setItem(`hima_vote_cast_${currentUser.email}`, paslonNumber);
    setVotedPaslon(paslonNumber);
    setVoteStats(prev => ({
      ...prev,
      [paslonNumber]: prev[paslonNumber] + 1
    }));

    showToast(`Voting Berhasil! Suara Anda untuk Paslon ${paslonNumber} telah direkam secara sah.`, 'success');
  };

  const toggleTab = (number, tabName) => {
    setActiveTabMap(prev => ({
      ...prev,
      [number]: tabName
    }));
  };

  const totalVotes = voteStats['01'] + voteStats['02'];
  const percent01 = Math.round((voteStats['01'] / totalVotes) * 100) || 0;
  const percent02 = Math.round((voteStats['02'] / totalVotes) * 100) || 0;

  return (
    <div className="relative pt-24 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-800">
      {/* Orbs bg */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-gold-dark uppercase tracking-widest flex items-center justify-center gap-1">
          <Award className="w-3.5 h-3.5 text-gold" /> Pesta Demokrasi Himpunan
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-wider">
          PEMILIHAN KETUA HIMA
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
          Salurkan hak suara Anda untuk menentukan arah kepemimpinan Himpunan Elektronika Instrumentasi Politeknik Teknologi Nuklir Indonesia periode berikutnya.
        </p>
      </div>

      {/* Alert if Guest */}
      {!currentUser && (
        <div className="max-w-3xl mx-auto bg-amber-50 border border-amber-250 p-4 rounded-2xl flex gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Pemberitahuan Sistem</h4>
            <p className="text-[11px] text-amber-700 leading-relaxed font-light mt-0.5">
              Anda saat ini sedang menjelajah sebagai tamu. Silakan masuk (login) ke dalam Portal menggunakan akun Mahasiswa aktif Anda terlebih dahulu agar tombol voting di bawah ini dapat diaktifkan.
            </p>
          </div>
        </div>
      )}

      {/* Voting Results Screen (if voted) */}
      {votedPaslon && (
        <div className="max-w-3xl mx-auto bg-white border border-gold-border rounded-2xl p-6 sm:p-8 shadow-lg text-left space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">Partisipasi Anda Tercatat!</h3>
              <p className="text-[10px] text-slate-500">Terima kasih atas kontribusi Anda dalam membangun masa depan organisasi.</p>
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="block text-[9px] font-bold text-slate-400 uppercase">Pilihan Anda</span>
              <span className="text-base font-extrabold text-gold-dark">PASLON {votedPaslon}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl col-span-2 flex items-center justify-between">
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">Total Partisipasi Suara</span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-550" /> {totalVotes} Suara
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 text-[8px] font-bold uppercase">Real-Time</span>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="space-y-5 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4.5 h-4.5 text-gold" /> Hasil Perolehan Suara Sementara
            </h4>

            {/* Paslon 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700">Paslon 01 (M. Iqbal - Nailah)</span>
                <span className="font-mono font-extrabold text-slate-900">{percent01}% ({voteStats['01']} suara)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out"
                  style={{ width: `${percent01}%` }}
                ></div>
              </div>
            </div>

            {/* Paslon 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end text-xs">
                <span className="font-bold text-slate-700">Paslon 02 (Adiguna - Rabbany)</span>
                <span className="font-mono font-extrabold text-slate-900">{percent02}% ({voteStats['02']} suara)</span>
              </div>
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-1000 ease-out"
                  style={{ width: `${percent02}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-4">
        {candidates.map((cand) => {
          const isActive = votedPaslon === cand.number;
          const hasVoted = !!votedPaslon;

          return (
            <div 
              key={cand.number}
              className={`bg-white border rounded-3xl overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-all duration-300 relative text-left ${
                isActive ? 'border-gold ring-1 ring-gold bg-gold/5' : 'border-gold-border'
              }`}
            >
              {/* Badge Number */}
              <div className="absolute top-4 left-4 z-20 w-12 h-12 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-md">
                <span className="text-[9px] font-bold text-gold opacity-80 uppercase leading-none mb-0.5">Paslon</span>
                <span className="text-lg font-extrabold font-mono leading-none">{cand.number}</span>
              </div>

              {/* Photo header */}
              <div className="w-full aspect-[16/10] bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10"></div>
                <img 
                  src={cand.avatar} 
                  alt={`${cand.kahim} & ${cand.wakahim}`} 
                  className="w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                
                {/* Names */}
                <div className="absolute bottom-4 left-6 z-20 text-white space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded bg-gold/80 text-white text-[8px] font-bold uppercase tracking-wider">
                    {cand.tagline}
                  </span>
                  <h3 className="text-base font-extrabold leading-snug uppercase tracking-wide">
                    {cand.kahim} <span className="text-gold-light">&</span> {cand.wakahim}
                  </h3>
                  <p className="text-[10px] text-slate-350">Calon Ketua & Wakil Ketua HIMA Einsten</p>
                </div>
              </div>

              {/* Tabs Menu Visi & Misi */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => toggleTab(cand.number, 'visi')}
                  className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTabMap[cand.number] === 'visi' 
                      ? 'border-gold text-gold-dark bg-white' 
                      : 'border-transparent text-slate-550 hover:text-slate-800'
                  }`}
                >
                  Visi Calon
                </button>
                <button
                  onClick={() => toggleTab(cand.number, 'misi')}
                  className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTabMap[cand.number] === 'misi' 
                      ? 'border-gold text-gold-dark bg-white' 
                      : 'border-transparent text-slate-550 hover:text-slate-800'
                  }`}
                >
                  Misi Calon
                </button>
              </div>

              {/* Tabs Content */}
              <div className="p-6 flex-grow space-y-4">
                {activeTabMap[cand.number] === 'visi' ? (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Info className="w-3 h-3 text-gold" /> Visi Utama
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-light font-sans italic">
                      "{cand.visi}"
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Misi Kerja</span>
                    <ol className="space-y-2 list-decimal list-inside text-xs text-slate-650 font-light font-sans leading-relaxed">
                      {cand.misi.map((m, mIdx) => (
                        <li key={mIdx} className="pl-1">
                          <span className="text-slate-600 font-sans">{m}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Vote CTA Action */}
              <div className="p-6 pt-0 border-t border-slate-50 mt-auto">
                <button
                  onClick={() => handleVote(cand.number)}
                  disabled={hasVoted || !currentUser}
                  className={`w-full py-3 font-bold rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10 cursor-default'
                      : hasVoted
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : !currentUser
                          ? 'bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed'
                          : `bg-gradient-to-r ${cand.color} text-white shadow-md hover:brightness-110`
                  }`}
                >
                  {isActive ? (
                    <span className="flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-white" /> Pilihan Anda
                    </span>
                  ) : hasVoted ? (
                    'Selesai Voting'
                  ) : !currentUser ? (
                    'Login untuk Vote'
                  ) : (
                    'Pilih Paslon ini'
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
