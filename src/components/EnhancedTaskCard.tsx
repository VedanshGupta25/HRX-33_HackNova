import React, { useState } from 'react';
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
  Code2,
  Bookmark,
  Share2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  type: string;
  xpReward?: number;
  rating?: number;
  showCodePractice?: boolean;
}

interface EnhancedTaskCardProps {
  task: Task;
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  timeRemaining: number;
  onStart: () => void;
  onEnd: () => void;
  onPreview: () => void;
  onCodePractice?: () => void;
}

export const EnhancedTaskCard: React.FC<EnhancedTaskCardProps> = ({
  task,
  isActive,
  isCompleted,
  progress,
  timeRemaining,
  onStart,
  onEnd,
  onPreview,
  onCodePractice
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

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

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `Task "${task.title}" ${isBookmarked ? 'removed from' : 'added to'} your bookmarks.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: task.title,
        text: task.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${task.title}: ${task.description}`);
      toast({
        title: "Copied to clipboard",
        description: "Task details copied to clipboard.",
      });
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-700/20 group ${
      isCompleted 
        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' 
        : isActive 
        ? 'bg-blue-50 border-blue-200 shadow-lg dark:bg-blue-900/20 dark:border-blue-700 dark:shadow-blue-900/20' 
        : 'hover:scale-[1.02] dark:bg-gray-800/50 dark:border-gray-700'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            {getTaskIcon(task.type)}
            <Badge className={getDifficultyColor(task.difficulty)}>
              {task.difficulty}
            </Badge>
            {task.showCodePractice && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700">
                <Code2 className="h-3 w-3 mr-1" />
                Code
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {isCompleted && <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleBookmark}>
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Remove bookmark' : 'Bookmark task'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                  <span className="font-mono dark:text-gray-300 transition-colors duration-300">{formatTime(timeRemaining)}</span>
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
                    onClick={onPreview}
                    variant="outline"
                    className="flex-1 transition-all duration-300 hover:scale-105 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  {isActive ? (
                    <Button 
                      onClick={onEnd}
                      variant="destructive"
                      className="flex-1 transition-all duration-300 hover:scale-105"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      End Task
                    </Button>
                  ) : (
                    <Button 
                      onClick={onStart}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Task
                    </Button>
                  )}
                </div>
                
                {task.showCodePractice && onCodePractice && (
                  <Button 
                    onClick={onCodePractice}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105"
                    variant="secondary"
                  >
                    <Code2 className="h-4 w-4 mr-2" />
                    Practice Coding
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};