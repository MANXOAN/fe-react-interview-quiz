import React, { useState } from 'react';
import FullQuiz from './App.jsx';
import PracticalQuiz from './AppPractical.jsx';

export default function AppCombined() {
  const [tab, setTab] = useState('full');

  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#070910]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">FE React Interview Quiz</div>
            <div className="text-xs text-slate-400">Không thay thế bộ cũ nữa — chuyển tab để xem bộ đầy đủ hoặc bộ bổ sung thực chiến.</div>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setTab('full')}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === 'full' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
            >
              Bộ đầy đủ cũ
            </button>
            <button
              type="button"
              onClick={() => setTab('practical')}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${tab === 'practical' ? 'bg-cyan-300 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`}
            >
              Bổ sung thực chiến
            </button>
          </div>
        </div>
      </div>

      <div className={tab === 'full' ? 'block' : 'hidden'}>
        <FullQuiz />
      </div>
      <div className={tab === 'practical' ? 'block' : 'hidden'}>
        <PracticalQuiz />
      </div>
    </div>
  );
}
