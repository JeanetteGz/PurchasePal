
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has previously signed out (localStorage flag)
    const hasSignedOut = localStorage.getItem('userSignedOut') === 'true';
    setIsReturningUser(hasSignedOut);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        // Clear the signed out flag when user successfully signs in
        localStorage.removeItem('userSignedOut');
        
        toast({
          title: "Welcome back! 👋",
          description: "You've been signed in successfully.",
        });
        navigate('/');
      } else {
        // Validate signup fields
        if (!firstName || !lastName || !age) {
          throw new Error('Please fill in all fields');
        }
        
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
          throw new Error('Please enter a valid age between 1 and 120');
        }

        const { error } = await signUp(email, password, firstName, lastName, ageNum);
        if (error) throw error;
        
        toast({
          title: "Account created! 🎉",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-md mx-auto px-4 py-6 flex justify-center">
          <Logo size="lg" className="scale-125" />
        </div>
      </div>

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
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="25"
                      min="1"
                      max="120"
                      required={!isLogin}
                    />
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0" 
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Signing in...' : 'Creating account...') 
                  : (isLogin ? 'Sign In 🚀' : 'Create Account 🎉')
                }
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 hover:underline font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
