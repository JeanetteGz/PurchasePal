
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  loading: boolean;
  uploadingAvatar: boolean;
  onCancel: () => void;
}

export const ProfileActions = ({ loading, uploadingAvatar, onCancel }: ProfileActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <Button 
        type="submit" 
        className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5" 
        disabled={loading || uploadingAvatar}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Saving Changes...
          </>
        ) : (
          <>
            💾 Save Changes
          </>
        )}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        className="flex-1 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 font-semibold transition-all duration-200"
      >
        Cancel
      </Button>
    </div>
  );
};
