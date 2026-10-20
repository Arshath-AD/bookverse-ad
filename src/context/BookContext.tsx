import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

export interface BookOperationResult<T = void> {
  error: Error | null;
  data?: T;
}

interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  addBook: (book: Book) => Promise<BookOperationResult<Book>>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<BookOperationResult>;
  deleteBook: (id: string) => Promise<BookOperationResult>;
  refetchBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

// Helper to convert database row to clean Book object matching the exact interface
const mapDatabaseRowToBook = (row: any): Book => ({
  id: String(row.id),
  title: row.title ?? '',
  author: row.author ?? '',
  coverImage: row.coverImage ?? '',
  summary: row.summary ?? '',
  genre: row.genre ?? 'General',
  status: (row.status as BookStatus) ?? 'to-read',
  totalPages: typeof row.totalPages === 'number' ? row.totalPages : Number(row.totalPages) || 0,
  currentPage: typeof row.currentPage === 'number' ? row.currentPage : Number(row.currentPage) || 0,
  startedDate: row.startedDate ? String(row.startedDate) : null,
  finishedDate: row.finishedDate ? String(row.finishedDate) : null,
  favoriteQuote: row.favoriteQuote ?? '',
  personalThoughts: row.personalThoughts ?? '',
  impactScore: typeof row.impactScore === 'number' ? row.impactScore : Number(row.impactScore) || 0,
  accentColor: row.accentColor || 'var(--color-primary)',
});

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate concurrent requests in React Strict Mode
  const isFetchingRef = useRef(false);

  const fetchBooks = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local.');
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.from('books').select('*');
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      const mapped = (data || []).map(mapDatabaseRowToBook);
      setBooks(mapped);
    } catch (err: any) {
      console.error('[BookContext] Failed to load books from Supabase:', err);
      setError(err?.message || 'Failed to fetch books from Supabase.');
      // Note: We do NOT fall back to books.json here to avoid masking database state.
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const addBook = async (book: Book): Promise<BookOperationResult<Book>> => {
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials are not configured. Cannot add book.';
      setError(msg);
      return { error: new Error(msg) };
    }

    try {
      const idToUse = book.id?.trim() || 
        (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));

      const payload = {
        id: idToUse,
        title: book.title?.trim() || 'Untitled',
        author: book.author?.trim() || 'Unknown',
        coverImage: book.coverImage || '',
        summary: book.summary || '',
        genre: book.genre || 'General',
        status: book.status || 'to-read',
        totalPages: Number(book.totalPages) || 0,
        currentPage: Number(book.currentPage) || 0,
        startedDate: book.startedDate || null,
        finishedDate: book.finishedDate || null,
        favoriteQuote: book.favoriteQuote || '',
        personalThoughts: book.personalThoughts || '',
        impactScore: Number(book.impactScore) || 0,
        accentColor: book.accentColor || 'var(--color-primary)',
      };

      const { data, error: insertError } = await supabase
        .from('books')
        .insert([payload])
        .select()
        .single();

      if (insertError) {
        console.error('[BookContext] Add book failed:', insertError);
        return { error: new Error(insertError.message) };
      }

      const insertedBook = data ? mapDatabaseRowToBook(data) : (payload as Book);
      setBooks(prev => [...prev, insertedBook]);
      return { error: null, data: insertedBook };
    } catch (err: any) {
      console.error('[BookContext] Add book exception:', err);
      return { error: new Error(err?.message || 'Failed to add book') };
    }
  };

  const updateBook = async (id: string, updates: Partial<Book>): Promise<BookOperationResult> => {
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials are not configured. Cannot update book.';
      setError(msg);
      return { error: new Error(msg) };
    }

    try {
      const cleanUpdates: Record<string, any> = { ...updates };
      // Sanitize dates and numbers
      if ('startedDate' in cleanUpdates && !cleanUpdates.startedDate) {
        cleanUpdates.startedDate = null;
      }
      if ('finishedDate' in cleanUpdates && !cleanUpdates.finishedDate) {
        cleanUpdates.finishedDate = null;
      }
      if ('totalPages' in cleanUpdates) {
        cleanUpdates.totalPages = Number(cleanUpdates.totalPages) || 0;
      }
      if ('currentPage' in cleanUpdates) {
        cleanUpdates.currentPage = Number(cleanUpdates.currentPage) || 0;
      }
      if ('impactScore' in cleanUpdates) {
        cleanUpdates.impactScore = Number(cleanUpdates.impactScore) || 0;
      }
      delete cleanUpdates.id; // Do not modify primary key

      const { error: updateError } = await supabase
        .from('books')
        .update(cleanUpdates)
        .eq('id', id);

      if (updateError) {
        console.error(`[BookContext] Update book ${id} failed:`, updateError);
        return { error: new Error(updateError.message) };
      }

      setBooks(prev => prev.map(book => (book.id === id ? { ...book, ...updates } : book)));
      return { error: null };
    } catch (err: any) {
      console.error(`[BookContext] Update book ${id} exception:`, err);
      return { error: new Error(err?.message || 'Failed to update book') };
    }
  };

  const deleteBook = async (id: string): Promise<BookOperationResult> => {
    if (!isSupabaseConfigured) {
      const msg = 'Supabase credentials are not configured. Cannot delete book.';
      setError(msg);
      return { error: new Error(msg) };
    }

    try {
      const { error: deleteError } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error(`[BookContext] Delete book ${id} failed:`, deleteError);
        return { error: new Error(deleteError.message) };
      }

      setBooks(prev => prev.filter(book => book.id !== id));
      return { error: null };
    } catch (err: any) {
      console.error(`[BookContext] Delete book ${id} exception:`, err);
      return { error: new Error(err?.message || 'Failed to delete book') };
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        error,
        addBook,
        updateBook,
        deleteBook,
        refetchBooks: fetchBooks,
      }}
    >
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
