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
    <div className="grid grid-cols-3 gap-6 mb-6">
      <Card className="bg-gradient-to-br from-orange-900/80 to-pink-900/80 border-2 border-orange-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
        <CardContent className="p-6 text-center flex flex-col items-center gap-2">
          <Flame className="h-8 w-8 text-orange-400 animate-glow animate-float" />
          <div className="text-3xl font-extrabold text-orange-100 animate-glow">{currentStreak}</div>
          <div className="text-base text-orange-300 font-semibold">Day Streak</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-2 border-pink-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
        <CardContent className="p-6 text-center flex flex-col items-center gap-2">
          <Trophy className="h-8 w-8 text-pink-400 animate-glow animate-float-delayed" />
          <div className="text-3xl font-extrabold text-pink-100 animate-glow">{longestStreak}</div>
          <div className="text-base text-pink-300 font-semibold">Best Streak</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-2 border-green-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
        <CardContent className="p-6 text-center flex flex-col items-center gap-2">
          <Target className="h-8 w-8 text-green-400 animate-glow animate-float" />
          <div className="text-3xl font-extrabold text-green-100 animate-glow">{totalTasksCompleted}</div>
          <div className="text-base text-green-300 font-semibold">Tasks Done</div>
        </CardContent>
      </Card>
    </div>
  );
};
