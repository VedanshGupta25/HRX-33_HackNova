
import React, { useState } from 'react';
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
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate?: (rating: number) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, onRate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const hints = [
    {
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
      title: "Start with basic concepts",
      description: "Begin with beginner-level tasks to build your foundation"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-green-500" />,
      title: "Take notes while learning",
      description: "Keep track of important points and insights"
    },
    {
      icon: <Code className="h-5 w-5 text-purple-500" />,
      title: "Practice regularly",
      description: "Consistent practice leads to better retention"
    },
    {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      title: "Track your progress",
      description: "Monitor your achievements to stay motivated"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      title: "Complete tasks fully",
      description: "Finish each task to maximize your learning and earn rewards"
    }
  ];

  const steps = [
    {
      title: "Reading Template",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      steps: [
        "Preview the material",
        "Read actively with notes",
        "Summarize key points",
        "Review and reflect"
      ]
    },
    {
      title: "Exercise Template",
      icon: <Code className="h-6 w-6 text-green-600" />,
      steps: [
        "Understand the problem",
        "Plan your approach",
        "Implement solution",
        "Test and validate"
      ]
    },
    {
      title: "Project Template",
      icon: <Lightbulb className="h-6 w-6 text-purple-600" />,
      steps: [
        "Define project scope",
        "Break into smaller tasks",
        "Build incrementally",
        "Document and share"
      ]
    }
  ];

  const handleRating = (value: number) => {
    setRating(value);
    setHasRated(true);
    onRate?.(value);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Learning Guide & Tips
          </DialogTitle>
          <DialogDescription>
            Get helpful hints and step-by-step guidance for effective learning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Helpful Hints Section */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Lightbulb className="h-5 w-5" />
                Helpful Hints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    {hint.icon}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{hint.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{hint.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Guide Section */}
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Code className="h-5 w-5" />
                Template Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-green-600'
                          : index < currentStep
                          ? 'bg-green-400'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  {steps[currentStep].icon}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {steps[currentStep].title}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {steps[currentStep].steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Section */}
          <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Star className="h-5 w-5" />
                Rate This Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                How helpful was this guide? Your feedback helps us improve!
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                {hasRated && (
                  <span className="ml-3 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Thanks for your feedback!
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
