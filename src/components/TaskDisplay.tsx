
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Star, PlayCircle, CheckCircle } from 'lucide-react';

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
  onTaskComplete?: () => void;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ tasks, onTaskComplete }) => {
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

  const handleTaskStart = (taskTitle: string) => {
    console.log(`Starting task: ${taskTitle}`);
    if (onTaskComplete) {
      onTaskComplete();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Personalized Learning Path
        </h2>
        <p className="text-gray-600">
          Complete these tasks in order to master your chosen topic
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task, index) => (
          <Card 
            key={task.id} 
            className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg"
            style={{ animationDelay: `${index * 200}ms` }}
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
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white transition-all transform hover:scale-105"
                onClick={() => handleTaskStart(task.title)}
              >
                Start Task
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
