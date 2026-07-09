
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogoSVG, InkBurstSVG, LightningSVG } from '../components/Icons';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      
      {/* Background Comic Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <InkBurstSVG className="absolute top-20 left-10 w-24 h-24 opacity-20 transform -rotate-12" filled={false} />
        <LightningSVG className="absolute bottom-32 right-20 w-16 h-16 opacity-30 transform rotate-45" filled={false} />
        
        {/* Comic Narrator (Speaking Image - Desktop) */}
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.2 }}
          className="hidden md:block fixed bottom-0 left-0 z-0 opacity-40 mix-blend-multiply"
        >
          <img src={`${import.meta.env.BASE_URL}speaking.png`} className="w-96 lg:w-[450px] h-auto filter grayscale" />
        </motion.div>

        {/* Comic Narrator (Speaking Image - Mobile) */}
        <motion.div 
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 0.4 }}
          transition={{ delay: 0.5, type: 'spring', bounce: 0.2 }}
          className="md:hidden absolute top-0 right-0 z-0 mix-blend-multiply"
        >
          <img src={`${import.meta.env.BASE_URL}speaking.png`} className="w-48 sm:w-64 h-auto filter grayscale transform -scale-x-100" />
        </motion.div>

        {/* Floating Avatar Badge (Desktop) */}
        <motion.div 
          animate={{ y: [0, -10, 0], rotate: [10, 15, 10] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="hidden md:block absolute top-12 right-[10%] z-0"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple transform translate-x-2 translate-y-2 rounded-full border-4 border-ink"></div>
            <img src={`${import.meta.env.BASE_URL}avatar.png`} className="w-24 h-24 object-cover rounded-full border-4 border-ink relative z-10" />
            <div className="absolute -top-2 -right-4 w-12 h-12 bg-primary border-4 border-ink flex items-center justify-center transform rotate-12 z-20 font-bangers text-xl">AD!</div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="flex flex-col items-start gap-6"
        >
          <div className="inline-block border-comic border-ink bg-primary px-4 py-2 transform -rotate-2 shadow-comic-sm">
            <span className="font-bangers tracking-widest text-xl">WELCOME TO</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-9xl text-ink leading-[0.9]" style={{ textShadow: '4px 4px 0px var(--color-paper), 6px 6px 0px var(--color-ink)' }}>
            AD'S<br/>BOOKVERSE
          </h1>
          
          <div className="bg-white border-comic border-ink p-5 md:p-6 shadow-comic relative mt-6 w-full max-w-sm z-20">
            {/* Avatar Badge (Mobile Only) */}
            <div className="md:hidden absolute -top-8 -right-4 w-16 h-16 z-30">
               <div className="absolute inset-0 bg-purple transform translate-x-1 translate-y-1 rounded-full border-2 border-ink"></div>
               <img src={`${import.meta.env.BASE_URL}avatar.png`} className="w-16 h-16 object-cover rounded-full border-2 border-ink relative z-10 bg-primary" />
               <div className="absolute -top-1 -right-2 w-8 h-8 bg-primary border-2 border-ink flex items-center justify-center transform rotate-12 z-20 font-bangers text-sm">AD!</div>
            </div>

            <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 bg-purple border-comic border-ink rounded-full z-20"></div>
            <p className="font-outfit text-xl md:text-3xl font-bold relative z-10">
              Building my universe,<br/>one page at a time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full z-20 relative">
            <button 
              onClick={() => navigate('/dashboard')}
              className="comic-button bg-primary text-ink flex-1 text-2xl py-4"
            >
              Explore Library
            </button>
            <button 
              onClick={() => navigate('/collections/reading')}
              className="comic-button bg-purple text-white flex-1 text-2xl py-4"
            >
              Current Expedition
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="flex justify-center items-center relative min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]"
        >
          {/* Decorative container behind the illustration */}
          <div className="absolute inset-0 bg-paper border-[6px] border-ink rounded-[40px] transform rotate-3 scale-95 z-0 border-dashed overflow-hidden shadow-comic">
            {/* Collage as a full color comic background */}
            <div className="absolute inset-0 bg-cover bg-center opacity-100" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}collage.jpeg')` }}></div>
          </div>
          <div className="relative z-10 p-12 w-full flex justify-center pointer-events-none">
             <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             >
               <LogoSVG className="w-full max-w-[130px] md:max-w-[280px] h-auto drop-shadow-[10px_10px_0px_var(--color-ink)]" />
             </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Landing;
