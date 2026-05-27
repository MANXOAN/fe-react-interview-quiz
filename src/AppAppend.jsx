import React from 'react';
import FullQuiz from './App.jsx';
import PracticalQuiz from './AppPractical.jsx';

export default function AppAppend() {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100">
      <style>{`
        .embedded-practical > div > header { display: none !important; }
        .embedded-practical > div > div { display: block !important; max-width: 80rem !important; margin-left: auto !important; margin-right: auto !important; }
        .embedded-practical aside { display: none !important; }
        .embedded-practical main { padding-top: 0 !important; }
      `}</style>

      <div className="sticky top-0 z-[60] border-b border-white/10 bg-[#08090d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Đã gom thành một luồng câu hỏi</div>
            <div className="text-sm text-slate-300">
              Bộ cũ vẫn giữ nguyên, câu hỏi thực chiến mới được nối tiếp ngay trong cùng một trang, không tách tab và không thay thế bank cũ.
            </div>
          </div>
        </div>
      </div>

      <FullQuiz />

      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm leading-7 text-slate-200">
          <b className="text-cyan-200">Câu hỏi bổ sung tiếp theo:</b> React/Sudheer, JS/TS runtime, Axios, TanStack Query/Router, Rendering và Git. Phần này nằm trong cùng một trang để ôn liên tục.
        </div>
      </div>

      <div className="embedded-practical">
        <PracticalQuiz />
      </div>
    </div>
  );
}
