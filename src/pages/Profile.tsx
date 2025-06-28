import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Star, Settings, Save, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [background, setBackground] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState('');

  const interests = [
    'Web Development', 'Mobile Apps', 'Machine Learning',
    'Data Science', 'Robotics', 'UI/UX Design', 
    'Game Development', 'Blockchain', 'IoT',
    'Arduino', 'Raspberry Pi', 'Cybersecurity',
    '3D Printing', 'Electronics'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
        toast({
          title: "Avatar Updated! 📸",
          description: "Your profile picture has been changed.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Save to localStorage for persistence
    const profileData = {
      name,
      experienceLevel,
      background,
      selectedInterests,
      avatarUrl
    };
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    toast({
      title: "Profile Saved! 🎉",
      description: "Your preferences have been updated successfully.",
    });
  };

  // Load profile data on component mount
  React.useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setName(profile.name || '');
      setExperienceLevel(profile.experienceLevel || '');
      setBackground(profile.background || '');
      setSelectedInterests(profile.selectedInterests || []);
      setAvatarUrl(profile.avatarUrl || '');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black transition-all duration-300 relative overflow-hidden space-scrollbar">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-star-twinkle-delayed opacity-80"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-star-twinkle opacity-70"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-star-twinkle-delayed opacity-90"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-50"></div>
      </div>
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Customize Your Profile</h1>
            <p className="text-xl text-gray-300 mb-8">Personalize your learning experience</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Avatar & Basic Info */}
            <Card className="lg:col-span-1 bg-black/30 backdrop-blur-md shadow-lg border-purple-500/30 hover:shadow-xl transition-all duration-300 animate-cosmic-glow">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex justify-center mb-4">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-white/30 cursor-pointer" onClick={handleAvatarClick}>
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="bg-white/20 text-white text-2xl">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-white">Profile Avatar</CardTitle>
                <CardDescription className="text-white/90">
                  Click to change your avatar
                </CardDescription>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Experience Level</label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="bg-black/40 border-purple-500/30 text-white focus:border-purple-400">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/40 border-purple-500/30 text-white">
                      <SelectItem value="beginner" className="hover:bg-purple-900/40">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="hover:bg-purple-900/40">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="hover:bg-purple-900/40">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleAvatarClick}
                  variant="outline"
                  className="w-full bg-purple-900/40 border-purple-500/30 text-purple-200 hover:bg-purple-900/60 animate-cosmic-glow"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Avatar
                </Button>
              </CardContent>
            </Card>

            {/* Interests & Goals */}
            <Card className="lg:col-span-2 bg-black/30 backdrop-blur-md shadow-lg border-purple-500/30 hover:shadow-xl transition-all duration-300 animate-cosmic-glow">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <CardTitle>Your Interests</CardTitle>
                </div>
                <CardDescription className="text-white/90">
                  Select topics that interest you for personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {interests.map((interest) => (
                    <Button
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInterest(interest)}
                      className={`text-sm transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none animate-cosmic-glow'
                          : 'bg-black/40 border-purple-500/30 text-purple-200 hover:bg-purple-900/40'
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Background</label>
                  <Input
                    placeholder="E.g. Computer Science student, hobbyist, etc."
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg transition-all transform hover:scale-105 disabled:transform-none disabled:opacity-50 animate-cosmic-glow"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
