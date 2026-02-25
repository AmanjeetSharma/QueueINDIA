import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const numRef = useRef(null);

  useEffect(() => {
    let timer;
    const glitch = () => {
      const el = numRef.current;
      if (el) {
        el.dataset.glitch = "1";
        setTimeout(() => delete el.dataset.glitch, 400);
      }
      timer = setTimeout(glitch, 3000 + Math.random() * 4000);
    };
    timer = setTimeout(glitch, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 pb-12 pt-8 font-sans">

      {/* ── Dot grid background ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#c4b5fd_1px,transparent_1px)] bg-size-[28px_28px] opacity-40" />

      {/* ── Soft gradient wash ── */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(167,139,250,0.2),transparent)]" />

      {/* ── Animated ring 1 ── */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[min(80vw,480px)] w-[min(80vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/20 animate-ping [animation-duration:3s]" />

      {/* ── Animated ring 2 ── */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[min(80vw,480px)] w-[min(80vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/15 animate-ping [animation-duration:3s] [animation-delay:1s]" />

      {/* ── Animated ring 3 ── */}
      <div className="pointer-events-none absolute left-1/2 top-[38%] h-[min(80vw,480px)] w-[min(80vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300/10 animate-ping [animation-duration:3s] [animation-delay:2s]" />

      {/* ── Floating particles ── */}
      <div className="pointer-events-none absolute left-[8%] top-[18%] h-2 w-2 rounded-full bg-violet-400/50 animate-bounce [animation-duration:3s]" />
      <div className="pointer-events-none absolute right-[10%] top-[25%] h-1.5 w-1.5 rounded-full bg-fuchsia-400/45 animate-bounce [animation-duration:4s] [animation-delay:0.5s]" />
      <div className="pointer-events-none absolute bottom-[22%] left-[20%] h-2 w-2 rounded-full bg-indigo-400/40 animate-bounce [animation-duration:3.5s] [animation-delay:1s]" />
      <div className="pointer-events-none absolute bottom-[18%] right-[15%] h-1.5 w-1.5 rounded-full bg-violet-300/55 animate-bounce [animation-duration:5s] [animation-delay:0.8s]" />
      <div className="pointer-events-none absolute left-[50%] top-[6%] h-2.5 w-2.5 rounded-full bg-purple-300/50 animate-bounce [animation-duration:4.5s] [animation-delay:0.3s]" />

      {/* ── Corner brackets ── */}
      <svg className="pointer-events-none absolute left-3 top-3 h-8 w-8 text-violet-300/30 sm:h-10 sm:w-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="0,20 0,0 20,0" />
      </svg>
      <svg className="pointer-events-none absolute right-3 top-3 h-8 w-8 -scale-x-100 text-violet-300/30 sm:h-10 sm:w-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="0,20 0,0 20,0" />
      </svg>
      <svg className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 -scale-y-100 text-violet-300/30 sm:h-10 sm:w-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="0,20 0,0 20,0" />
      </svg>
      <svg className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 scale-[-1] text-violet-300/30 sm:h-10 sm:w-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="0,20 0,0 20,0" />
      </svg>

      {/* ── 404 Number ── */}
      <div
        ref={numRef}
        className="relative z-10 animate-bounce [animation-duration:4s] select-none text-[clamp(4.5rem,20vw,12rem)] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-violet-700 via-purple-500 to-fuchsia-500 drop-shadow-[0_6px_32px_rgba(139,92,246,0.25)] mb-2 sm:mb-4"
      >
        404
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[min(92vw,400px)] animate-[fadeUp_0.6s_0.1s_both] rounded-2xl border border-violet-200/60 bg-white/80 px-[clamp(1rem,5vw,2.5rem)] py-[clamp(1.25rem,4vw,2rem)] text-center shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_20px_56px_rgba(109,40,217,0.08),0_4px_16px_rgba(109,40,217,0.06)] backdrop-blur-xl sm:rounded-3xl">

        {/* Brand badge */}
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-violet-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500" />
          QueueINDIA
        </div>

        <h2 className="mb-2 text-[clamp(1rem,3.5vw,1.35rem)] font-extrabold tracking-tight text-slate-900">
          Page Not Found
        </h2>

        {/* Divider */}
        <div className="mx-auto mb-4 h-0.5 w-8 rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500" />

        <p className="mb-5 text-[clamp(0.78rem,2vw,0.9rem)] leading-relaxed text-slate-500">
          This page slipped out of the queue.
          <br className="hidden sm:block" />
          {" "}Let's get you back in line.
        </p>

        {/* Action buttons */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-linear-to-r from-violet-600 to-purple-500 px-5 py-2.5 text-[0.82rem] font-bold text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.4)] active:translate-y-0"
          >
            ⌂ Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-5 py-2.5 text-[0.82rem] font-bold text-violet-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md active:translate-y-0"
          >
            ← Go Back
          </button>
        </div>

        {/* Quick links */}
        <nav className="flex flex-wrap items-center justify-center gap-1">
          {[
            { to: "/dashboard",    label: "Dashboard" },
            { to: "/departments", label: "Departments" },
            { to: "/pricing",     label: "Pricing" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="min-h-9 inline-flex items-center rounded-lg px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-150 hover:bg-violet-50 hover:text-violet-600"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Footer brand ── */}
      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-bold uppercase tracking-[0.15em] text-violet-300/50">
        QueueINDIA · Your Digital Queue Solution
      </p>
    </div>
  );
};

export default NotFound;