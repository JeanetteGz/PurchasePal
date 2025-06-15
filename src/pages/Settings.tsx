
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, ArrowLeft, LogOut, Bell, Shield, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");
  const [notifications, setNotifications] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hover:bg-white/50 px-3 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <h1 className="flex-1 text-xl font-bold text-center">Settings ⚙️</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto py-8 px-4 space-y-6">
        {/* Theme Settings */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
            <Label htmlFor="theme-toggle" className="ml-2">
              {isDark ? "Dark mode" : "Light mode"}
            </Label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium">Push Notifications 📱</Label>
                <p className="text-sm text-gray-600">Get notified about your spending habits</p>
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
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} />
            Privacy
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-collection" className="font-medium">Data Collection 📊</Label>
                <p className="text-sm text-gray-600">Help improve the app with anonymous usage data</p>
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
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trash2 size={20} />
            Data Management
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="font-medium">Clear All Data 🗑️</Label>
              <p className="text-sm text-gray-600 mb-3">This will permanently delete all your purchases and cannot be undone</p>
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

        <Separator className="my-6" />

        {/* Account Actions */}
        <div className="space-y-3">
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout 👋
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>PausePal v1.0.0 ⏸️</p>
          <p>Made with ❤️ for mindful shoppers</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
