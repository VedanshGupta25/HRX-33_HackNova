
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
              Achievements & Progress
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
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
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'hover:shadow-xl transform hover:-translate-y-1 ring-2 ring-green-200' 
                      : 'opacity-75'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
                            : 'bg-gray-100'
                        }`}>
                          <IconComponent 
                            className={`h-6 w-6 ${
                              achievement.unlocked 
                                ? 'text-green-600' 
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
                              ✓ Unlocked
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
                    
                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-600">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className={`h-2 ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-200'}`}
                      />
                    </div>

                    {/* Rewards */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded text-xs">
                        <Star className="h-3 w-3 text-blue-500 mx-auto mb-1" />
                        <div className="font-semibold text-blue-700">+{achievement.reward.points}</div>
                        <div className="text-blue-600">Points</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded text-xs">
                        <Zap className="h-3 w-3 text-purple-500 mx-auto mb-1" />
                        <div className="font-semibold text-purple-700">+{achievement.reward.xp}</div>
                        <div className="text-purple-600">XP</div>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded text-xs">
                        <Coins className="h-3 w-3 text-yellow-500 mx-auto mb-1" />
                        <div className="font-semibold text-yellow-700">+{achievement.reward.coins}</div>
                        <div className="text-yellow-600">Coins</div>
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
