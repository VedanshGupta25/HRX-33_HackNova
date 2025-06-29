import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Target,
  Brain,
  Zap,
  Award
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface PerformanceData {
  weeklyProgress: Array<{ day: string; xp: number; tasks: number }>;
  subjectBreakdown: Array<{ subject: string; hours: number; color: string }>;
  streakData: {
    current: number;
    longest: number;
    thisWeek: number;
  };
  learningStats: {
    totalHours: number;
    averageSession: number;
    completionRate: number;
    focusScore: number;
  };
}

interface PerformanceAnalyticsProps {
  data: PerformanceData;
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ data }) => {
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Great', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (score >= 60) return { label: 'Fair', color: 'bg-orange-100 text-orange-800' };
    return { label: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Hours</p>
                <p className="text-2xl font-bold text-blue-800">{data.learningStats.totalHours}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-xs text-blue-600">
              {getTrendIcon(data.learningStats.totalHours, data.learningStats.totalHours * 0.8)}
              <span className="ml-1">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-800">{data.learningStats.completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-xs text-green-600">
              {getTrendIcon(data.learningStats.completionRate, 75)}
              <span className="ml-1">+8% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Focus Score</p>
                <p className="text-2xl font-bold text-purple-800">{data.learningStats.focusScore}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge className={getPerformanceBadge(data.learningStats.focusScore).color}>
                {getPerformanceBadge(data.learningStats.focusScore).label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-800">{data.streakData.current}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2 text-xs text-orange-600">
              <Award className="h-3 w-3 mr-1" />
              <span>Best: {data.streakData.longest} days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Weekly Progress
            </CardTitle>
            <CardDescription>
              Your learning activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="xp" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Subject Breakdown
            </CardTitle>
            <CardDescription>
              Time spent on different subjects this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.subjectBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="hours"
                >
                  {data.subjectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {data.subjectBreakdown.map((subject, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                    <span>{subject.subject}</span>
                  </div>
                  <span className="font-medium">{subject.hours}h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Detailed breakdown of your learning performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Task Completion Rate</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(data.learningStats.completionRate)}`}>
                    {data.learningStats.completionRate}%
                  </span>
                </div>
                <Progress value={data.learningStats.completionRate} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Focus Score</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(data.learningStats.focusScore)}`}>
                    {data.learningStats.focusScore}/100
                  </span>
                </div>
                <Progress value={data.learningStats.focusScore} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Consistency Score</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(85)}`}>
                    85/100
                  </span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">This Week's Highlights</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Completed 12 learning tasks</li>
                  <li>• Maintained 5-day streak</li>
                  <li>• Improved focus score by 15%</li>
                  <li>• Spent 8.5 hours learning</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Achievements Unlocked</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800">Week Warrior</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Focus Master</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Streak Keeper</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};