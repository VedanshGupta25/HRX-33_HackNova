
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Customize Your Profile</h1>
            <p className="text-xl text-gray-600 mb-8">Personalize your learning experience</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Avatar & Basic Info */}
            <Card className="lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 border-4 border-white/30">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-white/20 text-white text-2xl">
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-white">Profile Avatar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="bg-white border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
                      <SelectItem value="beginner" className="hover:bg-blue-50">Beginner</SelectItem>
                      <SelectItem value="intermediate" className="hover:bg-blue-50">Intermediate</SelectItem>
                      <SelectItem value="advanced" className="hover:bg-blue-50">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Interests & Goals */}
            <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
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
                          ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400'
                      }`}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h3 className="text-gray-800 font-semibold">Background & Goals</h3>
                  </div>
                  <textarea
                    placeholder="Tell us about your educational background, current projects, and learning goals..."
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-md bg-white border border-gray-300 text-gray-800 placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="mt-8 text-center">
            <Button 
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </Button>
          </div>

          {/* Selected Interests Display */}
          {selectedInterests.length > 0 && (
            <Card className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-gray-800 font-medium mb-3">Selected Interests ({selectedInterests.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <Badge key={interest} className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
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
