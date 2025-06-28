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
          <ProgressDisplay 
            userProgress={userProgress}
            getXpForNextLevel={getXpForNextLevel}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4 transition-colors duration-300">
              Collaborative Learning
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Connect with study partners through your favorite platforms
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              
              return (
                <Card key={platform.name} className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300 dark:border-purple-700 animate-cosmic-glow">
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
                      className="bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300 focus:border-purple-400 focus:ring-purple-400 transition-all duration-300"
                    />
                    <Button 
                      onClick={() => handlePlatformRedirect(platform.name, platform.link)}
                      className={`w-full bg-gradient-to-r ${platform.color} ${platform.hoverColor} text-white transition-all duration-300 transform hover:scale-105 animate-cosmic-glow`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Join {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="mt-8 bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg dark:border-purple-700 transition-all duration-300 animate-cosmic-glow">
            <CardHeader>
              <CardTitle className="text-white transition-colors duration-300">Quick Start Tips</CardTitle>
              <CardDescription className="text-purple-200 transition-colors duration-300">
                How to get the most out of collaborative learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-900/40 rounded-lg border border-blue-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-blue-300 mb-2 transition-colors duration-300">WhatsApp Groups</h3>
                  <p className="text-blue-200 text-sm transition-colors duration-300">Perfect for quick discussions, sharing resources, and staying connected with study partners.</p>
                </div>
                <div className="p-4 bg-green-900/40 rounded-lg border border-green-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-green-300 mb-2 transition-colors duration-300">Google Meet</h3>
                  <p className="text-green-200 text-sm transition-colors duration-300">Ideal for virtual study sessions, screen sharing, and collaborative problem-solving.</p>
                </div>
                <div className="p-4 bg-purple-900/40 rounded-lg border border-purple-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-purple-300 mb-2 transition-colors duration-300">Discord</h3>
                  <p className="text-purple-200 text-sm transition-colors duration-300">Great for community building, voice channels, and organized study groups with different topics.</p>
                </div>
                <div className="p-4 bg-orange-900/40 rounded-lg border border-orange-500/30 transition-all duration-300">
                  <h3 className="font-semibold text-orange-300 mb-2 transition-colors duration-300">Pro Tips</h3>
                  <p className="text-orange-200 text-sm transition-colors duration-300">Set regular study times, share your progress, and celebrate achievements together!</p>
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
