
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Brain, BarChart3, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface AppLandingProps {
  onGetStarted: () => void;
}

const AppLanding = ({ onGetStarted }: AppLandingProps) => {
  const features = [
    {
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      title: "Emotional Awareness",
      description: "Track how you feel before, during, and after purchases."
    },
    {
      icon: <Brain className="h-5 w-5 text-purple-500" />,
      title: "Mindful Decisions",
      description: "Get gentle reminders to pause and reflect on emotions."
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      title: "Insightful Analytics",
      description: "Visualize patterns and discover emotional triggers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 safe-area-top safe-area-bottom">
      <div className="flex flex-col min-h-screen">
        {/* Header with Logo */}
        <div className="flex-shrink-0 text-center pt-16 pb-8">
          <Logo size="lg" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between px-6 pb-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Mindful Spending
              </h1>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Starts with Understanding Your Emotions
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm px-2">
              PurchasePal helps you become more aware of the emotions driving your spending decisions. 
              Track your feelings, understand your patterns, and make more mindful financial choices.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-6 my-8">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
              How It Works
            </h3>
            
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-2 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
                <Sparkles className="h-4 w-4" />
                Ready to Transform?
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm px-4 mb-6">
                Join thousands discovering mindful spending through emotional awareness.
              </p>
            </div>
            
            <Button
              onClick={onGetStarted}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl py-4 font-bold text-lg shadow-xl active:scale-95 transition-all h-14"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLanding;
