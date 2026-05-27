import React from 'react';
import FullQuiz from './App.jsx';
import PracticalQuiz from './AppPractical.jsx';

export default function AppAppend() {
  return (
    <div className="min-h-screen bg-[#070910] text-slate-100">
      <div className="sticky top-0 z-[60] border-b border-cyan-400/20 bg-[#070910]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Đã cập nhật bản cộng thêm</div>
            <div className="text-sm text-slate-300">
              Bộ câu hỏi cũ được giữ nguyên ở phía trên. Kéo xuống dưới sẽ thấy phần <b className="text-white">Bổ sung thực chiến</b> từ Sudheer React + Axios + TanStack + Rendering + Git.
            </div>
          </div>
          <a
            href="#bo-sung-thuc-chien"
            className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950 hover:bg-cyan-200"
          >
            Xuống phần mới
          </a>
        </div>
      </div>

      <FullQuiz />

      <section id="bo-sung-thuc-chien" className="border-t-4 border-cyan-400/40 bg-[#070910] pt-6">
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <div className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-5">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Phần mới được thêm</div>
            <h2 className="mt-2 text-2xl font-black text-white">Bổ sung câu hỏi thực chiến</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300">
              Phần này không thay thế bộ cũ. Đây là bank mới tập trung vào câu hỏi từ cơ bản đến nâng cao: React core/Sudheer, JS/TS runtime, Axios interceptor, TanStack Query/Router, Rendering CSR/SSR/SSG/ISR, Git workflow và case phỏng vấn thực tế.
            </p>
          </div>
        </div>
        <PracticalQuiz />
      </section>
    </div>
  );
}
