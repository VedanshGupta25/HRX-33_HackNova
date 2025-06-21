
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, PlayCircle, CheckCircle, Zap } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  type: string;
}

interface TaskDisplayProps {
  tasks: Task[];
  onTaskComplete?: (taskTitle: string) => void;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ tasks }) => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reading': return <Star className="h-4 w-4" />;
      case 'exercise': return <PlayCircle className="h-4 w-4" />;
      case 'project': return <CheckCircle className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const handleTaskStart = (task: Task) => {
    console.log(`Starting task: ${task.title}`);
    const taskType = task.type.toLowerCase();
    navigate(`/task/${taskType}/${task.id}`);
  };

  const getRewardEstimate = (difficulty: string) => {
    const baseRewards = {
      beginner: { points: 10, xp: 15, coins: 5 },
      intermediate: { points: 15, xp: 20, coins: 8 },
      advanced: { points: 25, xp: 30, coins: 12 }
    };
    return baseRewards[difficulty.toLowerCase() as keyof typeof baseRewards] || baseRewards.beginner;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Personalized Learning Path
        </h2>
        <p className="text-gray-600">
          Click on any task to start learning and earn rewards
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task, index) => {
          const rewards = getRewardEstimate(task.difficulty);
          return (
            <Card 
              key={task.id} 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer"
              style={{ animationDelay: `${index * 200}ms` }}
              onClick={() => handleTaskStart(task)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-blue-600">
                    {getTypeIcon(task.type)}
                    <span className="text-sm font-medium">{task.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {task.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {task.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`${getDifficultyColor(task.difficulty)} border`}>
                    {task.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {task.estimatedTime}
                  </div>
                </div>

                {/* Reward Preview */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="text-center">
                    <Star className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-blue-700">+{rewards.points}</div>
                    <div className="text-xs text-blue-600">Points</div>
                  </div>
                  <div className="text-center">
                    <Zap className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                    <div className="text-xs font-semibold text-purple-700">+{rewards.xp}</div>
                    <div className="text-xs text-purple-600">XP</div>
                  </div>
                  <div className="text-center">
                    <div className="h-4 w-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                    <div className="text-xs font-semibold text-yellow-700">+{rewards.coins}</div>
                    <div className="text-xs text-yellow-600">Coins</div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white transition-all transform hover:scale-105 relative overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskStart(task);
                  }}
                >
                  <span className="relative z-10">Start Learning</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
