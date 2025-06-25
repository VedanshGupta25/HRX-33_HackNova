
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BookOpen,
  Lightbulb,
  Code,
  Star,
  CheckCircle,
  Clock,
  Trophy,
  Eye,
  X
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

interface TaskPreviewModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskPreviewModal: React.FC<TaskPreviewModalProps> = ({ task, isOpen, onClose }) => {
  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reading':
        return <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case 'exercise':
        return <Code className="h-6 w-6 text-green-600 dark:text-green-400" />;
      case 'project':
        return <Lightbulb className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getHelpfulHints = (type: string, difficulty: string) => {
    const baseHints = [
      {
        icon: <Lightbulb className="h-4 w-4 text-blue-500 dark:text-blue-400" />,
        title: "Start with preparation",
        description: "Set up a distraction-free environment for focused learning"
      },
      {
        icon: <BookOpen className="h-4 w-4 text-green-500 dark:text-green-400" />,
        title: "Take active notes",
        description: "Write down key concepts and insights as you learn"
      },
      {
        icon: <Clock className="h-4 w-4 text-purple-500 dark:text-purple-400" />,
        title: "Manage your time",
        description: "Break the task into smaller chunks if needed"
      },
      {
        icon: <Star className="h-4 w-4 text-yellow-500" />,
        title: "Track progress",
        description: "Monitor your understanding and adjust pace accordingly"
      }
    ];

    if (difficulty.toLowerCase() === 'beginner') {
      baseHints.push({
        icon: <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />,
        title: "Don't rush",
        description: "Take your time to understand fundamentals thoroughly"
      });
    }

    return baseHints;
  };

  const getTemplateSteps = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reading':
        return [
          "Preview the material and scan headings",
          "Read actively with focus and intention",
          "Take notes on key concepts and examples",
          "Summarize main points in your own words",
          "Review and reflect on what you've learned"
        ];
      case 'exercise':
        return [
          "Understand the problem requirements",
          "Plan your approach and strategy", 
          "Implement your solution step by step",
          "Test your solution with examples",
          "Review and optimize your approach"
        ];
      case 'project':
        return [
          "Define clear project objectives and scope",
          "Break the project into manageable tasks",
          "Create a timeline and set milestones",
          "Build incrementally and test frequently",
          "Document your work and share results"
        ];
      default:
        return [
          "Review the task requirements",
          "Plan your learning approach",
          "Execute with focused attention",
          "Validate your understanding",
          "Reflect on lessons learned"
        ];
    }
  };

  const hints = getHelpfulHints(task.type, task.difficulty);
  const steps = getTemplateSteps(task.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Task Preview
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Get helpful hints and step-by-step guidance before starting this task
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Overview */}
          <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTaskIcon(task.type)}
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {task.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                      {task.description}
                    </p>
                  </div>
                </div>
                <Badge className={getDifficultyColor(task.difficulty)}>
                  {task.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Clock className="h-4 w-4" />
                  <span>{task.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{task.rating?.toFixed(1) || '4.0'} rating</span>
                </div>
                {task.xpReward && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium transition-colors duration-300">
                    <Trophy className="h-4 w-4" />
                    <span>{task.xpReward} XP</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Helpful Hints */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 transition-colors duration-300">
                <Lightbulb className="h-5 w-5" />
                Helpful Hints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300">
                    {hint.icon}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {hint.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
                        {hint.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Guide */}
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300 transition-colors duration-300">
                <Code className="h-5 w-5" />
                {task.type.charAt(0).toUpperCase() + task.type.slice(1)} Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-md transition-all duration-300">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
                      {index + 1}
                    </Badge>
                    <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <Button 
            onClick={onClose} 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
          >
            <CheckCircle className="h-4 w-4" />
            Got it, let's start!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
