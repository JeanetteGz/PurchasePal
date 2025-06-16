
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Brain, Gift, Trophy, Target, Users, TrendingUp, Heart, Zap, Sparkles } from 'lucide-react';

interface ComingSoonSectionProps {
  onGetStarted: () => void;
}

export const ComingSoonSection = ({ onGetStarted }: ComingSoonSectionProps) => {
  const comingSoonFeatures = [
    {
      icon: <Shield className="h-6 w-6 text-green-500" />,
      title: "Bank Integration for Smart Shopping Organization",
      description: "Securely connect your bank accounts to automatically detect and categorize shopping transactions, helping you understand your shopping habits better."
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "AI-Powered Impulse Spending Insights",
      description: "Get personalized feedback and visual reports showing trends in your impulse spending with AI analysis of your shopping data."
    },
    {
      icon: <Gift className="h-6 w-6 text-pink-500" />,
      title: "Rewards System",
      description: "Earn points for avoiding impulse purchases and redeem them for coupons at popular retailers like Starbucks, Dunkin', and Target."
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "Leaderboard & Scoreboard",
      description: "Compete with others who share similar spending goals, earn recognition badges, and win exclusive monthly rewards."
    },
    {
      icon: <Target className="h-6 w-6 text-blue-500" />,
      title: "Weekly Challenges",
      description: "Join fun challenges like 'No Impulse Buys for 3 Days' with community stats and small incentives to keep you motivated."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-500" />,
      title: "Community Support & Tips Feed",
      description: "Share success stories, budget tips, and encouragement with a supportive community of mindful spenders."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
      title: "Personalized Shopping Budget Assistant",
      description: "Set monthly spending limits for different categories and receive alerts when approaching your limits."
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Mood-Based Spending Tracker",
      description: "Understand emotional triggers behind impulse purchases with optional mood logging before each spend."
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
          <Zap className="h-4 w-4" />
          Coming Soon
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Exciting Features on the Horizon
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We're constantly evolving PurchasePal with powerful financial wellness tools, AI-driven insights, and real rewards for better spending habits.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comingSoonFeatures.map((feature, index) => (
          <Card key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-orange-200/50 dark:border-orange-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-pink-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
              Soon
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 rounded-lg p-2 flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Be among the first to experience these game-changing features!
        </p>
        <Button
          onClick={onGetStarted}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl px-8 py-4 font-bold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
        >
          Join the Beta
          <Sparkles className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
