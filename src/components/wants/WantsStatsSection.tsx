
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
    <div className="px-4 pt-6">
      <Card className="bg-gradient-to-r from-purple-50/80 via-pink-50/80 to-purple-50/80 dark:from-gray-800/90 dark:via-purple-900/40 dark:to-gray-800/90 border-0 shadow-lg rounded-2xl backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Wishlist Insights
            </h3>
            <div className="h-1 w-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-xl p-4 shadow-md backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {wants.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Total Items</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-xl p-4 shadow-md backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {Object.keys(wantsByCategory).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Categories</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-xl p-4 shadow-md backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {wants.filter(want => want.product_url).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">With Links</div>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-700/60 rounded-xl p-4 shadow-md backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {wants.filter(want => want.product_image_url).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">With Images</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
