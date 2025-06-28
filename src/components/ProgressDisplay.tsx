
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Target, Coins, Star, Zap } from 'lucide-react';

interface ProgressDisplayProps {
  userProgress: {
    points: number;
    xp: number;
    level: number;
    coins: number;
    totalTasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
  };
  getXpForNextLevel: (level: number) => number;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  userProgress,
  getXpForNextLevel
}) => {
  const xpForNext = getXpForNextLevel(userProgress.level);
  const xpProgress = ((userProgress.xp % xpForNext) / xpForNext) * 100;

  const levelTitles = [
    'Newcomer', 'Explorer', 'Learner', 'Scholar', 'Expert', 
    'Master', 'Guru', 'Legend', 'Sage', 'Grandmaster'
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Level & XP */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-700">Level {userProgress.level}</span>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              {levelTitles[userProgress.level - 1] || 'Legend'}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-600">XP: {userProgress.xp}</span>
              <span className="text-purple-600">Next: {xpForNext}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Streak */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-xl font-bold text-orange-700">{userProgress.currentStreak}</div>
          <div className="text-sm text-orange-600">Day Streak</div>
        </CardContent>
      </Card>

      {/* Coins */}
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Coins className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="text-xl font-bold text-yellow-700">{userProgress.coins}</div>
          <div className="text-sm text-yellow-600">Coins</div>
        </CardContent>
      </Card>

      {/* Points */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-blue-700">{userProgress.points}</div>
          <div className="text-sm text-blue-600">Points</div>
        </CardContent>
      </Card>

      {/* Tasks Completed */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-xl font-bold text-green-700">{userProgress.totalTasksCompleted}</div>
          <div className="text-sm text-green-600">Tasks Done</div>
        </CardContent>
      </Card>

      {/* Best Streak */}
      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-pink-500" />
          </div>
          <div className="text-xl font-bold text-pink-700">{userProgress.longestStreak}</div>
          <div className="text-sm text-pink-600">Best Streak</div>
        </CardContent>
      </Card>
    </div>
  );
};
