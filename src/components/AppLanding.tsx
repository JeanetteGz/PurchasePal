
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
      <div className="max-w-sm mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo size="md" />
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Mindful Spending
          </h1>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Starts with Understanding Your Emotions
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            PurchasePal helps you become more aware of the emotions driving your spending decisions. 
            Track your feelings, understand your patterns, and make more mindful financial choices.
          </p>
          
          <Button
            onClick={onGetStarted}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl py-4 font-bold text-lg shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* How It Works Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            How It Works
          </h3>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg p-2 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Ready to Transform?
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Join thousands discovering mindful spending through emotional awareness.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLanding;
