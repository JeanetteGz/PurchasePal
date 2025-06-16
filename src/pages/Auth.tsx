
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthForm } from '@/components/auth/AuthForm';
import { AuthToggle } from '@/components/auth/AuthToggle';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isResetMode = searchParams.get('reset') === 'true';
  
  const [isLogin, setIsLogin] = useState(!isResetMode);
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has previously signed out (localStorage flag)
    const hasSignedOut = localStorage.getItem('userSignedOut') === 'true';
    setIsReturningUser(hasSignedOut);

    // Show password reset success message if coming from email
    if (isResetMode) {
      toast({
        title: "Password Reset Ready! 🔑",
        description: "You can now enter your new password below.",
      });
    }
  }, [isResetMode, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <AuthHeader />

      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-purple-200/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLogin 
                ? (isReturningUser ? 'Welcome Back! 👋' : 'Welcome! 👋')
                : 'Join PurchasePal! 🎉'
              }
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {isLogin 
                ? 'Sign in to your account to continue your mindful spending journey'
                : 'Create your account to start your mindful spending journey'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm isLogin={isLogin} isReturningUser={isReturningUser} />
            <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
