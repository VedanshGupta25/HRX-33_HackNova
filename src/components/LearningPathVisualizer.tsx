import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Clock, 
  Trophy,
  Star,
  BookOpen,
  Code,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: 'reading' | 'exercise' | 'project';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
}

interface LearningPathVisualizerProps {
  title: string;
  description: string;
  steps: LearningStep[];
  overallProgress: number;
  onStepClick: (stepId: string) => void;
}

export const LearningPathVisualizer: React.FC<LearningPathVisualizerProps> = ({
  title,
  description,
  steps,
  overallProgress,
  onStepClick
}) => {
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'exercise':
        return <Code className="h-4 w-4" />;
      case 'project':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getStepStatus = (step: LearningStep) => {
    if (step.isCompleted) {
      return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (step.isActive) {
      return { icon: Target, color: 'text-blue-600', bgColor: 'bg-blue-100' };
    } else if (step.isLocked) {
      return { icon: Circle, color: 'text-gray-400', bgColor: 'bg-gray-100' };
    } else {
      return { icon: Circle, color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(overallProgress)}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        <Progress value={overallProgress} className="mt-4 h-2" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const StatusIcon = status.icon;
            const isSelected = selectedStep === step.id;

            return (
              <div key={step.id} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
                )}

                <div
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : step.isLocked
                      ? 'border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-60'
                      : 'border-gray-200 bg-white dark:bg-gray-800 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => {
                    if (!step.isLocked) {
                      setSelectedStep(isSelected ? null : step.id);
                      onStepClick(step.id);
                    }
                  }}
                >
                  {/* Step indicator */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${status.bgColor} flex items-center justify-center`}>
                    <StatusIcon className={`h-6 w-6 ${status.color}`} />
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold ${step.isLocked ? 'text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {step.title}
                      </h3>
                      <Badge className={getDifficultyColor(step.difficulty)}>
                        {step.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStepIcon(step.type)}
                        <span className="text-xs text-gray-500 capitalize">{step.type}</span>
                      </div>
                    </div>

                    <p className={`text-sm mb-3 ${step.isLocked ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{step.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          <span>{step.xpReward} XP</span>
                        </div>
                      </div>

                      {step.isCompleted && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  {!step.isLocked && (
                    <div className="flex-shrink-0">
                      <ArrowRight className={`h-5 w-5 transition-transform duration-300 ${
                        isSelected ? 'rotate-90 text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                  )}
                </div>

                {/* Expanded content */}
                {isSelected && (
                  <div className="mt-2 ml-16 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 animate-fade-in">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Learning Objectives</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li>• Master the core concepts and terminology</li>
                          <li>• Apply knowledge through practical exercises</li>
                          <li>• Build confidence for the next learning step</li>
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={step.isLocked}
                        >
                          {step.isCompleted ? 'Review' : step.isActive ? 'Continue' : 'Start'}
                        </Button>
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};