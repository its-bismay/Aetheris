import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Playground', path: '/playground' },
  { name: 'Diff View', path: '/diff-view' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262626] bg-[#0A0A0A]/80 backdrop-blur-md flex flex-col">
      <nav
        className="mx-auto h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 flex justify-between"
        aria-label="Main Navigation"
      >

        <div className="flex items-center justify-start">
          <NavLink
            to="/"
            aria-label="Aetheris AI Home"
            className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            <span className="font-sans text-xl font-semibold tracking-tight text-[#EDEDED]">
              Aetheris AI
            </span>
          </NavLink>
        </div>

        <div className="hidden md:flex items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'group relative rounded-sm py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]',
                  isActive
                    ? 'text-[#EDEDED]'
                    : 'text-[#EDEDED]/70 hover:text-[#EDEDED]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-[-21px] left-0 right-0 h-[2px] bg-[#6366F1]"
                      style={{
                        boxShadow: '0 -2px 10px rgba(99, 102, 241, 0.4)',
                      }}
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>


        <div className="flex justify-end md:hidden">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex items-center justify-center rounded-sm p-2 text-[#EDEDED] transition-colors hover:bg-[#262626] outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
          >
            <span className="sr-only">
              {isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            </span>

            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>


      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-[#262626] bg-[#121212] md:hidden"
          >
            <div className="space-y-1 px-4 pb-4 pt-2">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-2 text-base font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]',
                      isActive
                        ? 'bg-[#262626]/50 text-[#6366F1]'
                        : 'text-[#EDEDED]/70 hover:bg-[#262626]/30 hover:text-[#EDEDED]'
                    )
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}