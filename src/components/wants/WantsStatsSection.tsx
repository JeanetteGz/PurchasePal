
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
    <div className="pt-6">
      <Card className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-600/30 shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Wishlist Insights
            </h3>
            <div className="h-1 w-8 bg-gray-400 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 shadow-md transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                {wants.length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Total Items</div>
            </div>
            
            <div className="bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 shadow-md transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                {Object.keys(wantsByCategory).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">Categories</div>
            </div>
            
            <div className="bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 shadow-md transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                {wants.filter(want => want.product_url).length}
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-medium text-sm">With Links</div>
            </div>
            
            <div className="bg-white/20 dark:bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 shadow-md transform hover:scale-105 transition-transform">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
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
