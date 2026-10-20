import React, { createContext, useContext, useState, useEffect } from 'react';
import initialBooks from '../data/books.json';

export type BookStatus = 'reading' | 'completed' | 'abandoned' | 'to-read';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  summary: string;
  genre: string;
  status: BookStatus;
  totalPages: number;
  currentPage: number;
  startedDate: string | null;
  finishedDate: string | null;
  favoriteQuote: string;
  personalThoughts: string;
  impactScore: number;
  accentColor: string;
}

interface BookContextType {
  books: Book[];
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('bookverse_books');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const brokenMap: Record<string, string> = {
            'photo-1614729939124-03290b56c9ce': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=600&auto=format&fit=crop',
            'photo-1547895240-a1789c0b1154': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
            'photo-1605806616949-1e87b487cb2a': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
            'photo-1533038590840-1cbea6e8a4a5': 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?q=80&w=600&auto=format&fit=crop',
          };
          const healed = parsed.map((book: Book) => {
            if (book.coverImage) {
              for (const [brokenId, fixUrl] of Object.entries(brokenMap)) {
                if (book.coverImage.includes(brokenId)) {
                  return { ...book, coverImage: fixUrl };
                }
              }
            }
            return book;
          });
          return healed;
        }
      }
    } catch (e) {
      console.error('Failed to load books from localStorage:', e);
    }
    return initialBooks as Book[];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bookverse_books', JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage:', e);
    }
  }, [books]);

  const addBook = (book: Book) => {
    setBooks(prev => [...prev, book]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updates } : book));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
