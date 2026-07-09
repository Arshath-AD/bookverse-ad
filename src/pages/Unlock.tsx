import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogoSVG, ArrowLeftSVG } from '../components/Icons';

const Unlock = () => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    const success = await login(passphrase);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError(true);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[var(--color-paper)] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-5" 
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 10 Q 50 50 90 10\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'5\' fill=\'black\'/%3E%3C/svg%3E")',
             backgroundSize: '200px 200px'
           }}>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="mb-6 md:mb-8 font-bangers text-lg md:text-xl flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors bg-white px-4 py-2 border-comic border-ink inline-flex"
        >
          <ArrowLeftSVG className="w-5 h-5 md:w-6 md:h-6" /> PUBLIC SPACE
        </button>

        <div className="comic-panel p-6 md:p-10 bg-white relative">
          <div className="absolute -top-6 -right-4 md:-top-8 md:-right-8 w-16 h-16 md:w-20 md:h-20 bg-[var(--color-primary)] rounded-full border-comic border-ink shadow-comic flex items-center justify-center transform rotate-12 z-20">
             <LogoSVG className="w-10 h-10 md:w-12 md:h-12" />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bangers mb-2 uppercase text-ink">Unlock Bookverse</h1>
          <p className="font-outfit text-gray-500 mb-6 md:mb-8 font-bold text-sm md:text-base">This area is restricted to the archivist.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl md:text-2xl tracking-wider">Library Passphrase</label>
              <motion.div
                animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <input 
                  type={showPassword ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => {
                    setPassphrase(e.target.value);
                    setError(false);
                  }}
                  className={`comic-input w-full pr-12 ${error ? 'border-[var(--color-red)] bg-red-50' : 'bg-[var(--color-paper)]'}`}
                  placeholder="Enter secret phrase..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity"
                  aria-label={showPassword ? "Hide passphrase" : "Show passphrase"}
                >
                  {showPassword ? (
                    <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </motion.div>
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[var(--color-red)] font-outfit font-bold text-xs md:text-sm mt-1"
                  >
                    Incorrect passphrase. Access denied.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" className="comic-button bg-[var(--color-ink)] text-white w-full py-3 md:py-4 text-xl md:text-2xl group mt-2 hover:bg-[var(--color-primary)] hover:text-[var(--color-ink)] transition-colors">
              <span className="group-hover:scale-110 transition-transform">Authenticate</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Unlock;
