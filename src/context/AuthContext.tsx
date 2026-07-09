import { createContext, useContext, useState, ReactNode } from 'react';

// SHA-256 hash for 'bookverse@AD'
const STORED_HASH = 'dc454becdb741888bb898da3f986a248ae6ef97006e0f188097a4eb836328a2c';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (passphrase: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('bookverse_auth') === 'true';
  });

  const hashString = async (input: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const login = async (passphrase: string) => {
    try {
      const hash = await hashString(passphrase);
      if (hash === STORED_HASH) {
        setIsAuthenticated(true);
        sessionStorage.setItem('bookverse_auth', 'true');
        return true;
      }
    } catch (e) {
      console.error("Hashing failed", e);
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('bookverse_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
