import React, { useState, useEffect } from 'react';
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
  X,
  ExternalLink,
  Book,
  Globe,
  FileText,
  GraduationCap
} from 'lucide-react';
import { GeminiSearchService, type LearningReference } from '@/utils/geminiSearchService';

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
  const [loadingReferences, setLoadingReferences] = useState<{[key: number]: boolean}>({});
  const [stepReferences, setStepReferences] = useState<{[key: number]: LearningReference[]}>({});

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

  const getDetailedSteps = (type: string, difficulty: string) => {
    const baseSteps = {
      reading: [
        {
          title: "Preview and scan the material",
          description: "Quickly scan headings, subheadings, and any highlighted text to get an overview of the content structure",
          duration: "5-10 minutes"
        },
        {
          title: "Set clear learning objectives",
          description: "Define what you want to learn and what questions you hope to answer by the end of the reading session",
          duration: "2-3 minutes"
        },
        {
          title: "Read actively with focus",
          description: "Read with intention, highlighting key concepts, asking questions, and making mental connections to prior knowledge",
          duration: "60-70% of total time"
        },
        {
          title: "Take comprehensive notes",
          description: "Write down key concepts, examples, and insights in your own words. Use bullet points, diagrams, or mind maps",
          duration: "Throughout reading"
        },
        {
          title: "Summarize and reflect",
          description: "Write a brief summary of main points and reflect on how this knowledge connects to your existing understanding",
          duration: "10-15 minutes"
        },
        {
          title: "Review and test understanding",
          description: "Quiz yourself on key concepts or explain the material to someone else to solidify your learning",
          duration: "5-10 minutes"
        }
      ],
      exercise: [
        {
          title: "Understand the problem completely",
          description: "Read the requirements carefully, identify input/output expectations, and clarify any ambiguous points",
          duration: "10-15% of total time"
        },
        {
          title: "Break down the problem",
          description: "Divide the problem into smaller, manageable sub-problems and identify the core logic needed",
          duration: "15-20% of total time"
        },
        {
          title: "Plan your approach and strategy",
          description: "Choose the right algorithms, data structures, and design patterns. Sketch out your solution on paper",
          duration: "15-20% of total time"
        },
        {
          title: "Implement step by step",
          description: "Start with the basic structure, then add functionality incrementally. Write clean, readable code",
          duration: "40-50% of total time"
        },
        {
          title: "Test thoroughly with examples",
          description: "Test with edge cases, boundary conditions, and multiple input scenarios to ensure correctness",
          duration: "15-20% of total time"
        },
        {
          title: "Review and optimize",
          description: "Analyze time/space complexity, refactor if needed, and document your solution with comments",
          duration: "5-10% of total time"
        }
      ],
      project: [
        {
          title: "Define project scope and objectives",
          description: "Clearly outline what the project will accomplish, its boundaries, and success criteria",
          duration: "10-15% of total time"
        },
        {
          title: "Research and gather requirements",
          description: "Study similar projects, gather user requirements, and understand technical constraints",
          duration: "15-20% of total time"
        },
        {
          title: "Design the architecture",
          description: "Create system design, choose technologies, and plan the overall structure and component interactions",
          duration: "20-25% of total time"
        },
        {
          title: "Break into manageable tasks",
          description: "Divide the project into specific, actionable tasks with clear deliverables and timelines",
          duration: "5-10% of total time"
        },
        {
          title: "Implement incrementally",
          description: "Build the core functionality first, then add features iteratively. Focus on MVP (Minimum Viable Product)",
          duration: "40-50% of total time"
        },
        {
          title: "Test and iterate",
          description: "Continuously test your work, gather feedback, and make improvements throughout the development process",
          duration: "Throughout development"
        },
        {
          title: "Document and present results",
          description: "Create comprehensive documentation, prepare a demo, and reflect on lessons learned",
          duration: "10-15% of total time"
        }
      ]
    };

    const typeSteps = baseSteps[type.toLowerCase() as keyof typeof baseSteps] || baseSteps.reading;
    
    // Add difficulty-specific guidance
    if (difficulty.toLowerCase() === 'beginner') {
      return typeSteps.map(step => ({
        ...step,
        description: step.description + " (Take extra time to understand each concept thoroughly)"
      }));
    } else if (difficulty.toLowerCase() === 'advanced') {
      return typeSteps.map(step => ({
        ...step,
        description: step.description + " (Focus on advanced techniques and optimization)"
      }));
    }
    
    return typeSteps;
  };

  const loadReferencesForStep = async (stepIndex: number, step: any) => {
    if (stepReferences[stepIndex] || loadingReferences[stepIndex]) return;

    setLoadingReferences(prev => ({ ...prev, [stepIndex]: true }));
    
    try {
      const references = await GeminiSearchService.getReferencesForStep(
        step.title,
        step.description,
        task.type,
        task.difficulty
      );
      
      setStepReferences(prev => ({ ...prev, [stepIndex]: references }));
    } catch (error) {
      console.error('Failed to load references:', error);
    } finally {
      setLoadingReferences(prev => ({ ...prev, [stepIndex]: false }));
    }
  };

  const getReferenceIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case 'website':
        return <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'tutorial':
        return <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case 'documentation':
        return <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const hints = getHelpfulHints(task.type, task.difficulty);
  const steps = getDetailedSteps(task.type, task.difficulty);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Task Preview
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Get helpful hints and detailed step-by-step guidance before starting this task
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

          {/* Step by Step Guide with References */}
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300 transition-colors duration-300">
                <Code className="h-5 w-5" />
                Step by Step Guide - {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-all duration-300">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-300">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 transition-colors duration-300">
                          <Clock className="h-3 w-3" />
                          <span>{step.duration}</span>
                        </div>
                        
                        {/* References Section */}
                        <div className="mt-3">
                          {!stepReferences[index] && !loadingReferences[index] && (
                            <Button
                              onClick={() => loadReferencesForStep(index, step)}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              Load References
                            </Button>
                          )}
                          
                          {loadingReferences[index] && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Loading references...
                            </div>
                          )}
                          
                          {stepReferences[index] && (
                            <div className="space-y-2">
                              <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                Recommended Resources:
                              </h5>
                              <div className="grid gap-2">
                                {stepReferences[index].map((ref, refIndex) => (
                                  <div key={refIndex} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-start gap-2">
                                      {getReferenceIcon(ref.type)}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <h6 className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                                            {ref.title}
                                          </h6>
                                          {ref.url && (
                                            <Button
                                              onClick={() => window.open(ref.url, '_blank')}
                                              variant="ghost"
                                              size="sm"
                                              className="h-4 w-4 p-0 hover:bg-transparent"
                                            >
                                              <ExternalLink className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                            </Button>
                                          )}
                                        </div>
                                        {ref.author && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            by {ref.author}
                                          </p>
                                        )}
                                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                          {ref.description}
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic">
                                          {ref.relevance}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300 transition-colors duration-300">
                  💡 <strong>Pro Tip:</strong> Click "Load References" for each step to get personalized book recommendations and website resources. 
                  Each step builds upon the previous one to maximize your understanding and retention.
                </p>
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
