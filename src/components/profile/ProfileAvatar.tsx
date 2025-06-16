
import { useRef, useState } from "react";
import { User, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  firstName: string;
  lastName: string;
  userId: string | undefined;
  refreshProfile: () => Promise<void>;
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  setAvatarUrl, 
  firstName, 
  lastName, 
  userId,
  refreshProfile 
}: ProfileAvatarProps) => {
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarClick = () => {
    if (fileInput.current) fileInput.current.click();
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!userId) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    try {
      // Delete existing avatar if it exists
      if (avatarUrl) {
        const existingPath = avatarUrl.split('/').pop();
        if (existingPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${existingPath}`]);
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
    if (!file || !userId) return;

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

    setUploadingAvatar(true);

    try {
      // Upload to Supabase Storage
      const publicUrl = await uploadAvatar(file);
      
      if (publicUrl) {
        // Update the avatar URL in the database
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: publicUrl })
          .eq('id', userId);

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
    }
  };

  const getInitials = () => {
    if (!firstName && !lastName) return null;
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
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
  );
};
