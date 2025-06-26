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
  Timer,
  Eye,
  Code2
} from 'lucide-react';
import { TaskPreviewModal } from './TaskPreviewModal';
import { CodePracticeModal } from './CodePracticeModal';

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
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const [codePracticeTask, setCodePracticeTask] = useState<Task | null>(null);

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
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const extractDuration = (estimatedTime: string): number => {
    // Extract both hours and minutes from the estimated time
    const hourMatch = estimatedTime.match(/(\d+)\s*hour/i);
    const minuteMatch = estimatedTime.match(/(\d+)\s*min/i);
    
    let totalMinutes = 0;
    
    if (hourMatch) {
      totalMinutes += parseInt(hourMatch[1]) * 60;
    }
    
    if (minuteMatch) {
      totalMinutes += parseInt(minuteMatch[1]);
    }
    
    // If no specific time found, try to extract any number and assume minutes
    if (totalMinutes === 0) {
      const numberMatch = estimatedTime.match(/(\d+)/);
      totalMinutes = numberMatch ? parseInt(numberMatch[1]) : 30;
    }
    
    return totalMinutes;
  };

  const calculateProgress = (taskId: string): number => {
    if (!taskTimers[taskId]) return 0;
    const timer = taskTimers[taskId];
    const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000);
    return Math.min(100, (elapsed / timer.duration) * 100);
  };

  const isCodeRelatedTask = (task: Task): boolean => {
    const codeKeywords = ['code', 'programming', 'exercise', 'project', 'algorithm', 'function', 'implementation'];
    const taskText = `${task.title} ${task.description} ${task.type}`.toLowerCase();
    return codeKeywords.some(keyword => taskText.includes(keyword)) || 
           ['exercise', 'project'].includes(task.type.toLowerCase());
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">
          Your Learning Tasks
        </h2>
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Complete tasks to earn XP, unlock achievements, and level up!
        </p>
      </div>

      {difficultyOrder.map(difficulty => {
        const difficultyTasks = groupedTasks[difficulty];
        if (!difficultyTasks || difficultyTasks.length === 0) return null;

        return (
          <div key={difficulty} className="animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 capitalize flex items-center gap-2 transition-colors duration-300">
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
                const showCodeButton = isCodeRelatedTask(task);

                return (
                  <Card 
                    key={task.id}
                    className={`transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700/20 ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
                        : isActive 
                        ? 'bg-blue-50 border-blue-200 shadow-lg dark:bg-blue-900/20 dark:border-blue-700 dark:shadow-blue-900/20' 
                        : 'hover:scale-105 dark:bg-gray-800/50 dark:border-gray-700'
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
                          {showCodeButton && (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700">
                              <Code2 className="h-3 w-3 mr-1" />
                              Code
                            </Badge>
                          )}
                        </div>
                        {isCompleted && <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
                      </div>
                      
                      <CardTitle className="text-lg leading-tight dark:text-gray-100 transition-colors duration-300">
                        {task.title}
                      </CardTitle>
                      <CardDescription className="text-sm dark:text-gray-400 transition-colors duration-300">
                        {task.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
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
                          <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300">
                            <Trophy className="h-4 w-4" />
                            <span>{task.xpReward} XP</span>
                          </div>
                        )}

                        {isActive && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium dark:text-gray-300 transition-colors duration-300">Progress</span>
                              <div className="flex items-center gap-1">
                                <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="font-mono dark:text-gray-300 transition-colors duration-300">{formatTime(remaining)}</span>
                              </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        <div className="pt-2 space-y-2">
                          {isCompleted ? (
                            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium transition-colors duration-300">
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed!</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => setPreviewTask(task)}
                                  variant="outline"
                                  className="flex-1 transition-all duration-300 hover:scale-105 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </Button>
                                {isActive ? (
                                  <Button 
                                    onClick={() => onTaskEnd(task.id, task.title)}
                                    variant="destructive"
                                    className="flex-1 transition-all duration-300 hover:scale-105"
                                  >
                                    <Square className="h-4 w-4 mr-2" />
                                    End Task
                                  </Button>
                                ) : (
                                  <Button 
                                    onClick={() => onTaskStart(task.id, task.title, duration)}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
                                    disabled={!!activeTask}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Task
                                  </Button>
                                )}
                              </div>
                              
                              {showCodeButton && (
                                <Button 
                                  onClick={() => setCodePracticeTask(task)}
                                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105"
                                  variant="secondary"
                                >
                                  <Code2 className="h-4 w-4 mr-2" />
                                  Practice Code
                                </Button>
                              )}
                            </div>
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
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 transition-all duration-300">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2 transition-colors duration-300">
            <Trophy className="h-5 w-5" />
            Completed Tasks ({completedTasks.size})
          </h3>
          <p className="text-green-700 dark:text-green-400 text-sm transition-colors duration-300">
            Great job! You've completed {completedTasks.size} task{completedTasks.size > 1 ? 's' : ''}. 
            Keep up the excellent work!
          </p>
        </div>
      )}

      {previewTask && (
        <TaskPreviewModal
          task={previewTask}
          isOpen={!!previewTask}
          onClose={() => setPreviewTask(null)}
        />
      )}

      {codePracticeTask && (
        <CodePracticeModal
          isOpen={!!codePracticeTask}
          onClose={() => setCodePracticeTask(null)}
          taskTitle={codePracticeTask.title}
          taskType={codePracticeTask.type}
        />
      )}
    </div>
  );
};
