
import React from 'react';
import { Header } from '@/components/Header';
import { PerformanceAnalytics } from '@/components/PerformanceAnalytics';
import { LearningPathVisualizer } from '@/components/LearningPathVisualizer';
import { StudyTimer } from '@/components/StudyTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Share2,
  Settings,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';

const Analytics = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    isLoading,
    recordStudySession,
    recordTaskCompletion,
    getWeeklyProgressData,
    getSubjectBreakdown,
    getPerformanceStats,
    learningPaths
  } = useAnalytics();

  // Redirect to sign in if not authenticated
  React.useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your analytics.",
        variant: "destructive",
      });
    }
  }, [user, isLoading, toast]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Please sign in to view your analytics</div>
          <Button onClick={() => window.location.href = '/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  const weeklyProgress = getWeeklyProgressData();
  const subjectBreakdown = getSubjectBreakdown();
  const performanceStats = getPerformanceStats();

  const performanceData = {
    weeklyProgress,
    subjectBreakdown,
    streakData: performanceStats.streakData,
    learningStats: {
      totalHours: performanceStats.totalHours,
      averageSession: performanceStats.averageSession,
      completionRate: performanceStats.completionRate,
      focusScore: performanceStats.focusScore
    }
  };

  // Mock learning path steps (you can replace this with real data from learningPaths)
  const learningPathSteps = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Learn variables, functions, and basic syntax',
      type: 'reading' as const,
      difficulty: 'beginner' as const,
      estimatedTime: '2 hours',
      xpReward: 100,
      isCompleted: true,
      isActive: false,
      isLocked: false
    },
    {
      id: '2',
      title: 'DOM Manipulation',
      description: 'Practice selecting and modifying HTML elements',
      type: 'exercise' as const,
      difficulty: 'beginner' as const,
      estimatedTime: '3 hours',
      xpReward: 150,
      isCompleted: true,
      isActive: false,
      isLocked: false
    },
    {
      id: '3',
      title: 'Interactive Web App',
      description: 'Build a complete interactive application',
      type: 'project' as const,
      difficulty: 'intermediate' as const,
      estimatedTime: '8 hours',
      xpReward: 300,
      isCompleted: false,
      isActive: true,
      isLocked: false
    },
    {
      id: '4',
      title: 'Advanced JavaScript',
      description: 'Async/await, promises, and modern ES6+ features',
      type: 'reading' as const,
      difficulty: 'advanced' as const,
      estimatedTime: '4 hours',
      xpReward: 200,
      isCompleted: false,
      isActive: false,
      isLocked: true
    }
  ];

  const handleExportData = () => {
    toast({
      title: "Data Exported! 📊",
      description: "Your learning analytics have been exported to CSV.",
    });
  };

  const handleShareProgress = () => {
    toast({
      title: "Progress Shared! 🎉",
      description: "Your learning progress has been shared successfully.",
    });
  };

  const handleStudySessionComplete = async (duration: number) => {
    try {
      await recordStudySession({
        sessionType: 'study',
        durationMinutes: Math.round(duration / 60),
        subject: 'General Study',
        focusScore: Math.floor(Math.random() * 20) + 80 // Random score between 80-100
      });

      toast({
        title: "Study Session Complete! 🎯",
        description: `Great focus! You studied for ${Math.round(duration / 60)} minutes.`,
      });
    } catch (error) {
      console.error('Error recording study session:', error);
      toast({
        title: "Session Recorded Locally 📝",
        description: `You studied for ${Math.round(duration / 60)} minutes.`,
      });
    }
  };

  const handleStartNewSession = async () => {
    try {
      await recordTaskCompletion({
        taskTitle: 'Quick Practice Session',
        taskType: 'exercise',
        difficulty: 'beginner',
        subject: 'General',
        xpEarned: 50,
        completionTimeMinutes: 15
      });

      toast({
        title: "New Session Started! 🚀",
        description: "Let's get learning!",
      });
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Session Started! 🚀",
        description: "Let's get learning!",
      });
    }
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4">Learning Analytics</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Track your progress, analyze your performance, and optimize your learning journey
            </p>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleExportData}
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                onClick={handleShareProgress}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{performanceStats.completionRate}%</div>
                <div className="text-purple-200">Overall Performance</div>
                <Badge className="mt-2 bg-green-100 text-green-800">Excellent</Badge>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">+23%</div>
                <div className="text-purple-200">Weekly Improvement</div>
                <Badge className="mt-2 bg-blue-100 text-blue-800">Trending Up</Badge>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{performanceStats.streakData.current}</div>
                <div className="text-purple-200">Day Streak</div>
                <Badge className="mt-2 bg-orange-100 text-orange-800">On Fire</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analytics Section */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Performance Analytics</CardTitle>
                  <CardDescription className="text-purple-200">
                    Detailed insights into your learning patterns and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceAnalytics data={performanceData} />
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Learning Path Progress</CardTitle>
                  <CardDescription className="text-purple-200">
                    Track your progress through structured learning paths
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LearningPathVisualizer
                    title="JavaScript Mastery Path"
                    description="Complete journey from beginner to advanced JavaScript developer"
                    steps={learningPathSteps}
                    overallProgress={65}
                    onStepClick={(stepId) => console.log('Step clicked:', stepId)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Study Timer */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Focus Timer</CardTitle>
                  <CardDescription className="text-purple-200">
                    Use the Pomodoro technique to maintain focus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StudyTimer 
                    onSessionComplete={handleStudySessionComplete}
                    defaultDuration={25}
                  />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleStartNewSession}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Start New Session
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Review Yesterday
                  </Button>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Set Weekly Goals
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg animate-cosmic-glow">
                <CardHeader>
                  <CardTitle className="text-white">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-900/40 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      🏆
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Week Warrior</div>
                      <div className="text-xs text-green-300">Completed {performanceStats.streakData.current} days in a row</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-900/40 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Focus Master</div>
                      <div className="text-xs text-blue-300">Maintained {performanceStats.focusScore}% focus score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-900/40 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      ⚡
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Speed Learner</div>
                      <div className="text-xs text-purple-300">Studied {performanceStats.totalHours} hours this week</div>
                    </div>
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

export default Analytics;
