
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("Mindful spender 🧘‍♂️");
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Update form fields when profile data is loaded
  useEffect(() => {
    console.log('Profile data in useEffect:', profile);
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
    }
    if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const handleAvatarClick = () => {
    if (fileInput.current) fileInput.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTempFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // First, check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing profile:', fetchError);
        throw fetchError;
      }

      let result;
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile');
        result = await supabase
          .from('profiles')
          .update({
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
      } else {
        // Create new profile
        console.log('Creating new profile');
        result = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || email,
            first_name: firstName,
            last_name: lastName,
            age: 25, // Default age, you might want to make this configurable
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }

      if (result.error) {
        console.error('Error saving profile:', result.error);
        throw result.error;
      }

      console.log('Profile saved successfully');

      // Refresh the profile data after update
      await refreshProfile();

      toast({
        title: "Profile updated! ✨",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      console.error('Profile save error:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (!firstName && !lastName) return null;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-b border-white/20 dark:border-gray-700/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hover:bg-white/50 dark:hover:bg-gray-700/50 px-3 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto py-10 px-4">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 cursor-pointer ring-2 ring-accent dark:ring-blue-400 hover:ring-4 transition-all" onClick={handleAvatarClick}>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-blue-900 dark:to-purple-900">
                  {getInitials() ? (
                    <span className="text-purple-600 dark:text-blue-300 font-semibold">{getInitials()}</span>
                  ) : (
                    <User className="text-purple-400 dark:text-blue-400" size={32} />
                  )}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInput}
                onChange={handleFileChange}
              />
              <span className="absolute bottom-0 right-0 bg-primary dark:bg-blue-600 text-xs rounded-full px-2 py-1 font-semibold cursor-pointer text-primary-foreground hover:bg-primary/90 dark:hover:bg-blue-700 transition-colors" onClick={handleAvatarClick}>
                📷
              </span>
            </div>
            <p className="text-xs text-muted-foreground dark:text-gray-400 text-center">
              Click to upload a new profile picture 📸
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">First Name ✨</label>
              <Input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                maxLength={30}
                placeholder="First name"
                className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Last Name ✨</label>
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                maxLength={30}
                placeholder="Last name"
                className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Email 📧</label>
            <Input
              value={email}
              readOnly
              className="bg-muted dark:bg-gray-700 cursor-not-allowed rounded-xl dark:border-gray-600 dark:text-gray-300"
              type="email"
            />
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              Email cannot be changed 🔒
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Bio 💭</label>
            <Input
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={80}
              placeholder="Tell us about yourself"
              className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
            <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
              {bio.length}/80 characters
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button type="submit" className="flex-1 rounded-xl dark:bg-blue-600 dark:hover:bg-blue-700" disabled={loading}>
              {loading ? "💾 Saving..." : "💾 Save Changes"}
            </Button>
            <Link to="/">
              <Button type="button" variant="outline" className="rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                ❌ Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
