
import React from 'react';
import { Header } from '@/components/Header';
import { StreakDisplay } from '@/components/StreakDisplay';
import { useStreak } from '@/hooks/useStreak';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Flame, Book, Users } from 'lucide-react';

const Achievements = () => {
  const { streakData } = useStreak();

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first learning task",
      icon: Target,
      unlocked: streakData.totalTasksCompleted > 0,
      progress: streakData.totalTasksCompleted > 0 ? 100 : 0,
      color: "text-green-500"
    },
    {
      id: 2,
      title: "On Fire",
      description: "Maintain a 3-day learning streak",
      icon: Flame,
      unlocked: streakData.currentStreak >= 3,
      progress: Math.min((streakData.currentStreak / 3) * 100, 100),
      color: "text-orange-500"
    },
    {
      id: 3,
      title: "Dedicated Learner",
      description: "Complete 10 learning tasks",
      icon: Book,
      unlocked: streakData.totalTasksCompleted >= 10,
      progress: Math.min((streakData.totalTasksCompleted / 10) * 100, 100),
      color: "text-blue-500"
    },
    {
      id: 4,
      title: "Streak Master",
      description: "Achieve a 7-day learning streak",
      icon: Star,
      unlocked: streakData.longestStreak >= 7,
      progress: Math.min((streakData.longestStreak / 7) * 100, 100),
      color: "text-yellow-500"
    },
    {
      id: 5,
      title: "Knowledge Seeker",
      description: "Complete 25 learning tasks",
      icon: Trophy,
      unlocked: streakData.totalTasksCompleted >= 25,
      progress: Math.min((streakData.totalTasksCompleted / 25) * 100, 100),
      color: "text-purple-500"
    },
    {
      id: 6,
      title: "Team Player",
      description: "Join a study group",
      icon: Users,
      unlocked: false,
      progress: 0,
      color: "text-indigo-500"
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <StreakDisplay 
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            totalTasksCompleted={streakData.totalTasksCompleted}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Achievements
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Track your learning progress and unlock rewards
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {unlockedCount} of {achievements.length} unlocked
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <Card 
                  key={achievement.id} 
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'hover:shadow-xl transform hover:-translate-y-1' 
                      : 'opacity-75'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-blue-100 to-green-100' 
                            : 'bg-gray-100'
                        }`}>
                          <IconComponent 
                            className={`h-6 w-6 ${
                              achievement.unlocked 
                                ? achievement.color 
                                : 'text-gray-400'
                            }`} 
                          />
                        </div>
                        <div>
                          <CardTitle className={
                            achievement.unlocked 
                              ? 'text-gray-800' 
                              : 'text-gray-500'
                          }>
                            {achievement.title}
                          </CardTitle>
                          {achievement.unlocked && (
                            <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                              Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Trophy className="h-8 w-8 text-yellow-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3">
                      {achievement.description}
                    </CardDescription>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-blue-500 to-green-500' 
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      Progress: {Math.round(achievement.progress)}%
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Achievements;
