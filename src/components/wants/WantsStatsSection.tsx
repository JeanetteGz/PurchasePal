
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface WantItem {
  id: string;
  product_name: string;
  category: string;
  product_url: string;
  product_image_url?: string;
  notes?: string;
  created_at: string;
}

interface WantsStatsSectionProps {
  wants: WantItem[];
  wantsByCategory: Record<string, WantItem[]>;
}

export const WantsStatsSection = ({ wants, wantsByCategory }: WantsStatsSectionProps) => {
  if (wants.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto pt-16">
      <Card className="bg-gradient-to-r from-purple-100/80 via-pink-100/80 to-purple-100/80 dark:from-gray-800/90 dark:via-purple-900/40 dark:to-gray-800/90 border-0 shadow-2xl rounded-3xl backdrop-blur-sm">
        <CardContent className="p-12">
          <div className="flex items-center gap-4 justify-center mb-10">
            <div className="h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Wishlist Insights
            </h3>
            <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                {wants.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Total Items</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                {Object.keys(wantsByCategory).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">Categories</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                {wants.filter(want => want.product_url).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">With Links</div>
            </div>
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-3xl p-8 shadow-xl backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                {wants.filter(want => want.product_image_url).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">With Images</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
