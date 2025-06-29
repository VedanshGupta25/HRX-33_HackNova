
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
  TrendingUp,
  Settings,
  MessageCircle,
  Bell,
  PlayCircle,
  Loader2,
  LogIn
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ParentDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();

  React.useEffect(() => {
    console.log('Parent Dashboard - Auth state:', { user: !!user, profile, authLoading });
  }, [user, profile, authLoading]);

  const handleSignInRedirect = () => {
    navigate('/signin');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Parent Dashboard</h2>
              <p className="text-gray-300 mb-6">
                Sign in to monitor your child's learning progress, set goals, and provide support for their educational journey.
              </p>
              <Button onClick={handleSignInRedirect} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
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

  const handleScheduleLearning = () => {
    toast({
      title: "Learning Scheduled! 📅",
      description: "Study session has been scheduled successfully.",
    });
  };

  const handleSetGoals = () => {
    toast({
      title: "Goals Updated! 🎯",
      description: "Learning goals have been set for this week.",
    });
  };

  const handleNotifications = () => {
    toast({
      title: "Notifications Configured! 🔔",
      description: "You'll receive updates about your child's progress.",
    });
  };

  const handleChatWithAI = () => {
    toast({
      title: "AI Assistant Ready! 🤖",
      description: "Starting conversation with your parenting assistant.",
    });
  };

  // Mock data for parent dashboard - in real app this would come from API
  const childrenData = [
    {
      id: 1,
      name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : "Your Child",
      age: 12,
      currentStreak: 5,
      totalHours: 24.5,
      completedTasks: 18,
      focusScore: 85,
      subjects: ["JavaScript", "Math", "Science", "Reading"],
      recentAchievements: ["Week Warrior", "Focus Master", "Speed Learner"]
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
              Monitor your child's learning progress and provide support for their educational journey
            </p>
            <div className="text-lg text-purple-300">
              Welcome back, {profile?.first_name || 'Parent'}! 👋
            </div>
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
                    Monitor your children's learning progress and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {childrenData.map((child) => (
                    <div key={child.id} className="p-6 bg-white/5 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{child.name}</h3>
                          <p className="text-purple-300">Age {child.age} • {child.currentStreak} day streak 🔥</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{child.totalHours}h</div>
                          <div className="text-sm text-purple-300">Total Study Time</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-900/30 rounded-lg">
                          <div className="text-lg font-semibold text-white">{child.completedTasks}</div>
                          <div className="text-xs text-blue-300">Tasks Done</div>
                        </div>
                        <div className="text-center p-3 bg-green-900/30 rounded-lg">
                          <div className="text-lg font-semibold text-white">{child.focusScore}%</div>
                          <div className="text-xs text-green-300">Focus Score</div>
                        </div>
                        <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                          <div className="text-lg font-semibold text-white">{child.subjects.length}</div>
                          <div className="text-xs text-purple-300">Active Subjects</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-purple-300">Weekly Progress Goal</span>
                          <span className="text-white">75%</span>
                        </div>
                        <Progress value={75} className="h-3 bg-gray-700" />
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {child.subjects.map((subject, index) => (
                          <Badge key={index} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            {subject}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" onClick={handleViewProgress} className="bg-blue-600 hover:bg-blue-700">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Progress
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleSendMessage} className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-white">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleStartSession} className="border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Session
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
                    AI Learning Insights
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Personalized insights about your child's learning patterns and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-900/40 rounded-lg border border-green-500/30">
                    <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                      🎯 Strengths Identified
                    </h3>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Excellent focus during morning study sessions (9-11 AM)</li>
                      <li>• Strong performance in problem-solving and logical thinking tasks</li>
                      <li>• Consistent daily learning habit with {childrenData[0].currentStreak}-day streak</li>
                      <li>• Shows improvement in JavaScript programming concepts</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-900/40 rounded-lg border border-blue-500/30">
                    <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      💡 AI Recommendations
                    </h3>
                    <ul className="text-sm text-blue-300 space-y-1">
                      <li>• Consider introducing advanced math concepts to challenge growth</li>
                      <li>• Schedule 10-minute breaks between 45-minute study sessions</li>
                      <li>• Implement reward system for reaching streak milestones</li>
                      <li>• Try collaborative coding projects to enhance social learning</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-900/40 rounded-lg border border-purple-500/30">
                    <h3 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                      📈 Growth Opportunities
                    </h3>
                    <ul className="text-sm text-purple-300 space-y-1">
                      <li>• Reading comprehension could benefit from daily practice</li>
                      <li>• Introduce creative writing exercises to boost expression skills</li>
                      <li>• Consider group learning activities for social skill development</li>
                      <li>• Add more hands-on science experiments to learning routine</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Parent Controls */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Parent Controls</CardTitle>
                  <CardDescription className="text-purple-200">
                    Manage your child's learning experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleStartSession} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Study Session
                  </Button>
                  <Button onClick={handleScheduleLearning} variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Learning
                  </Button>
                  <Button onClick={handleSetGoals} variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Target className="h-4 w-4 mr-2" />
                    Set Weekly Goals
                  </Button>
                  <Button onClick={handleNotifications} variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
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
                  <CardDescription className="text-purple-200">
                    Celebrate your child's accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-900/40 rounded-lg border border-yellow-500/30">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-lg">
                      🏆
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Week Warrior</div>
                      <div className="text-xs text-yellow-300">Completed 7 days of consistent learning</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-900/40 rounded-lg border border-blue-500/30">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-lg">
                      🎯
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Focus Master</div>
                      <div className="text-xs text-blue-300">Maintained 85% average focus score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-900/40 rounded-lg border border-purple-500/30">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                      ⚡
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Speed Learner</div>
                      <div className="text-xs text-purple-300">Completed 12 tasks this week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Parent Assistant */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    AI Parent Assistant
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Get personalized parenting advice and support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-white/5 rounded-lg text-sm text-gray-300 border border-purple-500/20">
                      <div className="flex items-start gap-2">
                        <div className="text-purple-400">💭</div>
                        <div>
                          <strong>"How can I help my child stay motivated during challenging topics?"</strong>
                          <p className="text-xs mt-1 text-gray-400">Example question you can ask</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleChatWithAI} variant="outline" className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50 text-white hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-blue-600/30">
                      <MessageCircle className="h-4 w-4 mr-2" />
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
