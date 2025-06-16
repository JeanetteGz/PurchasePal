import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, ArrowLeft, LogOut, Bell, Shield, Trash2, AlertTriangle, User, Palette, Mail, HelpCircle } from "lucide-react";
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
  const [isClearingData, setIsClearingData] = useState(false);
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

  const handleClearData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setIsClearingData(true);
    
    try {
      console.log('Clearing all data for user:', user.id);
      
      // Delete all user purchases
      const { error: purchasesError } = await supabase
        .from('user_purchases')
        .delete()
        .eq('user_id', user.id);

      if (purchasesError) {
        console.error('Error deleting user purchases:', purchasesError);
        throw purchasesError;
      }

      // Delete all user wants
      const { error: wantsError } = await supabase
        .from('user_wants')
        .delete()
        .eq('user_id', user.id);

      if (wantsError) {
        console.error('Error deleting user wants:', wantsError);
        throw wantsError;
      }

      console.log('Successfully cleared all user data');
      
      toast({
        title: "🗑️ Data cleared successfully",
        description: "All your purchase data and wants have been permanently deleted.",
      });
    } catch (error: any) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error clearing data",
        description: error.message || "Failed to clear data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearingData(false);
    }
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

  const handleContactSupport = () => {
    const subject = encodeURIComponent('PurchasePal - Support Request');
    const body = encodeURIComponent('Hi PurchasePal Team,\n\nI need help with:\n\n[Please describe your issue here]\n\nThank you!');
    window.open(`mailto:purchasepalapp@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 group"
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <User className="text-slate-400" size={20} />
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Settings</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-8 px-6 space-y-8">
        {/* Theme Settings */}
        <div className="group">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                <Palette size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Appearance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customize how the app looks</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${!isDark ? "bg-yellow-100 text-yellow-600" : "bg-slate-600 text-slate-400"}`}>
                    <Sun size={18} />
                  </div>
                  <Switch
                    checked={isDark}
                    onCheckedChange={handleThemeChange}
                    id="theme-toggle"
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <div className={`p-2 rounded-lg transition-colors ${isDark ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400" : "bg-slate-200 text-slate-400"}`}>
                    <Moon size={18} />
                  </div>
                </div>
              </div>
              <Label htmlFor="theme-toggle" className="font-medium text-slate-700 dark:text-slate-300">
                {isDark ? "Dark mode" : "Light mode"}
              </Label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="group">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <Bell size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your notification preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📱</div>
                  <div>
                    <Label htmlFor="notifications" className="font-medium text-slate-900 dark:text-white">Push Notifications</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about your spending habits</p>
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="group">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Privacy</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Control your data and privacy settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <Label htmlFor="data-collection" className="font-medium text-slate-900 dark:text-white">Data Collection</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Help improve the app with anonymous usage data</p>
                  </div>
                </div>
                <Switch
                  id="data-collection"
                  checked={dataCollection}
                  onCheckedChange={setDataCollection}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="group">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Need Help?</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get support when you need it</p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200/50 dark:border-cyan-800/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">💬</div>
                <div className="flex-1">
                  <Label className="font-semibold text-slate-900 dark:text-white text-lg">Contact Support</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Having trouble with the app? Our support team is here to help you get back on track.
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleContactSupport}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 rounded-2xl shadow-lg"
              >
                <Mail size={18} className="mr-2" />
                Contact Support
                <span className="text-lg ml-1">📧</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="group">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                <Trash2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Data Management</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your stored data</p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">🗑️</div>
                <div className="flex-1">
                  <Label className="font-semibold text-slate-900 dark:text-white text-lg">Clear All Data</Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    This will permanently delete all your purchases and wants and cannot be undone
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 rounded-2xl shadow-lg"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <Trash2 className="text-red-500" size={20} />
                      Clear All Data?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>This will permanently delete all your data including:</p>
                      <div className="space-y-1 text-sm">
                        <div>• All your purchase records</div>
                        <div>• All your wants and wishlist items</div>
                        <div>• All spending insights and history</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 font-medium">
                        This action cannot be undone. Your account will remain active but all data will be lost.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearData}
                      disabled={isClearingData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isClearingData ? "Clearing Data..." : "Yes, Clear All Data"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="group">
          <div className="bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-950/30 dark:to-pink-950/30 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-red-200/50 dark:border-red-800/50 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                <p className="text-sm text-red-500 dark:text-red-400">Irreversible actions</p>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <Label className="font-semibold text-red-700 dark:text-red-400 text-lg">Delete Account</Label>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1 leading-relaxed">
                    This will permanently delete your account, all your data, and cannot be undone. 
                    You'll receive an email confirmation before deletion.
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium py-3 rounded-2xl shadow-lg"
                  >
                    <AlertTriangle size={18} className="mr-2" />
                    Delete My Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
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

        <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

        {/* Account Actions */}
        <div className="space-y-4">
          <Button 
            onClick={signOut}
            variant="outline"
            className="w-full flex items-center gap-3 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium py-4 rounded-2xl transition-all duration-200 hover:border-red-300 dark:hover:border-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
            <span className="text-lg">👋</span>
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center pt-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">PurchasePal v1.0.0</span>
            <span className="text-lg">🛍️</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Made with 💜 for mindful shoppers</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
