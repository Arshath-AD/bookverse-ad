
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BookProvider } from './context/BookContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Collections from './pages/Collections';
import BookDetails from './pages/BookDetails';
import BookForm from './pages/BookForm';
import Unlock from './pages/Unlock';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/unlock" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <BookProvider>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/unlock" element={<Unlock />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/collections/:status" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
              <Route path="/add-book" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
              <Route path="/edit-book/:id" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </BookProvider>
    </AuthProvider>
  );
}

export default App;
