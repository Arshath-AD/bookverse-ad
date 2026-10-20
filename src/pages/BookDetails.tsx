
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooks } from '../context/BookContext';
import { ArrowLeftSVG, InkBurstSVG } from '../components/Icons';

const BookProgressGraphic = ({ currentPage, totalPages, color }: { currentPage: number, totalPages: number, color: string }) => {
  const percentage = totalPages > 0 ? Math.min(100, Math.max(0, Math.round(((currentPage || 0) / totalPages) * 100))) : 0;
  
  return (
    <div className="relative w-full max-w-[120px] sm:max-w-[150px] md:max-w-[300px] aspect-square mx-auto mt-4 md:mt-8">
      {/* Background Book Outline */}
      <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 drop-shadow-md">
        <path d="M20 10 C 20 10 40 5 50 10 C 60 5 80 10 80 10 V 90 C 80 90 60 85 50 90 C 40 85 20 90 20 90 Z" 
              fill="white" stroke="var(--color-ink)" strokeWidth="4" strokeLinejoin="round"/>
        <path d="M50 10 V 90" stroke="var(--color-ink)" strokeWidth="4"/>
      </svg>
      
      {/* Fill indicating progress using a clipPath */}
      <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
        <defs>
          <clipPath id="progressClip">
            <rect x="0" y={100 - percentage} width="100" height={percentage} />
          </clipPath>
        </defs>
        <path d="M20 10 C 20 10 40 5 50 10 C 60 5 80 10 80 10 V 90 C 80 90 60 85 50 90 C 40 85 20 90 20 90 Z" 
              fill={color} stroke="none" clipPath="url(#progressClip)" />
      </svg>
      
      {/* Decorative dots for filled area */}
      <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 opacity-20" clipPath="url(#progressClip)">
         <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
           <circle fill="var(--color-ink)" cx="2" cy="2" r="2"></circle>
         </pattern>
         <rect x="0" y="0" width="100" height="100" fill="url(#dots)" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center font-bangers text-[var(--color-ink)]" style={{ textShadow: '2px 2px 0px white' }}>
        <span className="text-3xl md:text-5xl">{percentage}%</span>
        <span className="text-sm md:text-xl bg-white px-1 md:px-2 border-2 border-[var(--color-ink)] mt-1 md:mt-2 shadow-[2px_2px_0px_0px_var(--color-ink)] transform -rotate-3">READ</span>
      </div>
    </div>
  );
};

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books } = useBooks();
  const book = books.find(b => b.id === id);

  if (!book) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-5xl font-bangers">Book Not Found</h1>
        <button onClick={() => navigate(-1)} className="comic-button bg-[var(--color-primary)] mt-8">Go Back</button>
      </div>
    );
  }

  const remainingPages = Math.max(0, (book.totalPages || 0) - (book.currentPage || 0));

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
      className="p-3 sm:p-4 md:p-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="comic-button bg-white flex items-center justify-center gap-2 group w-full sm:w-auto text-lg md:text-xl py-2 md:py-3"
        >
          <ArrowLeftSVG className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          BACK
        </button>
        <button 
          onClick={() => navigate(`/edit-book/${book.id}`)}
          className="comic-button bg-[var(--color-primary)] text-ink w-full sm:w-auto text-lg md:text-xl py-2 md:py-3"
        >
          EDIT TIMELINE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-12">
        {/* Left Column: Cover & Progress */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-8">
          <motion.div 
            initial={{ rotateY: 90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="comic-panel border-[8px] bg-white p-4 relative"
            style={{ perspective: '1000px' }}
          >
            <div className="absolute top-0 right-8 w-8 h-12 bg-[var(--color-primary)] border-x-[var(--comic-border)] border-b-[var(--comic-border)] border-[var(--color-ink)] z-20 flex items-end justify-center pb-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <img src={book.coverImage} alt={book.title} className="w-full h-auto border-[var(--comic-border)] border-[var(--color-ink)]" />
          </motion.div>

          <div className="comic-panel p-3 md:p-6 bg-white relative overflow-hidden">
            <h3 className="font-bangers text-2xl md:text-3xl mb-2 md:mb-4 relative z-10">READING PROGRESS</h3>
            <BookProgressGraphic currentPage={book.currentPage} totalPages={book.totalPages} color={book.accentColor} />
            
            <div className="grid grid-cols-2 gap-2 md:gap-4 mt-4 md:mt-8 text-center relative z-10">
              <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-1 md:p-2 transform -rotate-1">
                <p className="font-bangers text-lg md:text-xl text-[var(--color-ink)]">{book.currentPage}</p>
                <p className="font-outfit text-[10px] md:text-xs font-bold uppercase">Current Page</p>
              </div>
              <div className="border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-1 md:p-2 transform rotate-2">
                <p className="font-bangers text-lg md:text-xl text-[var(--color-ink)]">{remainingPages}</p>
                <p className="font-outfit text-[10px] md:text-xs font-bold uppercase">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-8">
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <span className="badge bg-[var(--color-primary)] text-lg md:text-2xl px-2 py-1 md:px-4 md:py-2 transform -rotate-2">{book.genre}</span>
              <span className="badge bg-[var(--color-ink)] text-white text-lg md:text-2xl px-2 py-1 md:px-4 md:py-2">{book.status.replace('-', ' ')}</span>
            </div>
            
            <div className="relative inline-block max-w-full z-10">
              <div 
                className="absolute inset-0 transform translate-x-2 translate-y-2 md:translate-x-3 md:translate-y-3 border-comic border-ink" 
                style={{ backgroundColor: book.accentColor }}
              ></div>
              <h1 className="relative text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bangers leading-[1.1] tracking-wide bg-white border-comic border-ink px-3 py-2 sm:px-6 sm:py-4 break-words">
                {book.title}
              </h1>
            </div>
            
            <div className="flex mt-2 md:mt-4 z-20 relative">
              <h2 className="text-lg sm:text-2xl font-outfit font-bold italic text-ink bg-[var(--color-paper)] inline-block px-3 md:px-6 py-1 md:py-2 border-comic border-ink shadow-comic transform rotate-1">
                by {book.author}
              </h2>
            </div>
          </div>

          <div className="comic-panel p-4 md:p-8 bg-[var(--color-paper)] relative">
            <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 bg-white border-[var(--comic-border)] border-[var(--color-ink)] rounded-full flex items-center justify-center">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-[var(--color-ink)] rounded-full"></div>
            </div>
            <h3 className="font-bangers text-2xl md:text-3xl mb-2 md:mb-4 bg-yellow-200 inline-block px-2">SUMMARY</h3>
            <p className="font-outfit text-base md:text-xl leading-relaxed font-medium">
              {book.summary}
            </p>
          </div>

          {book.favoriteQuote && (
            <div className="comic-panel p-4 md:p-8 bg-[var(--color-ink)] text-white relative">
              <svg className="absolute top-2 left-2 md:top-4 md:left-4 w-8 h-8 md:w-12 md:h-12 text-gray-700 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <h3 className="font-bangers text-2xl md:text-3xl mb-2 md:mb-4 ml-10 md:ml-14 text-[var(--color-primary)]">FAVORITE QUOTE</h3>
              <p className="font-outfit text-lg md:text-2xl italic font-bold ml-10 md:ml-14">
                "{book.favoriteQuote}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="comic-panel p-4 md:p-6 bg-white">
              <h3 className="font-bangers text-2xl md:text-3xl mb-2 md:mb-4 border-b-4 border-[var(--color-ink)] border-dotted pb-2">IMPACT SCORE</h3>
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    {i < book.impactScore ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + (i * 0.1), type: "spring" }}
                      >
                        <InkBurstSVG className="w-8 h-8 md:w-12 md:h-12 text-[var(--color-primary)] drop-shadow-[2px_2px_0px_var(--color-ink)]" />
                      </motion.div>
                    ) : (
                      <InkBurstSVG className="w-8 h-8 md:w-12 md:h-12 opacity-20" filled={false} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="comic-panel p-4 md:p-6 bg-white relative">
               <div className="absolute top-2 right-4 text-4xl md:text-6xl opacity-10">🗓️</div>
               <h3 className="font-bangers text-2xl md:text-3xl mb-2 md:mb-4 border-b-4 border-[var(--color-ink)] border-dotted pb-2">TIMELINE</h3>
               <div className="flex flex-col gap-2 md:gap-4 mt-4 md:mt-6">
                 <div className="flex items-center gap-3 md:gap-4">
                   <div className="w-4 h-4 bg-[var(--color-primary)] border-2 border-[var(--color-ink)] rounded-full"></div>
                   <div className="font-outfit font-bold text-base md:text-lg">
                     <span className="text-gray-500 uppercase text-xs md:text-sm block">Started</span>
                     {book.startedDate || 'Not started yet'}
                   </div>
                 </div>
                 <div className="w-1 h-4 md:h-6 bg-[var(--color-ink)] ml-1.5 opacity-20"></div>
                 <div className="flex items-center gap-3 md:gap-4">
                   <div className="w-3 h-3 md:w-4 md:h-4 bg-[var(--color-green)] border-2 border-[var(--color-ink)] rounded-full"></div>
                   <div className="font-outfit font-bold text-base md:text-lg">
                     <span className="text-gray-500 uppercase text-xs md:text-sm block">Finished</span>
                     {book.finishedDate || 'In progress'}
                   </div>
                 </div>
               </div>
            </div>
          </div>
          
          {book.personalThoughts && (
             <div className="comic-panel p-4 md:p-8 bg-[#FFB6C1] relative transform rotate-1 mb-8">
               {/* Tape decoration */}
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 md:w-20 h-4 md:h-6 bg-white/50 backdrop-blur-sm transform -rotate-2 border-comic border-ink shadow-sm z-20"></div>
               <h3 className="font-bangers text-2xl md:text-3xl mb-2 md:mb-4 underline decoration-ink decoration-4 underline-offset-4 relative z-30">CAPTAIN's LOG</h3>
               <p className="font-outfit text-lg md:text-xl font-medium leading-relaxed font-handwriting relative z-30">
                 {book.personalThoughts}
               </p>
             </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default BookDetails;
