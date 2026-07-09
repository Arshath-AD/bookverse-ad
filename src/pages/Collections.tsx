
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooks, Book, BookStatus } from '../context/BookContext';
import { LightningSVG, InkBurstSVG } from '../components/Icons';

const BookCard = ({ book, index }: { book: Book, index: number }) => {
  const navigate = useNavigate();
  const progress = Math.round((book.currentPage / book.totalPages) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -10, 
        rotate: index % 2 === 0 ? 2 : -2,
        scale: 1.02
      }}
      onClick={() => navigate(`/book/${book.id}`)}
      className="comic-panel p-4 flex flex-col cursor-pointer bg-white group"
    >
      {/* Cover Image */}
      <div className="relative w-full h-64 border-[var(--comic-border)] border-[var(--color-ink)] overflow-hidden mb-4">
        <img 
          src={book.coverImage} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <span className="badge bg-[var(--color-paper)] text-[var(--color-ink)]">
            {book.genre}
          </span>
        </div>
      </div>

      {/* Book Info */}
      <div className="flex-grow flex flex-col">
        <h3 className="font-bangers text-xl md:text-2xl line-clamp-2 leading-tight mb-1">{book.title}</h3>
        <p className="font-outfit font-bold text-gray-600 text-sm md:text-base mb-4">{book.author}</p>
        
        <div className="mt-auto flex flex-col gap-3">
          {/* Progress Bar (Custom Comic Style) */}
          <div className="w-full border-[var(--comic-border)] border-[var(--color-ink)] h-6 relative overflow-hidden bg-[var(--color-paper)]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute top-0 left-0 h-full"
              style={{ backgroundColor: book.accentColor }}
            />
            {/* Hand-drawn hash marks for progress */}
            <div className="absolute inset-0 flex justify-between px-2 opacity-30 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-[2px] h-full bg-[var(--color-ink)] transform rotate-[15deg]"></div>
              ))}
            </div>
            <span className="absolute inset-0 flex items-center justify-center font-bangers text-sm z-10 text-[var(--color-ink)] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              {progress}% READ
            </span>
          </div>

          {/* Impact Score & Status */}
          <div className="flex justify-between items-center mt-2 border-t-2 border-dashed border-[var(--color-ink)] pt-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  {i < book.impactScore ? (
                    <InkBurstSVG className="w-5 h-5 text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
                  ) : (
                    <InkBurstSVG className="w-5 h-5 opacity-20" filled={false} />
                  )}
                </div>
              ))}
            </div>
            <span className="font-outfit text-xs font-bold uppercase tracking-wider bg-[var(--color-ink)] text-white px-2 py-1 transform -rotate-2">
              {book.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Doodle on Hover */}
      <LightningSVG className="absolute -top-4 -left-4 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const Collections = () => {
  const { status } = useParams<{ status: BookStatus | 'all' }>();
  const { books } = useBooks();

  const filteredBooks = status && status !== 'all' 
    ? books.filter(b => b.status === status)
    : books;

  const titles = {
    'reading': 'Current Expedition',
    'completed': 'Completed Adventures',
    'to-read': 'Future Universes',
    'abandoned': 'Abandoned Timelines',
    'all': 'Complete Universe'
  };

  const title = titles[status as keyof typeof titles] || 'Library';

  return (
    <div className="p-4 sm:p-6 md:p-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10 border-b-[var(--comic-border)] border-[var(--color-ink)] pb-4">
        <div className="flex items-center gap-3 md:gap-4">
          <h1 className="text-4xl md:text-7xl">{title}</h1>
          <span className="bg-[var(--color-ink)] text-[var(--color-paper)] font-bangers text-xl md:text-3xl px-3 py-1 md:px-4 transform rotate-3">
            {filteredBooks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="SEARCH UNIVERSE..." 
            className="comic-input w-full md:w-64"
          />
          <select className="comic-input bg-white cursor-pointer font-bangers uppercase">
            <option>All Genres</option>
            <option>Sci-Fi</option>
            <option>Fantasy</option>
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-[var(--comic-border)] border-[var(--color-ink)] bg-white border-dashed">
          <InkBurstSVG className="w-24 h-24 mb-6 opacity-20" filled={false} />
          <h2 className="text-3xl font-bangers">No Books Found Here!</h2>
          <p className="font-outfit text-xl mt-2 text-gray-500">Time to add some new adventures to your universe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredBooks.map((book, idx) => (
            <BookCard key={book.id} book={book} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
