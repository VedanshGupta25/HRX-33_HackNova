
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Square, 
  Clock, 
  Star, 
  Trophy, 
  CheckCircle, 
  BookOpen, 
  Code, 
  Lightbulb,
  Timer
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  type: string;
  xpReward?: number;
  rating?: number;
}

interface TaskDisplayProps {
  tasks: Task[];
  onTaskStart: (taskId: string, taskTitle: string, duration: number) => void;
  onTaskEnd: (taskId: string, taskTitle: string) => void;
  activeTask: string | null;
  taskTimers: {[key: string]: { startTime: Date, duration: number }};
  completedTasks: Set<string>;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({
  tasks,
  onTaskStart,
  onTaskEnd,
  activeTask,
  taskTimers,
  completedTasks
}) => {
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: {[key: string]: number} = {};
      
      Object.entries(taskTimers).forEach(([taskId, timer]) => {
        const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000);
        const remaining = Math.max(0, timer.duration - elapsed);
        newTimeRemaining[taskId] = remaining;
        
        if (remaining === 0 && activeTask === taskId) {
          // Auto-end task when timer expires
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            onTaskEnd(taskId, task.title);
          }
        }
      });
      
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [taskTimers, activeTask, tasks, onTaskEnd]);

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reading':
        return <BookOpen className="h-5 w-5" />;
      case 'exercise':
        return <Code className="h-5 w-5" />;
      case 'project':
        return <Lightbulb className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const extractDuration = (estimatedTime: string): number => {
    const match = estimatedTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 30;
  };

  const calculateProgress = (taskId: string): number => {
    if (!taskTimers[taskId]) return 0;
    const timer = taskTimers[taskId];
    const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000);
    return Math.min(100, (elapsed / timer.duration) * 100);
  };

  // Group tasks by difficulty
  const groupedTasks = tasks.reduce((acc, task) => {
    const difficulty = task.difficulty.toLowerCase();
    if (!acc[difficulty]) acc[difficulty] = [];
    acc[difficulty].push(task);
    return acc;
  }, {} as {[key: string]: Task[]});

  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="mt-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Learning Tasks</h2>
        <p className="text-gray-600">Complete tasks to earn XP, unlock achievements, and level up!</p>
      </div>

      {difficultyOrder.map(difficulty => {
        const difficultyTasks = groupedTasks[difficulty];
        if (!difficultyTasks || difficultyTasks.length === 0) return null;

        return (
          <div key={difficulty} className="animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {difficulty} Level
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {difficultyTasks.map((task, index) => {
                const isActive = activeTask === task.id;
                const isCompleted = completedTasks.has(task.id);
                const progress = calculateProgress(task.id);
                const remaining = timeRemaining[task.id] || 0;
                const duration = extractDuration(task.estimatedTime);

                return (
                  <Card 
                    key={task.id}
                    className={`transition-all duration-300 hover:shadow-lg ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : isActive 
                        ? 'bg-blue-50 border-blue-200 shadow-lg' 
                        : 'hover:scale-105'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          {getTaskIcon(task.type)}
                          <Badge className={getDifficultyColor(task.difficulty)}>
                            {task.difficulty}
                          </Badge>
                        </div>
                        {isCompleted && <CheckCircle className="h-6 w-6 text-green-600" />}
                      </div>
                      
                      <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
                      <CardDescription className="text-sm">{task.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{task.rating?.toFixed(1) || '4.0'}</span>
                          </div>
                        </div>

                        {task.xpReward && (
                          <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                            <Trophy className="h-4 w-4" />
                            <span>{task.xpReward} XP</span>
                          </div>
                        )}

                        {isActive && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">Progress</span>
                              <div className="flex items-center gap-1">
                                <Timer className="h-4 w-4 text-blue-600" />
                                <span className="font-mono">{formatTime(remaining)}</span>
                              </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        <div className="pt-2">
                          {isCompleted ? (
                            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed!</span>
                            </div>
                          ) : isActive ? (
                            <Button 
                              onClick={() => onTaskEnd(task.id, task.title)}
                              variant="destructive"
                              className="w-full"
                            >
                              <Square className="h-4 w-4 mr-2" />
                              End Task
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => onTaskStart(task.id, task.title, duration)}
                              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                              disabled={!!activeTask}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Task
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {completedTasks.size > 0 && (
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Completed Tasks ({completedTasks.size})
          </h3>
          <p className="text-green-700 text-sm">
            Great job! You've completed {completedTasks.size} task{completedTasks.size > 1 ? 's' : ''}. 
            Keep up the excellent work!
          </p>
        </div>
      )}
    </div>
  );
};
