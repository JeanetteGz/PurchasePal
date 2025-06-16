
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, BarChart3 } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      title: "Emotional Awareness",
      description: "Track how you feel before, during, and after each purchase to understand your emotional spending patterns."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Mindful Decisions",
      description: "Get gentle reminders to pause and reflect on your emotions before making impulse purchases."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Insightful Analytics",
      description: "Visualize your spending patterns and discover which emotions drive your purchasing decisions."
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          How It Works
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Our unique approach combines emotional awareness with spending tracking to help you develop healthier financial habits.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full p-4">
                  {feature.icon}
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {feature.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
