import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Target, Coins, Star, Zap } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Pie chart for XP progress
  const pieData = [
    { name: 'XP', value: userProgress.xp % xpForNext },
    { name: 'Remaining', value: xpForNext - (userProgress.xp % xpForNext) }
  ];
  const pieColors = ['#a78bfa', '#312e81'];

  // Bar chart for other stats
  const barData = [
    {
      name: 'Streak',
      value: userProgress.currentStreak,
      color: '#fb923c',
      icon: <Flame className="inline h-4 w-4 text-orange-400" />
    },
    {
      name: 'Coins',
      value: userProgress.coins,
      color: '#fde047',
      icon: <Coins className="inline h-4 w-4 text-yellow-300" />
    },
    {
      name: 'Points',
      value: userProgress.points,
      color: '#60a5fa',
      icon: <Star className="inline h-4 w-4 text-blue-400" />
    },
    {
      name: 'Tasks',
      value: userProgress.totalTasksCompleted,
      color: '#34d399',
      icon: <Target className="inline h-4 w-4 text-green-400" />
    },
    {
      name: 'Best',
      value: userProgress.longestStreak,
      color: '#f472b6',
      icon: <Zap className="inline h-4 w-4 text-pink-400" />
    }
  ];

  return (
    <div className="mb-6 relative">
      {/* Cosmic Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="star-field opacity-40 w-full h-full absolute inset-0" />
      </div>
      {/* Animated XP Pie Chart & Bar Chart */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10 relative z-10">
        <div className="relative w-48 h-48 flex items-center justify-center animate-float">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Trophy className="h-10 w-10 text-yellow-400 animate-glow mb-2" />
            <span className="text-2xl font-extrabold text-purple-100 drop-shadow-lg">Level {userProgress.level}</span>
            <span className="text-sm text-purple-300 font-semibold mb-1">{levelTitles[userProgress.level - 1] || 'Legend'}</span>
            <span className="text-xs text-purple-400 mt-1 font-mono">{Math.round(xpProgress)}% XP</span>
          </div>
        </div>
        {/* Animated Bar Chart */}
        <div className="w-full md:w-2/3 h-48 animate-float-delayed rounded-3xl bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-xl border-4 border-purple-500/40 shadow-2xl cosmic-shadow flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#a78bfa', fontWeight: 700, fontSize: 16 }} />
              <YAxis tick={{ fill: '#a78bfa', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #a78bfa', color: '#fff' }}
                labelStyle={{ color: '#a78bfa' }}
                cursor={{ fill: 'rgba(168,139,250,0.1)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((entry, idx) => (
                  <Cell key={`bar-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Stat Cards (cosmic, glassy, glowing) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative z-10">
        {/* Level & XP */}
        <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-2 border-purple-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow col-span-2 animate-cosmic-glow">
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3 animate-float">
              <Trophy className="h-8 w-8 text-yellow-400 animate-glow" />
              <span className="font-bold text-purple-100 text-2xl drop-shadow-lg">Level {userProgress.level}</span>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none shadow-md animate-cosmic-glow px-4 py-1 text-base font-semibold ml-2">
                {levelTitles[userProgress.level - 1] || 'Legend'}
              </Badge>
            </div>
            <div className="flex justify-between text-base font-mono">
              <span className="text-purple-300">XP: {userProgress.xp}</span>
              <span className="text-purple-300">Next: {xpForNext}</span>
            </div>
            <Progress value={xpProgress} className="h-3 bg-purple-900/40 animate-glow rounded-full" />
          </CardContent>
        </Card>
        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-900/80 to-pink-900/80 border-2 border-orange-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
          <CardContent className="p-6 text-center flex flex-col items-center gap-2">
            <Flame className="h-8 w-8 text-orange-400 animate-glow animate-float" />
            <div className="text-3xl font-extrabold text-orange-100 animate-glow">{userProgress.currentStreak}</div>
            <div className="text-base text-orange-300 font-semibold">Day Streak</div>
          </CardContent>
        </Card>
        {/* Coins */}
        <Card className="bg-gradient-to-br from-yellow-900/80 to-amber-900/80 border-2 border-yellow-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
          <CardContent className="p-6 text-center flex flex-col items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-300 animate-glow animate-float-delayed" />
            <div className="text-3xl font-extrabold text-yellow-100 animate-glow">{userProgress.coins}</div>
            <div className="text-base text-yellow-300 font-semibold">Coins</div>
          </CardContent>
        </Card>
        {/* Points */}
        <Card className="bg-gradient-to-br from-blue-900/80 to-cyan-900/80 border-2 border-blue-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
          <CardContent className="p-6 text-center flex flex-col items-center gap-2">
            <Star className="h-8 w-8 text-blue-400 animate-glow animate-float" />
            <div className="text-3xl font-extrabold text-blue-100 animate-glow">{userProgress.points}</div>
            <div className="text-base text-blue-300 font-semibold">Points</div>
          </CardContent>
        </Card>
        {/* Tasks Completed */}
        <Card className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-2 border-green-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
          <CardContent className="p-6 text-center flex flex-col items-center gap-2">
            <Target className="h-8 w-8 text-green-400 animate-glow animate-float-delayed" />
            <div className="text-3xl font-extrabold text-green-100 animate-glow">{userProgress.totalTasksCompleted}</div>
            <div className="text-base text-green-300 font-semibold">Tasks Done</div>
          </CardContent>
        </Card>
        {/* Best Streak */}
        <Card className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 border-2 border-pink-500/40 shadow-2xl rounded-2xl backdrop-blur-xl cosmic-shadow animate-cosmic-glow">
          <CardContent className="p-6 text-center flex flex-col items-center gap-2">
            <Zap className="h-8 w-8 text-pink-400 animate-glow animate-float" />
            <div className="text-3xl font-extrabold text-pink-100 animate-glow">{userProgress.longestStreak}</div>
            <div className="text-base text-pink-300 font-semibold">Best Streak</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
