import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoSVG, CrossSVG } from './Icons';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';
  const isUnlock = location.pathname === '/unlock';

  if (isLanding || isUnlock) return null; // Hide navbar on landing and unlock pages

  const navLinks = [
    { name: "Explorer's Desk", path: '/dashboard' },
    { name: 'Expeditions', path: '/collections/reading' },
    { name: 'Conquered', path: '/collections/completed' },
    { name: 'Future Worlds', path: '/collections/to-read' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-paper border-b-comic border-ink py-4 px-6 md:px-12 flex justify-between items-center shadow-sm relative">
        <Link to="/" className="flex items-center gap-4 group" onClick={() => setIsMenuOpen(false)}>
          <div className="transform group-hover:-rotate-12 transition-transform flex items-center justify-center">
            <LogoSVG className="w-14 h-14 drop-shadow-[4px_4px_0px_var(--color-ink)]" />
          </div>
          <span className="font-bangers text-3xl tracking-widest uppercase hidden sm:inline">Ad's Bookverse</span>
        </Link>
        
        <div className="hidden md:flex gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={clsx(
                  "px-4 py-2 font-bangers text-xl border-comic border-transparent hover:border-ink transition-all",
                  isActive ? "bg-primary border-ink shadow-comic-sm -translate-y-1" : "hover:-translate-y-1"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex gap-4 items-center">
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              window.location.hash = '#/add-book';
            }}
            className="hidden md:flex comic-button bg-green text-white text-lg py-2 px-4 whitespace-nowrap shadow-comic-sm"
          >
            + ADD BOOK
          </button>
          
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="hidden md:flex comic-button bg-[var(--color-paper)] text-ink text-lg py-2 px-4 whitespace-nowrap shadow-comic-sm hover:bg-gray-100"
          >
            LOGOUT
          </button>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden w-10 h-10 bg-primary border-comic border-ink flex items-center justify-center shadow-comic-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
               <CrossSVG className="w-6 h-6" />
            ) : (
               <svg viewBox="0 0 100 100" className="w-6 h-6">
                 <path d="M20 30H80M20 50H80M20 70H80" stroke="var(--color-ink)" strokeWidth="10" strokeLinecap="round" />
               </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, type: 'tween' }}
            className="md:hidden fixed top-[76px] left-0 right-0 z-40 bg-paper border-b-comic border-ink shadow-comic overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "p-4 font-bangers text-2xl border-comic border-ink text-center transition-all",
                      isActive ? "bg-primary shadow-comic-sm" : "bg-white shadow-sm"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <Link 
                to="/add-book"
                onClick={() => setIsMenuOpen(false)}
                className="p-4 font-bangers text-2xl border-comic border-ink text-center transition-all bg-green text-white shadow-sm mt-2"
              >
                + ADD BOOK
              </Link>
              
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="p-4 font-bangers text-2xl border-comic border-ink text-center transition-all bg-[var(--color-paper)] text-ink shadow-sm mt-2 active:bg-gray-200"
              >
                LOGOUT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
