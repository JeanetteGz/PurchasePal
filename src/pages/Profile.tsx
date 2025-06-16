
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Update form fields when profile data is loaded
  useEffect(() => {
    console.log('Profile data in useEffect:', profile);
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      // Set the avatar URL from the profile
      setAvatarUrl(profile.avatar_url || null);
    }
    if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const handleAvatarClick = () => {
    if (fileInput.current) fileInput.current.click();
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    try {
      // Delete existing avatar if it exists
      if (profile?.avatar_url) {
        const existingPath = profile.avatar_url.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${existingPath}`]);
        }
      }

      // Upload new avatar
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error('Error uploading avatar:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setTempFile(file);
    setUploadingAvatar(true);

    try {
      // Upload to Supabase Storage
      const publicUrl = await uploadAvatar(file);
      
      if (publicUrl) {
        // Update the avatar URL in the database
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating avatar URL:', error);
          toast({
            title: "Error updating avatar",
            description: "Failed to save avatar URL to profile.",
            variant: "destructive",
          });
        } else {
          setAvatarUrl(publicUrl);
          await refreshProfile();
          toast({
            title: "Avatar updated! ✨",
            description: "Your profile picture has been updated successfully.",
          });
        }
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your avatar.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
      setTempFile(null);
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
            avatar_url: avatarUrl,
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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-700/60 px-4 py-2 rounded-full"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-12 px-6">
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Your Profile ✨
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your personal information and preferences
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSave} className="space-y-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 cursor-pointer ring-4 ring-purple-200 dark:ring-purple-700 hover:ring-purple-300 dark:hover:ring-purple-600 transition-all duration-300 shadow-lg" onClick={handleAvatarClick}>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-2xl">
                      {getInitials() ? (
                        <span className="text-purple-600 dark:text-purple-300 font-bold">{getInitials()}</span>
                      ) : (
                        <User className="text-purple-400 dark:text-purple-400" size={48} />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3 cursor-pointer hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg group-hover:scale-110" onClick={handleAvatarClick}>
                    {uploadingAvatar ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Camera className="text-white" size={16} />
                    )}
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInput}
                    onChange={handleFileChange}
                    disabled={uploadingAvatar}
                  />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                  Click on your avatar to upload a new profile picture 📸
                  <br />
                  <span className="text-xs">Max size: 5MB. Formats: JPG, PNG, GIF</span>
                </p>
              </div>
              
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    maxLength={30}
                    placeholder="Enter your first name"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    maxLength={30}
                    placeholder="Enter your last name"
                    className="rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Email Address
                </label>
                <Input
                  value={email}
                  readOnly
                  className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                  type="email"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  🔒 Email cannot be changed for security reasons
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5" 
                  disabled={loading || uploadingAvatar}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      💾 Save Changes
                    </>
                  )}
                </Button>
                
                <Link to="/" className="flex-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 font-semibold transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
