
import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Calendar,
  Clock,
  Target,
  Brain,
  Star,
  TrendingUp,
  Settings,
  MessageCircle,
  Bell,
  PlayCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ParentDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please sign in to access Parent Dashboard</div>
          <Button onClick={() => window.location.href = '/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const handleStartSession = () => {
    toast({
      title: "Study Session Started! 🚀",
      description: "Your child's learning session has begun.",
    });
  };

  const handleViewProgress = () => {
    toast({
      title: "Progress Updated! 📈",
      description: "Viewing detailed learning progress.",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent! 💬",
      description: "Your encouragement has been sent to your child.",
    });
  };

  // Mock data for parent dashboard
  const childrenData = [
    {
      id: 1,
      name: "Alex Johnson",
      age: 12,
      currentStreak: 5,
      totalHours: 24,
      completedTasks: 18,
      focusScore: 85,
      subjects: ["Math", "Science", "Programming"],
      recentAchievements: ["Week Warrior", "Focus Master"]
    }
  ];

  const weeklyStats = {
    totalStudyTime: 8.5,
    tasksCompleted: 12,
    averageFocus: 87,
    improvement: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black transition-all duration-300 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-star-twinkle-delayed opacity-80"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-star-twinkle opacity-70"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Parent Dashboard</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Monitor your child's learning progress and provide support
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{weeklyStats.totalStudyTime}h</div>
                <div className="text-purple-200">This Week</div>
                <Badge className="mt-2 bg-blue-100 text-blue-800">+2h from last week</Badge>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{weeklyStats.tasksCompleted}</div>
                <div className="text-purple-200">Tasks Completed</div>
                <Badge className="mt-2 bg-green-100 text-green-800">Great Progress!</Badge>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <Brain className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{weeklyStats.averageFocus}%</div>
                <div className="text-purple-200">Average Focus</div>
                <Badge className="mt-2 bg-purple-100 text-purple-800">Excellent</Badge>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">+{weeklyStats.improvement}%</div>
                <div className="text-purple-200">Improvement</div>
                <Badge className="mt-2 bg-orange-100 text-orange-800">Trending Up</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Child Progress Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Children Overview */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Children Overview
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Monitor your children's learning progress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {childrenData.map((child) => (
                    <div key={child.id} className="p-6 bg-white/5 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{child.name}</h3>
                          <p className="text-purple-300">Age {child.age} • {child.currentStreak} day streak</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{child.totalHours}h</div>
                          <div className="text-sm text-purple-300">Total Study Time</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">{child.completedTasks}</div>
                          <div className="text-xs text-purple-300">Tasks Done</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">{child.focusScore}%</div>
                          <div className="text-xs text-purple-300">Focus Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-white">{child.subjects.length}</div>
                          <div className="text-xs text-purple-300">Subjects</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-purple-300">Weekly Progress</span>
                          <span className="text-white">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {child.subjects.map((subject, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {subject}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleViewProgress} className="bg-blue-600 hover:bg-blue-700">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Progress
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleSendMessage} className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Learning Insights */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Learning Insights
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    AI-powered insights about your child's learning patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-900/40 rounded-lg">
                    <h3 className="font-semibold text-green-400 mb-2">🎯 Strengths Identified</h3>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Excellent focus during morning study sessions</li>
                      <li>• Strong performance in problem-solving tasks</li>
                      <li>• Consistent daily learning habit established</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-900/40 rounded-lg">
                    <h3 className="font-semibold text-blue-400 mb-2">💡 Recommendations</h3>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>• Consider introducing advanced math concepts</li>
                      <li>• Schedule 10-minute breaks between sessions</li>
                      <li>• Reward system for streak milestones</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-900/40 rounded-lg">
                    <h3 className="font-semibold text-purple-400 mb-2">📈 Growth Areas</h3>
                    <ul className="text-sm text-purple-300 space-y-1">
                      <li>• Reading comprehension could use more practice</li>
                      <li>• Try collaborative learning activities</li>
                      <li>• Introduce creative writing exercises</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Parent Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleStartSession} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Study Session
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Learning
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Settings className="h-4 w-4 mr-2" />
                    Set Goals
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/40 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                      🏆
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Week Warrior</div>
                      <div className="text-xs text-yellow-300">Completed 7 days straight</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-900/40 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Focus Master</div>
                      <div className="text-xs text-blue-300">85% average focus score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-900/40 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      ⚡
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Speed Learner</div>
                      <div className="text-xs text-purple-300">12 tasks this week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Chat for Parents */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    AI Parent Assistant
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Get personalized parenting advice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg text-sm text-gray-300">
                      "How can I help my child stay motivated?"
                    </div>
                    <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Chat with AI Assistant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
