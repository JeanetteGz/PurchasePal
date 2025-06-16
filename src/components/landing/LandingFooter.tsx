
import { Logo } from '@/components/Logo';

export const LandingFooter = () => {
  return (
    <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-white/30 dark:border-gray-700/30 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <Logo size="sm" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ for mindful spenders everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
