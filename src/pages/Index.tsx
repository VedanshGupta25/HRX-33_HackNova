
import React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Trophy, Sparkles, Target, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Tasks",
      description: "Generate personalized learning tasks using Google Gemini AI",
      link: "/tasks",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Join study groups and learn together with peers",
      link: "/collaborate",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Trophy,
      title: "Track Achievements",
      description: "Monitor progress and unlock rewards as you learn",
      link: "/achievements",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-gray-900 dark:via-background dark:to-gray-800 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-foreground mb-6">
              AI-Powered Learning
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent block">
                Platform
              </span>
            </h1>
            <p className="text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform any concept or lecture into personalized, adaptive learning tasks powered by Google Gemini AI. 
              Build streaks, collaborate with peers, and unlock achievements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tasks">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg">
                  Start Learning
                </Button>
              </Link>
              <Link to="/achievements">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  View Achievements
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-4 bg-card/80 backdrop-blur-sm border-border shadow-lg h-full cursor-pointer">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-muted-foreground leading-relaxed">
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
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800 text-center">
              <CardContent className="p-8">
                <Flame className="h-12 w-12 text-orange-500 dark:text-orange-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-300 mb-2">Build Streaks</div>
                <div className="text-orange-600 dark:text-orange-400">Maintain daily learning habits</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 text-center">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">Personalized</div>
                <div className="text-blue-600 dark:text-blue-400">AI-generated learning paths</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800 text-center">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-green-500 dark:text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">Collaborative</div>
                <div className="text-green-600 dark:text-green-400">Learn with study groups</div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of learners using AI to accelerate their education
            </p>
            <Link to="/tasks">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
