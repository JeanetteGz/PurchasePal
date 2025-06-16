
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const ConfirmDeletion = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const clearAllAuthData = () => {
    try {
      // Clear all possible auth-related storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('auth')) {
          sessionStorage.removeItem(key);
        }
      });

      // Set flags to indicate account was deleted
      localStorage.setItem('accountDeleted', 'true');
      localStorage.setItem('userSignedOut', 'true');
    } catch (error) {
      console.warn('Error clearing auth data:', error);
    }
  };

  const handleConfirmDeletion = async () => {
    if (!token || !email) {
      toast({
        title: "Error",
        description: "Invalid deletion link.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting account deletion process for user:', token);
      
      // Clear auth data immediately to prevent auth loops
      clearAllAuthData();
      
      // Sign out from all sessions first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        console.warn('Sign out error (continuing):', signOutError);
      }
      
      // Call the delete account edge function
      console.log('Calling delete-account function...');
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { userId: token }
      });

      console.log('Delete account response:', { data, error });

      if (error) {
        console.error('Delete account function error:', error);
        throw new Error(error.message || 'Failed to delete account');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Account deletion failed');
      }

      console.log('Account deletion completed successfully');
      setDeleted(true);
      
      toast({
        title: "Account Deleted Successfully! ✅",
        description: "Your account and all data have been permanently removed.",
      });
      
      // Redirect after success with a clean slate
      setTimeout(() => {
        // Force a complete page reload to ensure clean state
        window.location.replace('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      // Clear auth state even if deletion fails to prevent stuck state
      clearAllAuthData();
      
      toast({
        title: "Error deleting account",
        description: error.message || "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
      
      // Navigate to auth page even on error to prevent being stuck
      setTimeout(() => {
        window.location.replace('/auth');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Logo size="sm" className="mx-auto mb-4" />
            <CardTitle className="text-red-600">Invalid Link</CardTitle>
            <CardDescription>
              This deletion link is invalid or has expired.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (deleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-green-200">
          <CardHeader className="text-center">
            <Logo size="sm" className="mx-auto mb-4" />
            <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
            <CardTitle className="text-green-600 text-2xl">Account Successfully Deleted</CardTitle>
            <CardDescription className="text-green-700 text-lg">
              Your account and all data have been permanently removed. You will be redirected shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center">
          <Logo size="sm" className="mx-auto mb-4" />
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
          <CardTitle className="text-red-600">Confirm Account Deletion</CardTitle>
          <CardDescription className="text-red-600">
            You're about to permanently delete your PurchasePal account for <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ This action cannot be undone</h3>
            <p className="text-red-700 text-sm">
              Deleting your account will permanently remove all your data, including:
            </p>
            <ul className="list-disc list-inside text-red-700 text-sm mt-2 space-y-1">
              <li>All purchase records and insights</li>
              <li>Profile information and settings</li>
              <li>Spending habits and trigger data</li>
              <li>Account preferences</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirmDeletion}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting Account...
                </>
              ) : (
                "Yes, Delete My Account"
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              disabled={loading}
              className="w-full"
            >
              Cancel - Keep My Account
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Having second thoughts? You can always contact support before proceeding.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmDeletion;
