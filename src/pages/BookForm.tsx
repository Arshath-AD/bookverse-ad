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

const PRESET_COVERS = [
  { label: '🚀 Sci-Fi', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop' },
  { label: '⚡ Cyberpunk', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop' },
  { label: '🏰 Fantasy', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop' },
  { label: '🌊 Ocean', url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=600&auto=format&fit=crop' },
  { label: '🏜️ Desert', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop' },
  { label: '📖 Classic', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop' },
];

const BookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  
  const isEditing = !!id;
  const existingBook = isEditing ? books.find(b => b.id === id) : null;
  const [previewError, setPreviewError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    } else if (name === 'coverImage') {
      let cleaned = value.trim();
      if (cleaned.includes('google.') && cleaned.includes('imgurl=')) {
        try {
          const urlObj = new URL(cleaned);
          const direct = urlObj.searchParams.get('imgurl');
          if (direct) cleaned = decodeURIComponent(direct);
        } catch {
          // ignore
        }
      }
      setFormData(prev => ({
        ...prev,
        coverImage: cleaned
      }));
      setPreviewError(false);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large! Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({
            ...prev,
            coverImage: event.target!.result as string
          }));
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScoreClick = (score: number) => {
    setFormData(prev => ({ ...prev, impactScore: score }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const totalPagesNum = typeof formData.totalPages === 'number' && formData.totalPages > 0 
      ? formData.totalPages 
      : 1;
    const currentPageNum = typeof formData.currentPage === 'number'
      ? Math.min(totalPagesNum, Math.max(0, formData.currentPage))
      : (formData.status === 'completed' ? totalPagesNum : 0);

    const colors = ['var(--color-primary)', 'var(--color-purple)', 'var(--color-green)', 'var(--color-red)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    if (isEditing && existingBook) {
      const res = await updateBook(existingBook.id, {
        ...formData,
        title: formData.title.trim(),
        author: formData.author.trim(),
        coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        totalPages: totalPagesNum,
        currentPage: currentPageNum,
        startedDate: formData.startedDate || null,
        finishedDate: formData.finishedDate || null,
      });
      setIsSubmitting(false);
      if (res?.error) {
        setSubmitError(`Could not update book: ${res.error.message}`);
        return;
      }
      navigate(`/book/${existingBook.id}`);
    } else {
      const newBook: Book = {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
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
      const res = await addBook(newBook);
      setIsSubmitting(false);
      if (res?.error) {
        setSubmitError(`Could not add book to universe: ${res.error.message}`);
        return;
      }
      const targetId = res?.data?.id || newBook.id;
      navigate(`/book/${targetId}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book? This timeline will be erased forever!")) {
      if (existingBook) {
        setIsSubmitting(true);
        const res = await deleteBook(existingBook.id);
        setIsSubmitting(false);
        if (res?.error) {
          alert(`Failed to delete book: ${res.error.message}`);
          return;
        }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
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

          {/* COVER IMAGE STUDIO */}
          <div className="comic-panel p-4 md:p-6 bg-[var(--color-paper)] mt-6 flex flex-col md:flex-row gap-6 items-center">
            {/* Live Cover Preview */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-36 h-48 md:w-44 md:h-60 bg-white border-comic border-ink shadow-comic overflow-hidden flex items-center justify-center">
                {formData.coverImage ? (
                  <img 
                    src={formData.coverImage} 
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    onError={() => setPreviewError(true)}
                    onLoad={() => setPreviewError(false)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center opacity-40">
                    <BookOpenSVG className="w-12 h-12 mb-2" />
                    <span className="font-bangers text-sm">NO COVER YET</span>
                  </div>
                )}
                {/* Status Badge */}
                {formData.coverImage && (
                  <div className="absolute bottom-2 left-2 right-2">
                    {previewError ? (
                      <span className="badge bg-[var(--color-red)] text-white text-xs w-full justify-center">
                        ⚠️ Broken URL
                      </span>
                    ) : (
                      <span className="badge bg-[var(--color-green)] text-white text-xs w-full justify-center">
                        ✓ Image Loaded
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="font-bangers text-sm mt-2 text-gray-600">LIVE PREVIEW</span>
            </div>

            {/* URL Input & Controls */}
            <div className="flex-grow flex flex-col gap-3 w-full">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="font-bangers text-xl tracking-wider">Cover Image URL</label>
                  {formData.coverImage && (
                    <button 
                      type="button" 
                      onClick={() => { setFormData(prev => ({ ...prev, coverImage: '' })); setPreviewError(false); }}
                      className="text-xs font-outfit font-bold text-red-600 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input 
                  name="coverImage" 
                  value={formData.coverImage} 
                  onChange={handleChange} 
                  className="comic-input bg-white w-full" 
                  placeholder="Paste any image URL (e.g. https://...)" 
                />
                {previewError && (
                  <p className="text-xs font-outfit text-red-600 font-bold mt-1">
                    ⚠️ This image URL could not be loaded. Please check that it's a direct image link (.jpg, .png) or select a preset below!
                  </p>
                )}
              </div>

              {/* Or Upload Image from Device */}
              <div className="flex items-center gap-3">
                <label className="comic-button bg-white text-ink text-sm py-1.5 px-3 cursor-pointer shadow-sm hover:bg-yellow-50">
                  📁 UPLOAD FROM DEVICE
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>
                <span className="text-xs font-outfit font-bold text-gray-500">JPG, PNG, WebP (under 2MB)</span>
              </div>

              {/* Presets */}
              <div>
                <span className="font-bangers text-sm text-gray-700 block mb-1">OR CHOOSE A PRESET COVER:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COVERS.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, coverImage: preset.url }));
                        setPreviewError(false);
                      }}
                      className="badge bg-white text-ink hover:bg-primary transition-colors text-xs py-1 px-2 cursor-pointer shadow-sm"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
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

        {submitError && (
          <div className="border-comic border-ink bg-red-100 p-4 font-bangers text-xl text-red-700 shadow-comic-sm">
            💥 ERROR: {submitError}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="comic-button bg-[var(--color-primary)] text-2xl md:text-3xl py-4 md:py-6 mt-2 md:mt-4 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'SAVING TO UNIVERSE...' : (isEditing ? 'UPDATE UNIVERSE' : 'ADD TO UNIVERSE')}
        </button>

      </form>
    </motion.div>
  );
};

export default BookForm;
