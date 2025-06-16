
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
  const isResetSuccess = searchParams.get('reset') === 'success';
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const errorDescription = searchParams.get('error_description');
  
  const [isLogin, setIsLogin] = useState(!isResetMode);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [emailVerificationMessage, setEmailVerificationMessage] = useState('');
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has previously signed out (localStorage flag)
    const hasSignedOut = localStorage.getItem('userSignedOut') === 'true';
    setIsReturningUser(hasSignedOut);

    // Handle different URL parameters
    if (isResetMode) {
      toast({
        title: "Password Reset Ready! 🔑",
        description: "You can now enter your new password below.",
      });
    } else if (isResetSuccess) {
      // Password was successfully reset
      setPasswordResetMessage('Password updated! Please sign in with your new password.');
      toast({
        title: "Password Updated! 🎉",
        description: "Your password has been successfully changed. You can now sign in with your new password.",
      });
      setIsLogin(true); // Ensure we're on login mode
    } else if (type === 'signup' && tokenHash && !errorDescription) {
      // Successfully verified email
      setEmailVerificationMessage('Email verified! Please log in below.');
      toast({
        title: "Email Verified! ✅",
        description: "Your email has been successfully verified. You can now log in.",
      });
      setIsLogin(true); // Ensure we're on login mode
    } else if (type === 'signup' && errorDescription) {
      // Email verification failed
      toast({
        title: "Verification Failed ❌",
        description: "There was an issue verifying your email. Please try signing up again.",
        variant: "destructive",
      });
    }
  }, [isResetMode, isResetSuccess, tokenHash, type, errorDescription, toast]);

  const getTitle = () => {
    if (passwordResetMessage) return 'Password Updated! 🎉';
    if (emailVerificationMessage) return 'Welcome Back! ✅';
    if (isLogin) return isReturningUser ? 'Welcome Back! 👋' : 'Welcome! 👋';
    return 'Join PurchasePal! 🎉';
  };

  const getDescription = () => {
    if (passwordResetMessage) return passwordResetMessage;
    if (emailVerificationMessage) return emailVerificationMessage;
    if (isLogin) return 'Sign in to your account to continue your mindful spending journey';
    return 'Create your account to start your mindful spending journey';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <AuthHeader />

      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-purple-200/50 dark:border-purple-800/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              {getTitle()}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {getDescription()}
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
