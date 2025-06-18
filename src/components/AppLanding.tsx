
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Brain, BarChart3, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface AppLandingProps {
  onGetStarted: () => void;
}

const AppLanding = ({ onGetStarted }: AppLandingProps) => {
  const features = [
    {
      icon: <Heart className="h-6 w-6 text-pink-500" />,
      title: "Emotional Awareness",
      description: "Track how you feel before, during, and after purchases."
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Mindful Decisions",
      description: "Get gentle reminders to pause and reflect on emotions."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      title: "Insightful Analytics",
      description: "Visualize patterns and discover emotional triggers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-md mx-auto px-6 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-8 flex-1 flex flex-col justify-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Mindful Spending
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Starts with Understanding Your Emotions
            </h2>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed px-2">
            PurchasePal helps you become more aware of the emotions driving your spending decisions. 
            Track your feelings, understand your patterns, and make more mindful financial choices.
          </p>
          
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl py-6 font-bold text-lg shadow-xl active:scale-95 transition-all"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>

        {/* How It Works Section */}
        <div className="space-y-6 mb-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            How It Works
          </h3>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-xl p-3 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
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
        <div className="text-center space-y-4 pb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Ready to Transform?
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm px-4">
            Join thousands discovering mindful spending through emotional awareness.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLanding;
