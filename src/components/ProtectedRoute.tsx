
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CuteLoading } from './ui/cute-loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Give auth a reasonable time to load, then mark as checked
    const timeout = setTimeout(() => {
      setAuthChecked(true);
    }, 3000); // 3 seconds should be enough

    return () => clearTimeout(timeout);
  }, []);

  // If auth is still loading and we haven't reached timeout, show loading
  if (loading && !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <CuteLoading 
          variant="general" 
          message="Setting things up..." 
          size="lg"
        />
      </div>
    );
  }

  // If no user after auth check is complete, redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
