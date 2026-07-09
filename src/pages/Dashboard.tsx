import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import { BookOpenSVG, CheckSVG, CrossSVG } from '../components/Icons';

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = (totalDuration / end);
    if (incrementTime < 10) incrementTime = 10;
    
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const StatCard = ({ title, value, icon, color, onClick, delay }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring' }}
      onClick={onClick}
      className={`comic-panel p-3 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-4 md:gap-6 cursor-pointer relative overflow-hidden`}
      style={{ backgroundColor: color }}
    >
      {/* Decorative background doodle for the stat card */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none transform rotate-12 scale-150">
        {icon}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 relative z-10">
        <h3 className="text-sm sm:text-base md:text-2xl leading-tight text-ink bg-white px-2 py-1 md:px-3 md:py-1 border-2 md:border-comic border-ink inline-block shadow-sm md:shadow-comic-sm">
          {title}
        </h3>
        <div className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 bg-white border-2 md:border-comic border-ink flex items-center justify-center rounded-full shadow-sm md:shadow-comic-sm">
          <div className="scale-75 md:scale-100 flex items-center justify-center">{icon}</div>
        </div>
      </div>
      <div className="text-4xl sm:text-5xl md:text-7xl font-bangers text-ink mt-auto relative z-10" style={{ textShadow: '2px 2px 0px white', WebkitTextStroke: '1px var(--color-ink)' }}>
        <AnimatedCounter value={value} />
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { books } = useBooks();
  const navigate = useNavigate();

  const stats = {
    completed: books.filter(b => b.status === 'completed').length,
    toRead: books.filter(b => b.status === 'to-read').length,
    reading: books.filter(b => b.status === 'reading').length,
    abandoned: books.filter(b => b.status === 'abandoned').length,
    totalPages: books.reduce((acc, b) => acc + (b.currentPage || 0), 0),
    totalBooks: books.length,
    avgProgress: books.length ? Math.round(books.reduce((acc, b) => acc + (b.currentPage / b.totalPages) * 100, 0) / books.length) : 0
  };

  return (
    <div className="p-3 sm:p-4 md:p-12 animate-fade-in">
      <div className="flex justify-between items-end mb-6 md:mb-10 border-b-2 md:border-b-comic border-ink pb-2 md:pb-4">
        <h1 className="text-3xl md:text-7xl">EXPLORER'S DESK</h1>
        <BookOpenSVG className="w-10 h-10 md:w-12 md:h-12 hidden md:block" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
        <StatCard 
          title="Current Expedition" 
          value={stats.reading} 
          icon={<BookOpenSVG className="w-6 h-6" />} 
          color="var(--color-primary)" 
          onClick={() => navigate('/collections/reading')}
          delay={0.1}
        />
        <StatCard 
          title="Completed Adventures" 
          value={stats.completed} 
          icon={<CheckSVG className="w-6 h-6" />} 
          color="var(--color-green)" 
          onClick={() => navigate('/collections/completed')}
          delay={0.2}
        />
        <StatCard 
          title="Future Universes" 
          value={stats.toRead} 
          icon={<div className="w-4 h-4 bg-[var(--color-ink)] rounded-full"></div>} 
          color="var(--color-purple)" 
          onClick={() => navigate('/collections/to-read')}
          delay={0.3}
        />
        <StatCard 
          title="Abandoned Timelines" 
          value={stats.abandoned} 
          icon={<CrossSVG className="w-6 h-6" />} 
          color="var(--color-paper)" 
          onClick={() => navigate('/collections/abandoned')}
          delay={0.4}
        />
      </div>

      <div className="mt-6 md:mt-12">
        <h2 className="text-2xl md:text-4xl mb-4 md:mb-6">UNIVERSE METRICS</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="comic-panel p-3 md:p-8 bg-white flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-2"
          >
            <div>
              <p className="font-outfit text-[10px] md:text-xl font-bold uppercase tracking-widest text-gray-500">Worlds Discovered</p>
              <p className="text-4xl md:text-6xl font-bangers"><AnimatedCounter value={stats.totalBooks} /></p>
            </div>
            <BookOpenSVG className="w-8 h-8 md:w-16 md:h-16 opacity-20" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="comic-panel p-3 md:p-8 bg-white flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-2"
          >
            <div>
              <p className="font-outfit text-[10px] md:text-xl font-bold uppercase tracking-widest text-gray-500">Pages Traversed</p>
              <p className="text-4xl md:text-6xl font-bangers text-[var(--color-red)]"><AnimatedCounter value={stats.totalPages} /></p>
            </div>
            <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-16 md:h-16 opacity-20">
              <path d="M10 50L90 50M50 10L50 90" stroke="var(--color-ink)" strokeWidth="10" />
            </svg>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="comic-panel p-3 md:p-8 bg-white flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-2 col-span-2 md:col-span-1"
          >
            <div>
              <p className="font-outfit text-[10px] md:text-xl font-bold uppercase tracking-widest text-gray-500">Journey Progress</p>
              <p className="text-4xl md:text-6xl font-bangers text-[var(--color-purple)]"><AnimatedCounter value={stats.avgProgress} />%</p>
            </div>
            <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-16 md:h-16 opacity-20">
               <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-ink)" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - stats.avgProgress / 100)} transform="rotate(-90 50 50)" />
               <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-ink)" strokeWidth="2" opacity="0.5" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
