import { NavLink } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#262626] bg-[#0A0A0A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-semibold tracking-tight text-[#EDEDED]">
              Aetheris AI
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[10px] text-[#EDEDED]/40 tracking-wider uppercase">
              All Systems Operational
            </span>
          </div>
          <p className="font-mono text-[11px] text-[#EDEDED]/30">
            &copy; {new Date().getFullYear()} Aetheris Technologies. All rights reserved.
          </p>
        </div>


        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <NavLink
            to="/"
            className="font-mono text-xs text-[#EDEDED]/50 hover:text-[#EDEDED] transition-colors outline-none focus-visible:text-[#6366F1]"
          >
            Home
          </NavLink>
          <NavLink
            to="/playground"
            className="font-mono text-xs text-[#EDEDED]/50 hover:text-[#EDEDED] transition-colors outline-none focus-visible:text-[#6366F1]"
          >
            Playground
          </NavLink>
          <NavLink
            to="/diff-view"
            className="font-mono text-xs text-[#EDEDED]/50 hover:text-[#EDEDED] transition-colors outline-none focus-visible:text-[#6366F1]"
          >
            Diff View
          </NavLink>
          <a
            href="https://github.com/its-bismay"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[#EDEDED]/50 hover:text-[#EDEDED] transition-colors outline-none focus-visible:text-[#6366F1]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
