import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, ArrowLeft, LogOut, Bell, Shield, Trash2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, profile } = useAuth();

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  const handleLogout = () => {
    toast({
      title: "👋 Logged out successfully",
      description: "See you next time!",
    });
    // In a real app, you would clear auth tokens here
    navigate("/");
  };

  const handleClearData = () => {
    toast({
      title: "🗑️ Data cleared",
      description: "All your purchase data has been cleared.",
    });
    // In a real app, you would clear user data here
  };

  const handleDeleteAccount = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "User information not available. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    
    try {
      console.log('Sending deletion email for user:', user.id, 'email:', profile.email);
      
      // Send deletion confirmation email
      const { data, error: emailError } = await supabase.functions.invoke('send-deletion-email', {
        body: {
          email: profile.email,
          firstName: profile.first_name || 'User',
          deletionUrl: `${window.location.origin}/confirm-deletion?token=${user.id}&email=${encodeURIComponent(profile.email)}`
        }
      });

      console.log('Email function response:', data, emailError);

      if (emailError) {
        console.error('Email error details:', emailError);
        throw emailError;
      }

      toast({
        title: "📧 Account deletion email sent!",
        description: "Please check your email to confirm account deletion. The email may take a few minutes to arrive.",
      });
    } catch (error: any) {
      console.error('Error sending deletion email:', error);
      toast({
        title: "Error sending deletion email",
        description: error.message || "Failed to send deletion email. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto py-8 px-4 space-y-6">
        {/* Theme Settings */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            🎨 Appearance
          </h2>
          <div className="flex items-center gap-4">
            <Sun className={!isDark ? "text-yellow-500" : "text-gray-400"} size={20} />
            <Switch
              checked={isDark}
              onCheckedChange={handleThemeChange}
              id="theme-toggle"
            />
            <Moon className={isDark ? "text-purple-400" : "text-gray-400"} size={20} />
            <Label htmlFor="theme-toggle" className="ml-2 text-gray-700 dark:text-gray-300">
              {isDark ? "Dark mode" : "Light mode"}
            </Label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Bell size={20} />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium text-gray-900 dark:text-white">Push Notifications 📱</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about your spending habits</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Shield size={20} />
            Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-collection" className="font-medium text-gray-900 dark:text-white">Data Collection 📊</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Help improve the app with anonymous usage data</p>
              </div>
              <Switch
                id="data-collection"
                checked={dataCollection}
                onCheckedChange={setDataCollection}
              />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Trash2 size={20} />
            Data Management
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="font-medium text-gray-900 dark:text-white">Clear All Data 🗑️</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This will permanently delete all your purchases and cannot be undone</p>
              <Button 
                variant="destructive" 
                onClick={handleClearData}
                className="w-full"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="font-medium text-red-700 dark:text-red-400">Delete Account ⚠️</Label>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                This will permanently delete your account, all your data, and cannot be undone. 
                You'll receive an email confirmation before deletion.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <AlertTriangle size={16} className="mr-2" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-red-500" size={20} />
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                      <p className="font-medium">You will lose:</p>
                      <div className="space-y-1 text-sm">
                        <div>• All your purchase data and insights</div>
                        <div>• Your profile information</div>
                        <div>• Your spending habits and triggers</div>
                        <div>• All account settings and preferences</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        We'll send you an email to confirm this action before proceeding.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Sending Email..." : "Send Deletion Email"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Account Actions */}
        <div className="space-y-3">
          <Button 
            onClick={signOut}
            variant="outline"
            className="w-full flex items-center gap-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
          >
            <LogOut size={20} />
            Logout 👋
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          <p>PurchasePal v1.0.0 🛍️</p>
          <p>Made with ❤️ for mindful shoppers</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
