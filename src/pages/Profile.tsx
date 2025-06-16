
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { ProfileFormFields } from '@/components/profile/ProfileFormFields';
import { ProfileActions } from '@/components/profile/ProfileActions';

const Profile = () => {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
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

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  const handleBackToDashboard = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <ProfileHeader onBackToDashboard={handleBackToDashboard} />

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
              <ProfileAvatar
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                firstName={firstName}
                lastName={lastName}
                userId={user?.id}
                refreshProfile={refreshProfile}
              />
              
              {/* Form Fields */}
              <ProfileFormFields
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
              />
              
              {/* Action Buttons */}
              <ProfileActions
                loading={loading}
                uploadingAvatar={uploadingAvatar}
                onCancel={handleCancel}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
