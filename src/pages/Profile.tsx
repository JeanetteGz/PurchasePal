
import { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const placeholderImage =
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&q=80&facepad=2";

const Profile = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(placeholderImage);
  const [name, setName] = useState("Jesse");
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
    // In a real app, upload avatar and save info here.
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>👤</span> Profile
      </h2>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar className="h-20 w-20 cursor-pointer ring-2 ring-accent" onClick={handleAvatarClick}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInput}
              onChange={handleFileChange}
            />
            <span className="absolute bottom-0 right-0 bg-primary text-xs rounded-full px-2 py-1 font-semibold cursor-pointer" onClick={handleAvatarClick}>
              Change
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Input
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={80}
          />
        </div>
        <Button type="submit" className="w-full mt-4">Save Changes</Button>
      </form>
    </div>
  );
};

export default Profile;
