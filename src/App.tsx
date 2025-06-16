
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

// Lazy load components for better performance
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute"));
const LandingPage = lazy(() => import("@/components/LandingPage"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Auth = lazy(() => import("./pages/Auth"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const ConfirmDeletion = lazy(() => import("./pages/ConfirmDeletion"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showLanding, setShowLanding] = useState(() => {
    // Check if user has visited before or is on auth page
    const hasVisited = localStorage.getItem('hasVisited') === 'true';
    const currentPath = window.location.pathname;
    return !hasVisited && currentPath === '/';
  });

  // Listen for changes to localStorage and location changes
  useEffect(() => {
    const checkShowLanding = () => {
      const hasVisited = localStorage.getItem('hasVisited') === 'true';
      const isHomePage = location.pathname === '/';
      setShowLanding(!hasVisited && isHomePage);
    };

    checkShowLanding();

    // Listen for storage events (when localStorage is modified)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hasVisited') {
        checkShowLanding();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/password-reset');
      }
      if (event === 'SIGNED_IN' && session) {
        // User signed in, hide landing page
        setShowLanding(false);
        localStorage.setItem('hasVisited', 'true');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGetStarted = () => {
    // Instead of hiding landing page, redirect to auth page
    localStorage.setItem('hasVisited', 'true');
    navigate('/auth');
  };

  if (showLanding && location.pathname === '/') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LandingPage onGetStarted={handleGetStarted} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/confirm-deletion" element={<ConfirmDeletion />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
