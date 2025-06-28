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
    <div className="relative grid grid-cols-3 gap-8 mb-8">
      {/* Cosmic Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="star-field opacity-60 w-full h-full absolute inset-0 animate-twinkle" />
      </div>
      {/* Day Streak */}
      <Card className="relative z-10 bg-gradient-to-br from-[#1a1333] to-[#2d1b4c] border-4 border-orange-400/80 shadow-[0_0_32px_8px_rgba(251,146,60,0.4)] rounded-3xl backdrop-blur-2xl glassmorphism animate-cosmic-glow">
        <CardContent className="p-8 text-center flex flex-col items-center gap-3">
          <Flame className="h-10 w-10 text-orange-400 animate-glow animate-float drop-shadow-[0_0_12px_orange]" />
          <div className="text-4xl font-extrabold text-orange-200 animate-glow drop-shadow-[0_0_8px_orange]">{currentStreak}</div>
          <div className="text-lg text-orange-300 font-semibold tracking-wide uppercase">Day Streak</div>
        </CardContent>
      </Card>
      {/* Best Streak */}
      <Card className="relative z-10 bg-gradient-to-br from-[#2d1b4c] to-[#3a1c5c] border-4 border-pink-400/80 shadow-[0_0_32px_8px_rgba(244,114,182,0.4)] rounded-3xl backdrop-blur-2xl glassmorphism animate-cosmic-glow">
        <CardContent className="p-8 text-center flex flex-col items-center gap-3">
          <Trophy className="h-10 w-10 text-pink-400 animate-glow animate-float-delayed drop-shadow-[0_0_12px_pink]" />
          <div className="text-4xl font-extrabold text-pink-200 animate-glow drop-shadow-[0_0_8px_pink]">{longestStreak}</div>
          <div className="text-lg text-pink-300 font-semibold tracking-wide uppercase">Best Streak</div>
        </CardContent>
      </Card>
      {/* Tasks Done */}
      <Card className="relative z-10 bg-gradient-to-br from-[#13331a] to-[#1b4c2d] border-4 border-green-400/80 shadow-[0_0_32px_8px_rgba(52,211,153,0.4)] rounded-3xl backdrop-blur-2xl glassmorphism animate-cosmic-glow">
        <CardContent className="p-8 text-center flex flex-col items-center gap-3">
          <Target className="h-10 w-10 text-green-400 animate-glow animate-float drop-shadow-[0_0_12px_lime]" />
          <div className="text-4xl font-extrabold text-green-200 animate-glow drop-shadow-[0_0_8px_lime]">{totalTasksCompleted}</div>
          <div className="text-lg text-green-300 font-semibold tracking-wide uppercase">Tasks Done</div>
        </CardContent>
      </Card>
    </div>
  );
};
