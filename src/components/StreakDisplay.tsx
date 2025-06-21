
import React from 'react';
import { Flame, Trophy, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  totalTasksCompleted: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  currentStreak,
  longestStreak,
  totalTasksCompleted
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-700">{currentStreak}</div>
          <div className="text-sm text-orange-600">Day Streak</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-700">{longestStreak}</div>
          <div className="text-sm text-yellow-600">Best Streak</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-8 w-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-700">{totalTasksCompleted}</div>
          <div className="text-sm text-green-600">Tasks Done</div>
        </CardContent>
      </Card>
    </div>
  );
};
