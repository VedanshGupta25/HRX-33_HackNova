
import React, { useState } from 'react';
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
import { User, Star, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [background, setBackground] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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

  const handleSaveProfile = () => {
    // Here you would typically save to a backend or local storage
    toast({
      title: "Profile Saved! 🎉",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Customize Your Profile</h1>
            <p className="text-purple-200 text-lg">Personalize your learning experience</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Avatar & Basic Info */}
            <Card className="lg:col-span-1 bg-purple-800/30 border-purple-600/30 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-cyan-500 text-white text-2xl">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-white">Profile Avatar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-purple-700/30 border-purple-600/50 text-white placeholder:text-purple-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Experience Level</label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="bg-purple-700/30 border-purple-600/50 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-800 border-purple-600">
                      <SelectItem value="beginner" className="text-white hover:bg-purple-700">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="text-white hover:bg-purple-700">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="text-white hover:bg-purple-700">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Interests & Goals */}
            <Card className="lg:col-span-2 bg-purple-800/30 border-purple-600/30 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-cyan-400" />
                  <CardTitle className="text-white">Your Interests</CardTitle>
                </div>
                <CardDescription className="text-purple-200">
                  Select topics that interest you for personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {interests.map((interest) => (
                    <Button
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInterest(interest)}
                      className={`text-sm transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500'
                          : 'bg-transparent border-purple-500 text-purple-200 hover:bg-purple-700/30 hover:border-cyan-400'
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-white font-semibold">Background & Goals</h3>
                  </div>
                  <textarea
                    placeholder="Tell us about your educational background, current projects, and learning goals..."
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-md bg-purple-700/30 border border-purple-600/50 text-white placeholder:text-purple-300 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </Button>
          </div>

          {/* Selected Interests Display */}
          {selectedInterests.length > 0 && (
            <Card className="mt-8 bg-purple-800/20 border-purple-600/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-white font-medium mb-3">Selected Interests ({selectedInterests.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <Badge key={interest} className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
