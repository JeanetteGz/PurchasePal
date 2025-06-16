
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ForgotPasswordDialog } from '@/components/ForgotPasswordDialog';

interface AuthFormProps {
  isLogin: boolean;
  isReturningUser: boolean;
}

export const AuthForm = ({ isLogin, isReturningUser }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <>
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
      
      {/* Forgot Password Link - only show on login */}
      {isLogin && (
        <div className="mt-4 text-center">
          <ForgotPasswordDialog 
            defaultEmail={email}
            trigger={
              <button className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 hover:underline font-medium">
                Forgot your password? 🔑
              </button>
            }
          />
        </div>
      )}
    </>
  );
};
