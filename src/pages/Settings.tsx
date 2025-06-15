
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>⚙️</span> Settings
      </h2>
      <div className="flex items-center gap-4">
        <Sun className={!isDark ? "text-yellow-500" : "text-gray-400"} />
        <Switch
          checked={isDark}
          onCheckedChange={handleThemeChange}
          id="theme-toggle"
        />
        <Moon className={isDark ? "text-purple-400" : "text-gray-400"} />
        <Label htmlFor="theme-toggle" className="ml-4">
          {isDark ? "Dark mode" : "Light mode"}
        </Label>
      </div>
    </div>
  );
};

export default Settings;
