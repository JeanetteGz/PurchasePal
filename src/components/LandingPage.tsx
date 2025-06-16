
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sun, ShoppingBag, Heart, BarChart3, Brain, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="md" />
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-purple-600" />
              )}
            </Button>
            
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full px-6 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
              Mindful Spending
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
              Starts with Understanding Your Emotions
            </h2>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            PurchasePal helps you become more aware of the emotions driving your spending decisions. 
            Track your feelings, understand your patterns, and make more mindful financial choices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-8 py-4 font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Emotional Tracking Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Emotional Intelligence
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                Track Your Emotions, Transform Your Spending
              </h3>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Before each purchase, PurchasePal asks you to check in with your emotional state. 
                Are you stressed? Excited? Bored? Understanding these patterns helps you make more conscious decisions about when and why you spend money.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Pre-purchase emotion tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Post-purchase reflection</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Pattern recognition insights</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-sm">
                  <div className="text-center space-y-4">
                    <ShoppingBag className="h-12 w-12 text-purple-500 mx-auto" />
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">Before You Buy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">How are you feeling right now?</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-2">😊 Happy</div>
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-2">😰 Stressed</div>
                      <div className="bg-pink-100 dark:bg-pink-900 rounded-lg p-2">😴 Bored</div>
                      <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-2">🎉 Excited</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
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
    </div>
  );
};

export default LandingPage;
