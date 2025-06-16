
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection = ({ onGetStarted }: CTASectionProps) => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center space-y-8">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Ready to Transform Your Relationship with Money?
        </h3>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join thousands of users who have discovered the power of mindful spending through emotional awareness.
        </p>
        
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-12 py-4 font-bold text-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
        >
          Get Started for Free
          <Sparkles className="ml-2 h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};
