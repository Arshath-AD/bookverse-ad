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
    const saved = localStorage.getItem('bookverse_books');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialBooks as Book[];
  });

  useEffect(() => {
    localStorage.setItem('bookverse_books', JSON.stringify(books));
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
