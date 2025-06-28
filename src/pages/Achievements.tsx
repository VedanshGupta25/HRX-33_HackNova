
import React from 'react';
import { Header } from '@/components/Header';
import { ProgressDisplay } from '@/components/ProgressDisplay';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame, Book, Users, Coins, Zap } from 'lucide-react';

const Achievements = () => {
  const { userProgress, achievements, getXpForNextLevel } = useGamification();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Target, Flame, Book, Trophy, Star, Users, Coins, Zap
    };
    return icons[iconName] || Star;
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-green-50 dark:from-gray-900 dark:via-background dark:to-gray-800 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressDisplay 
            userProgress={userProgress}
            getXpForNextLevel={getXpForNextLevel}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Achievements & Progress
            </h1>
            <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
              Track your learning journey and unlock exclusive rewards
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {unlockedCount} of {achievements.length} unlocked
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <Card 
                  key={achievement.id} 
                  className={`bg-card/80 backdrop-blur-sm border-border shadow-lg transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'hover:shadow-xl transform hover:-translate-y-1 ring-2 ring-green-200 dark:ring-green-800' 
                      : 'opacity-75'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900' 
                            : 'bg-muted'
                        }`}>
                          <IconComponent 
                            className={`h-6 w-6 ${
                              achievement.unlocked 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        </div>
                        <div>
                          <CardTitle className={
                            achievement.unlocked 
                              ? 'text-foreground' 
                              : 'text-muted-foreground'
                          }>
                            {achievement.title}
                          </CardTitle>
                          {achievement.unlocked && (
                            <Badge className="mt-1 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">
                              ✓ Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Trophy className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3 text-muted-foreground">
                      {achievement.description}
                    </CardDescription>
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className={`h-2 ${achievement.unlocked ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'}`}
                      />
                    </div>

                    {/* Rewards */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-xs">
                        <Star className="h-3 w-3 text-blue-500 dark:text-blue-400 mx-auto mb-1" />
                        <div className="font-semibold text-blue-700 dark:text-blue-300">+{achievement.reward.points}</div>
                        <div className="text-blue-600 dark:text-blue-400">Points</div>
                      </div>
                      <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded text-xs">
                        <Zap className="h-3 w-3 text-purple-500 dark:text-purple-400 mx-auto mb-1" />
                        <div className="font-semibold text-purple-700 dark:text-purple-300">+{achievement.reward.xp}</div>
                        <div className="text-purple-600 dark:text-purple-400">XP</div>
                      </div>
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded text-xs">
                        <Coins className="h-3 w-3 text-yellow-500 dark:text-yellow-400 mx-auto mb-1" />
                        <div className="font-semibold text-yellow-700 dark:text-yellow-300">+{achievement.reward.coins}</div>
                        <div className="text-yellow-600 dark:text-yellow-400">Coins</div>
                      </div>
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
