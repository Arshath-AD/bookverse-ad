import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooks, Book, BookStatus } from '../context/BookContext';
import { BookOpenSVG, ArrowLeftSVG, InkBurstSVG } from '../components/Icons';

interface BookFormData {
  title: string;
  author: string;
  coverImage: string;
  summary: string;
  genre: string;
  status: BookStatus;
  totalPages: number | '';
  currentPage: number | '';
  startedDate: string;
  finishedDate: string;
  favoriteQuote: string;
  personalThoughts: string;
  impactScore: number;
}

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  
  const isEditing = !!id;
  const existingBook = isEditing ? books.find(b => b.id === id) : null;

  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    coverImage: '',
    summary: '',
    genre: '',
    status: 'to-read',
    totalPages: '',
    currentPage: '',
    startedDate: '',
    finishedDate: '',
    favoriteQuote: '',
    personalThoughts: '',
    impactScore: 0,
  });

  useEffect(() => {
    if (isEditing && existingBook) {
      setFormData({
        title: existingBook.title || '',
        author: existingBook.author || '',
        coverImage: existingBook.coverImage || '',
        summary: existingBook.summary || '',
        genre: existingBook.genre || '',
        status: existingBook.status || 'to-read',
        totalPages: existingBook.totalPages ?? '',
        currentPage: existingBook.currentPage ?? '',
        startedDate: existingBook.startedDate || '',
        finishedDate: existingBook.finishedDate || '',
        favoriteQuote: existingBook.favoriteQuote || '',
        personalThoughts: existingBook.personalThoughts || '',
        impactScore: existingBook.impactScore ?? 0,
      });
    }
  }, [isEditing, existingBook]);

  if (isEditing && !existingBook) {
    return <div className="p-12 text-center text-4xl font-bangers">Book not found!</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'totalPages' || name === 'currentPage') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : Math.max(0, parseInt(value, 10) || 0)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleScoreClick = (score: number) => {
    setFormData(prev => ({ ...prev, impactScore: score }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalPagesNum = typeof formData.totalPages === 'number' && formData.totalPages > 0 
      ? formData.totalPages 
      : 1;
    const currentPageNum = typeof formData.currentPage === 'number'
      ? Math.min(totalPagesNum, Math.max(0, formData.currentPage))
      : (formData.status === 'completed' ? totalPagesNum : 0);

    const colors = ['var(--color-primary)', 'var(--color-purple)', 'var(--color-green)', 'var(--color-red)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    if (isEditing && existingBook) {
      updateBook(existingBook.id, {
        ...formData,
        title: formData.title.trim(),
        author: formData.author.trim(),
        totalPages: totalPagesNum,
        currentPage: currentPageNum,
        startedDate: formData.startedDate || null,
        finishedDate: formData.finishedDate || null,
      });
      navigate(`/book/${existingBook.id}`);
    } else {
      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.title.trim() || 'Untitled Adventure',
        author: formData.author.trim() || 'Unknown Explorer',
        coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        summary: formData.summary.trim(),
        genre: formData.genre.trim() || 'General',
        status: formData.status,
        totalPages: totalPagesNum,
        currentPage: currentPageNum,
        startedDate: formData.startedDate || null,
        finishedDate: formData.finishedDate || null,
        favoriteQuote: formData.favoriteQuote.trim(),
        personalThoughts: formData.personalThoughts.trim(),
        impactScore: formData.impactScore || 0,
        accentColor: randomColor,
      };
      addBook(newBook);
      navigate(`/book/${newBook.id}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this book? This timeline will be erased forever!")) {
      if (existingBook) {
        deleteBook(existingBook.id);
        navigate('/dashboard');
      }
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="p-4 md:p-12 max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="comic-button bg-white flex items-center gap-2 group"
        >
          <ArrowLeftSVG className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          BACK
        </button>
        {isEditing && (
          <button 
            type="button"
            onClick={handleDelete}
            className="comic-button bg-[var(--color-red)] text-white"
          >
            DELETE
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="hidden sm:flex w-16 h-16 bg-[var(--color-primary)] border-comic border-ink items-center justify-center shadow-comic-sm transform -rotate-6 flex-shrink-0">
          <BookOpenSVG className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl uppercase">{isEditing ? 'EDIT TIMELINE' : 'ADD NEW ADVENTURE'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="comic-panel bg-white p-4 sm:p-6 md:p-10 flex flex-col gap-6 md:gap-10 relative">
        {/* Decorative Tape */}
        <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 w-24 md:w-32 h-6 md:h-8 bg-[var(--color-paper)] border border-gray-200 transform rotate-2 shadow-sm z-10 opacity-80 backdrop-blur-sm"></div>
        
        {/* SECTION: ESSENTIALS */}
        <div>
          <h2 className="font-bangers text-2xl md:text-3xl mb-4 bg-yellow-200 inline-block px-2">1. CORE IDENTITY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Book Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="comic-input bg-[var(--color-paper)]" placeholder="e.g. The Martian" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Author *</label>
              <input required name="author" value={formData.author} onChange={handleChange} className="comic-input bg-[var(--color-paper)]" placeholder="e.g. Andy Weir" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Cover Image URL</label>
              <input name="coverImage" value={formData.coverImage} onChange={handleChange} className="comic-input bg-[var(--color-paper)]" placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Genre *</label>
              <input required name="genre" value={formData.genre} onChange={handleChange} className="comic-input bg-[var(--color-paper)]" placeholder="e.g. Sci-Fi" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Total Pages *</label>
              <input 
                type="number" 
                required 
                min="1"
                name="totalPages" 
                value={formData.totalPages} 
                onChange={handleChange} 
                className="comic-input bg-[var(--color-paper)]" 
                placeholder="e.g. 350"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-4 md:mt-6">
            <label className="font-bangers text-xl tracking-wider">Summary</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} className="comic-input bg-[var(--color-paper)] min-h-[100px]" placeholder="Briefly what is this book about?" />
          </div>
        </div>

        <hr className="border-t-4 border-dashed border-ink opacity-20" />

        {/* SECTION: PROGRESS & LOGS */}
        <div>
          <h2 className="font-bangers text-2xl md:text-3xl mb-4 bg-purple-200 inline-block px-2">2. THE JOURNEY</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="comic-input bg-[var(--color-paper)] cursor-pointer font-bold uppercase">
                <option value="to-read">To Read</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Current Page</label>
              <input 
                type="number" 
                min="0"
                name="currentPage" 
                value={formData.currentPage} 
                onChange={handleChange} 
                className="comic-input bg-[var(--color-paper)]" 
                placeholder="0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Started Date</label>
              <input type="date" name="startedDate" value={formData.startedDate || ''} onChange={handleChange} className="comic-input bg-[var(--color-paper)]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Finished Date</label>
              <input type="date" name="finishedDate" value={formData.finishedDate || ''} onChange={handleChange} className="comic-input bg-[var(--color-paper)]" />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <label className="font-bangers text-xl tracking-wider">Captain's Log (Thoughts)</label>
            <textarea name="personalThoughts" value={formData.personalThoughts} onChange={handleChange} className="comic-input bg-[#FFB6C1] min-h-[100px] font-handwriting text-xl" placeholder="Your personal thoughts on the journey..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
            <div className="flex flex-col gap-2">
              <label className="font-bangers text-xl tracking-wider">Favorite Quote</label>
              <textarea name="favoriteQuote" value={formData.favoriteQuote} onChange={handleChange} className="comic-input bg-[var(--color-ink)] text-white min-h-[100px]" placeholder="Best line in the book..." />
            </div>
            <div className="flex flex-col gap-2 justify-center items-center p-4 md:p-6 border-comic border-ink bg-gray-50 border-dashed">
              <label className="font-bangers text-xl tracking-wider text-center">Impact Score</label>
              <div className="flex gap-1 md:gap-2 mt-4 cursor-pointer">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={score} onClick={() => handleScoreClick(score)} className="transform transition-transform hover:scale-125">
                    <InkBurstSVG 
                      className={`w-12 h-12 md:w-14 md:h-14 transition-colors ${Number(formData.impactScore) >= score ? 'text-[var(--color-primary)] drop-shadow-[2px_2px_0px_var(--color-ink)]' : 'opacity-20'}`} 
                      filled={Number(formData.impactScore) >= score} 
                    />
                  </div>
                ))}
              </div>
              <span className="font-outfit font-bold mt-2 text-gray-500">Tap to rate</span>
            </div>
          </div>
        </div>

        <button type="submit" className="comic-button bg-[var(--color-primary)] text-2xl md:text-3xl py-4 md:py-6 mt-2 md:mt-4 hover:bg-yellow-400">
          {isEditing ? 'UPDATE UNIVERSE' : 'ADD TO UNIVERSE'}
        </button>

      </form>
    </motion.div>
  );
};

export default BookForm;
