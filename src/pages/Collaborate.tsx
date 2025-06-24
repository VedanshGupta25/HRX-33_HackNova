
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ProgressDisplay } from '@/components/ProgressDisplay';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Video, Users, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Collaborate = () => {
  const { userProgress, getXpForNextLevel, joinCollaborativeSession } = useGamification();
  const { toast } = useToast();
  const [whatsappLink, setWhatsappLink] = useState('');
  const [discordLink, setDiscordLink] = useState('');
  const [googlemeetLink, setGooglemeetLink] = useState('');

  const handlePlatformRedirect = (platform: string, link: string) => {
    if (!link.trim()) {
      toast({
        title: `${platform} Link Required`,
        description: `Please enter a ${platform} link first.`,
        variant: "destructive"
      });
      return;
    }
    
    // Track collaborative session join
    const result = joinCollaborativeSession();
    
    if (result.unlockedAchievements.length > 0) {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: `You unlocked ${result.unlockedAchievements.length} new achievement${result.unlockedAchievements.length > 1 ? 's' : ''}!`,
      });
    }
    
    window.open(link, '_blank');
    toast({
      title: `Redirecting to ${platform}`,
      description: `Opening ${platform} in a new tab...`,
    });
  };

  const platforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      link: whatsappLink,
      setLink: setWhatsappLink,
      placeholder: 'Enter WhatsApp group/chat link'
    },
    {
      name: 'Google Meet',
      icon: Video,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      link: googlemeetLink,
      setLink: setGooglemeetLink,
      placeholder: 'Enter Google Meet link'
    },
    {
      name: 'Discord',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      link: discordLink,
      setLink: setDiscordLink,
      placeholder: 'Enter Discord server/channel link'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressDisplay 
            userProgress={userProgress}
            getXpForNextLevel={getXpForNextLevel}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Collaborative Learning
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with study partners through your favorite platforms
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              
              return (
                <Card key={platform.name} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className={`bg-gradient-to-r ${platform.color} text-white rounded-t-lg`}>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <IconComponent className="h-5 w-5" />
                      {platform.name}
                    </CardTitle>
                    <CardDescription className="text-white/90">
                      Connect via {platform.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <Input
                      placeholder={platform.placeholder}
                      value={platform.link}
                      onChange={(e) => platform.setLink(e.target.value)}
                      className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      onClick={() => handlePlatformRedirect(platform.name, platform.link)}
                      className={`w-full bg-gradient-to-r ${platform.color} ${platform.hoverColor} text-white transition-all duration-300 transform hover:scale-105`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Join {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Start Tips</CardTitle>
              <CardDescription>
                How to get the most out of collaborative learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">WhatsApp Groups</h3>
                  <p className="text-blue-600 text-sm">Perfect for quick discussions, sharing resources, and staying connected with study partners.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Google Meet</h3>
                  <p className="text-green-600 text-sm">Ideal for virtual study sessions, screen sharing, and collaborative problem-solving.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Discord</h3>
                  <p className="text-purple-600 text-sm">Great for community building, voice channels, and organized study groups with different topics.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Pro Tips</h3>
                  <p className="text-orange-600 text-sm">Set regular study times, share your progress, and celebrate achievements together!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Collaborate;
