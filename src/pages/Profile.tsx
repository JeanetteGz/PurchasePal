
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const placeholderImage =
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&q=80&facepad=2";

const Profile = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(placeholderImage);
  const [firstName, setFirstName] = useState("Jesse");
  const [lastName, setLastName] = useState("Smith");
  const [email] = useState("jesse.smith@example.com");
  const [bio, setBio] = useState("Mindful spender 🧘‍♂️");
  const [tempFile, setTempFile] = useState<File | null>(null);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", { firstName, lastName, bio, tempFile });
  };

  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
          <h1 className="flex-1 text-xl font-bold text-center">Profile Settings ⚙️</h1>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto py-10 px-4">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 cursor-pointer ring-2 ring-accent hover:ring-4 transition-all" onClick={handleAvatarClick}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInput}
                onChange={handleFileChange}
              />
              <span className="absolute bottom-0 right-0 bg-primary text-xs rounded-full px-2 py-1 font-semibold cursor-pointer text-primary-foreground hover:bg-primary/90 transition-colors" onClick={handleAvatarClick}>
                📷
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Click to upload a new profile picture 📸
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name ✨</label>
              <Input
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                maxLength={30}
                placeholder="First name"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name ✨</label>
              <Input
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                maxLength={30}
                placeholder="Last name"
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email 📧</label>
            <Input
              value={email}
              readOnly
              className="bg-muted cursor-not-allowed rounded-xl"
              type="email"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed 🔒
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio 💭</label>
            <Input
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={80}
              placeholder="Tell us about yourself"
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {bio.length}/80 characters
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button type="submit" className="flex-1 rounded-xl">
              💾 Save Changes
            </Button>
            <Link to="/">
              <Button type="button" variant="outline" className="rounded-xl">
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
