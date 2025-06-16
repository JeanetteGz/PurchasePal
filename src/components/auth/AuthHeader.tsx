
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export const AuthHeader = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Clear the visited flag to show landing page again
    localStorage.removeItem('hasVisited');
    navigate('/');
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
      <div className="max-w-md mx-auto px-4 py-6 flex justify-center">
        <button onClick={handleLogoClick} className="transition-transform hover:scale-105">
          <Logo size="lg" className="scale-125" />
        </button>
      </div>
    </div>
  );
};
