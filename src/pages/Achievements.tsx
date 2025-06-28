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
            <h1 className="text-4xl font-bold text-white mb-4">
              Achievements & Progress
            </h1>
            <p className="text-xl text-purple-200 mb-4 max-w-2xl mx-auto">
              Track your learning journey and unlock exclusive rewards
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2 bg-black/40 border-purple-500/30 text-purple-200 animate-cosmic-glow">
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
                  className={`bg-black/30 backdrop-blur-md border-purple-500/30 shadow-lg transition-all duration-300 animate-cosmic-glow ${
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
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-900 dark:to-emerald-900' 
                            : 'bg-black/40'
                        }`}>
                          <IconComponent 
                            className={`h-6 w-6 ${
                              achievement.unlocked 
                                ? 'text-green-200 dark:text-green-400' 
                                : 'text-purple-400'
                            }`} 
                          />
                        </div>
                        <div>
                          <CardTitle className={
                            achievement.unlocked 
                              ? 'text-white' 
                              : 'text-purple-200'
                          }>
                            {achievement.title}
                          </CardTitle>
                          {achievement.unlocked && (
                            <Badge className="mt-1 bg-green-500/20 text-green-200 border-green-400 animate-cosmic-glow">
                              ✓ Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                      {achievement.unlocked && (
                        <Trophy className="h-8 w-8 text-yellow-400 animate-glow" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-3 text-purple-200">
                      {achievement.description}
                    </CardDescription>
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-purple-200">Progress</span>
                        <span className="text-purple-200">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className={`h-2 ${achievement.unlocked ? 'bg-green-500/20' : 'bg-purple-900/40'}`}
                      />
                    </div>
                    {/* Rewards */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-900/40 rounded text-xs">
                        <Star className="h-3 w-3 text-blue-400 mx-auto mb-1" />
                        <div className="font-semibold text-blue-200">+{achievement.reward.points}</div>
                        <div className="text-blue-300">Points</div>
                      </div>
                      <div className="p-2 bg-purple-900/40 rounded text-xs">
                        <Zap className="h-3 w-3 text-purple-400 mx-auto mb-1" />
                        <div className="font-semibold text-purple-200">+{achievement.reward.xp}</div>
                        <div className="text-purple-300">XP</div>
                      </div>
                      <div className="p-2 bg-yellow-900/40 rounded text-xs">
                        <Coins className="h-3 w-3 text-yellow-400 mx-auto mb-1" />
                        <div className="font-semibold text-yellow-200">+{achievement.reward.coins}</div>
                        <div className="text-yellow-300">Coins</div>
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
