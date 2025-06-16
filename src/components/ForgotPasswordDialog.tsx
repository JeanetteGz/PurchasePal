
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Loader2 } from 'lucide-react';

interface ForgotPasswordDialogProps {
  trigger?: React.ReactNode;
  defaultEmail?: string;
}

export const ForgotPasswordDialog = ({ trigger, defaultEmail = '' }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get user's profile to fetch first name for personalized email
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('email', email)
        .single();

      const firstName = profile?.first_name || 'there';
      
      // Determine the correct reset URL based on environment
      const resetUrl = window.location.hostname === 'localhost' 
        ? `${window.location.origin}/password-reset`
        : `https://${window.location.hostname}/password-reset`;
      
      console.log('Sending password reset email with URL:', resetUrl);
      
      // Send our custom styled email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-password-reset', {
        body: { 
          email, 
          firstName,
          resetUrl
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Password reset email sent! 📧",
        description: "Check your email for instructions to reset your password. Click the button in the email to go to the reset page.",
      });
      
      setOpen(false);
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <Mail size={18} className="mr-2" />
            Reset Password
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl bg-white/95 backdrop-blur-sm border border-purple-200/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="text-blue-500" size={24} />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your email address and we'll send you a secure link to reset your password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <Label htmlFor="reset-email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-2 h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 h-12"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Email
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
