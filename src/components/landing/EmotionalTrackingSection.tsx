
import { ShoppingBag, Sparkles } from 'lucide-react';

export const EmotionalTrackingSection = () => {
  return (
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
  );
};
