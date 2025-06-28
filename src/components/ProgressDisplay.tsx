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
    <div className="mb-6">
      {/* Animated XP Pie Chart */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10">
        <div className="relative w-44 h-44 flex items-center justify-center animate-float cosmic-glass shadow-2xl rounded-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
                stroke="none"
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Trophy className="h-8 w-8 text-yellow-400 animate-glow mb-1 drop-shadow-lg" />
            <span className="text-xl font-extrabold text-purple-100 drop-shadow">Level {userProgress.level}</span>
            <span className="text-xs text-purple-300 font-semibold tracking-wide uppercase">{levelTitles[userProgress.level - 1] || 'Legend'}</span>
            <span className="text-xs text-purple-400 mt-1 font-mono">{Math.round(xpProgress)}% XP</span>
          </div>
          <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent blur-2xl pointer-events-none" />
        </div>
        {/* Animated Bar Chart */}
        <div className="w-full md:w-2/3 h-44 animate-float-delayed cosmic-glass shadow-2xl rounded-2xl flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#a78bfa', fontWeight: 700, fontSize: 14 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a78bfa', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #a78bfa', color: '#fff', borderRadius: 12, boxShadow: '0 4px 32px #a78bfa33' }}
                labelStyle={{ color: '#a78bfa', fontWeight: 700 }}
                cursor={{ fill: 'rgba(168,139,250,0.08)' }}
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
      {/* Stat Cards (cosmic glass, glowing, modern) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Level & XP */}
        <Card className="cosmic-glass border border-purple-500/40 shadow-xl col-span-2 hover:scale-[1.03] transition-transform duration-300 animate-cosmic-glow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 animate-float">
                <Trophy className="h-7 w-7 text-yellow-400 animate-glow drop-shadow" />
                <span className="font-bold text-purple-100 text-lg">Level {userProgress.level}</span>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none shadow-md animate-cosmic-glow px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {levelTitles[userProgress.level - 1] || 'Legend'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-200 font-mono">XP: {userProgress.xp}</span>
                <span className="text-purple-200 font-mono">Next: {xpForNext}</span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-purple-900/40 animate-glow rounded-full" />
            </div>
          </CardContent>
        </Card>
        {/* Current Streak */}
        <Card className="cosmic-glass border border-orange-500/40 shadow-xl hover:scale-[1.03] transition-transform duration-300 animate-cosmic-glow">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center mb-2 animate-float-delayed">
              <Flame className="h-8 w-8 text-orange-400 animate-glow drop-shadow" />
            </div>
            <div className="text-2xl font-extrabold text-orange-100 animate-glow drop-shadow">{userProgress.currentStreak}</div>
            <div className="text-sm text-orange-200 font-semibold">Day Streak</div>
          </CardContent>
        </Card>
        {/* Coins */}
        <Card className="cosmic-glass border border-yellow-400/40 shadow-xl hover:scale-[1.03] transition-transform duration-300 animate-cosmic-glow">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center mb-2 animate-float">
              <Coins className="h-8 w-8 text-yellow-200 animate-glow drop-shadow" />
            </div>
            <div className="text-2xl font-extrabold text-yellow-100 animate-glow drop-shadow">{userProgress.coins}</div>
            <div className="text-sm text-yellow-200 font-semibold">Coins</div>
          </CardContent>
        </Card>
        {/* Points */}
        <Card className="cosmic-glass border border-blue-400/40 shadow-xl hover:scale-[1.03] transition-transform duration-300 animate-cosmic-glow">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center mb-2 animate-float-delayed">
              <Star className="h-8 w-8 text-blue-300 animate-glow drop-shadow" />
            </div>
            <div className="text-2xl font-extrabold text-blue-100 animate-glow drop-shadow">{userProgress.points}</div>
            <div className="text-sm text-blue-200 font-semibold">Points</div>
          </CardContent>
        </Card>
        {/* Tasks Completed */}
        <Card className="cosmic-glass border border-green-400/40 shadow-xl hover:scale-[1.03] transition-transform duration-300 animate-cosmic-glow">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center mb-2 animate-float">
              <Target className="h-8 w-8 text-green-300 animate-glow drop-shadow" />
            </div>
            <div className="text-2xl font-extrabold text-green-100 animate-glow drop-shadow">{userProgress.totalTasksCompleted}</div>
            <div className="text-sm text-green-200 font-semibold">Tasks Done</div>
          </CardContent>
        </Card>
        {/* Best Streak */}
        <Card className="cosmic-glass border border-pink-400/40 shadow-xl hover:scale-[1.03] transition-transform duration-300 animate-cosmic-glow">
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center mb-2 animate-float-delayed">
              <Zap className="h-8 w-8 text-pink-300 animate-glow drop-shadow" />
            </div>
            <div className="text-2xl font-extrabold text-pink-100 animate-glow drop-shadow">{userProgress.longestStreak}</div>
            <div className="text-sm text-pink-200 font-semibold">Best Streak</div>
          </CardContent>
        </Card>
      </div>
      {/* Cosmic glassmorphism utility */}
      <style>{`
        .cosmic-glass {
          background: linear-gradient(135deg, rgba(40,0,80,0.7) 0%, rgba(80,0,120,0.5) 100%);
          backdrop-filter: blur(16px) saturate(1.3);
          box-shadow: 0 4px 32px 0 rgba(80,0,120,0.18), 0 1.5px 8px 0 rgba(168,139,250,0.12);
          border-radius: 1.25rem;
        }
      `}</style>
    </div>
  );
};
