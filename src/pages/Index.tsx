import React from 'react';
import { Header } from '@/components/Header';
import { World3D } from '@/components/World3D';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Trophy, Sparkles, Target, Flame, Rocket, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tasks",
      description: "Generate personalized learning tasks using Google Gemini AI",
      link: "/tasks",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups and learn together with peers",
      link: "/collaborate",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Trophy,
      title: "Track Achievements",
      description: "Monitor progress and unlock rewards as you learn",
      link: "/achievements",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black transition-colors duration-300 relative overflow-hidden space-scrollbar">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-star-twinkle-delayed opacity-80"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-star-twinkle opacity-70"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-star-twinkle-delayed opacity-90"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-50"></div>
        <div className="absolute top-32 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-star-twinkle opacity-75"></div>
        <div className="absolute top-72 left-1/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-star-twinkle-delayed opacity-65"></div>
        <div className="absolute top-120 right-1/2 w-1 h-1 bg-green-400 rounded-full animate-star-twinkle opacity-85"></div>
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with 3D World */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Text content */}
            <div className="text-left space-y-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-cosmic-glow">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <span className="text-blue-400 font-semibold animate-float">AI-Powered Learning</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Explore the
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block animate-float-delayed">
                  Universe of
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent block animate-float-slow">
                  Knowledge
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Transform any concept into personalized learning adventures powered by Google Gemini AI. 
                Navigate through knowledge like exploring a vast universe.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/tasks">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-cosmic-glow">
                    <Rocket className="mr-2 h-5 w-5" />
                    Launch Learning
                  </Button>
                </Link>
                <Link to="/achievements">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300">
                    <Star className="mr-2 h-5 w-5" />
                    View Achievements
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - 3D World */}
            <div className="relative">
              <World3D height="500px" className="w-full" />
              {/* Floating elements around the 3D world */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center animate-float-delayed shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="absolute top-1/2 -left-8 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center animate-float-slow shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute top-1/4 -right-6 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-float shadow-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 bg-black/20 backdrop-blur-md border-purple-500/30 shadow-lg h-full cursor-pointer hover:border-purple-400/50">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid gap-6 md:grid-cols-3 mb-20">
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-md border-orange-500/30 text-center">
              <CardContent className="p-8">
                <Flame className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-orange-300 mb-2">Build Streaks</div>
                <div className="text-orange-200">Maintain daily learning habits</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border-blue-500/30 text-center">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-300 mb-2">Personalized</div>
                <div className="text-blue-200">AI-generated learning paths</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-purple-500/30 text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-300 mb-2">Collaborative</div>
                <div className="text-purple-200">Learn with study groups</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Explore Your Learning Universe?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of learners navigating the cosmos of knowledge
            </p>
            <Link to="/tasks">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Rocket className="mr-2 h-5 w-5" />
                Begin Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
