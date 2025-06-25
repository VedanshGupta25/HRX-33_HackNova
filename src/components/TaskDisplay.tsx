
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Star, 
  PlayCircle, 
  CheckCircle, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  Code,
  BookOpen,
  Timer,
  StopCircle,
  Trophy,
  Target
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
  duration?: number;
}

interface TaskDisplayProps {
  tasks: Task[];
  onTaskStart?: (taskId: string, taskTitle: string, duration: number) => void;
  onTaskEnd?: (taskId: string, taskTitle: string) => void;
  activeTask?: string | null;
  taskTimers?: {[key: string]: { startTime: Date, duration: number }};
  completedTasks?: Set<string>;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ 
  tasks, 
  onTaskStart,
  onTaskEnd,
  activeTask,
  taskTimers = {},
  completedTasks = new Set()
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: number}>({});

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: {[key: string]: number} = {};
      
      Object.entries(taskTimers).forEach(([taskId, timer]) => {
        const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000);
        const remaining = Math.max(0, timer.duration - elapsed);
        updated[taskId] = remaining;
        
        // Auto-complete if time runs out
        if (remaining === 0 && activeTask === taskId && !completedTasks.has(taskId)) {
          const task = tasks.find(t => t.id === taskId);
          if (task && onTaskEnd) {
            onTaskEnd(taskId, task.title);
          }
        }
      });
      
      setTimeRemaining(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [taskTimers, activeTask, completedTasks, tasks, onTaskEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <PlayCircle className="h-4 w-4" />;
      case 'project': return <CheckCircle className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getStepByStepTemplate = (difficulty: string, type: string) => {
    const templates = {
      beginner: {
        reading: {
          title: "📚 Beginner Reading Guide",
          steps: [
            {
              step: "PREVIEW PHASE",
              duration: "5 minutes",
              description: "Get an overview before diving in",
              actions: [
                "Scan all headings and subheadings",
                "Look at images, diagrams, and captions", 
                "Read the introduction and conclusion first",
                "Identify key terms highlighted in bold or italics"
              ],
              tip: "This gives you a mental roadmap of what you'll learn!"
            },
            {
              step: "ACTIVE READING",
              duration: "Main reading time",
              description: "Engage with the content actively",
              actions: [
                "Read one section at a time, don't rush",
                "Stop after each paragraph and summarize in your head",
                "Take notes using bullet points (not full sentences)",
                "Ask yourself: 'What is the main point here?'",
                "Write down questions that come to mind"
              ],
              tip: "Reading actively helps you remember 3x better than passive reading"
            },
            {
              step: "NOTE-TAKING TEMPLATE",
              duration: "Throughout reading",
              description: "Organize your understanding",
              actions: [
                "Topic: [Write the main topic]",
                "Main Ideas: • Point 1 • Point 2 • Point 3",
                "Key Terms: • Term: Definition • Term: Definition",
                "My Questions: • What confuses me? • What would I like to know more about?"
              ],
              tip: "Good notes are your best study companion later!"
            },
            {
              step: "REVIEW & REFLECT",  
              duration: "5 minutes",
              description: "Consolidate your learning",
              actions: [
                "Summarize the entire reading in 2-3 sentences",
                "Connect new information to what you already know",
                "Identify what you want to explore further",
                "Rate your understanding from 1-10"
              ],
              tip: "This step transforms information into real knowledge!"
            }
          ]
        },
        exercise: {
          title: "💻 Beginner Exercise Framework",
          steps: [
            {
              step: "SETUP PHASE",
              duration: "5 minutes", 
              description: "Prepare your workspace",
              actions: [
                "Read ALL instructions twice before starting",
                "Gather necessary tools, software, or materials",
                "Create a clean workspace (folders, files, etc.)",
                "Have a notepad ready for writing down thoughts"
              ],
              tip: "Good preparation prevents poor performance!"
            },
            {
              step: "UNDERSTANDING PHASE",
              duration: "10 minutes",
              description: "Break down the problem",
              actions: [
                "Break the exercise into smaller, manageable parts",
                "Identify what you need to achieve (the end goal)",
                "Look at any provided examples carefully",
                "Write down the steps in plain English first"
              ],
              tip: "Understanding the problem is half the solution!"
            },
            {
              step: "IMPLEMENTATION",
              duration: "Main work time",
              description: "Build your solution step by step",
              actions: [
                "Start with the simplest version that works",
                "Test each small part before moving to the next",
                "Follow examples provided - don't skip steps",
                "Save your work frequently (every 10 minutes)",
                "Add comments explaining what you're doing"
              ],
              tip: "Build incrementally - small steps lead to big results!"
            },
            {
              step: "TESTING & DEBUGGING",
              duration: "15 minutes",
              description: "Make sure everything works",
              actions: [
                "Test with the provided examples first",
                "Try edge cases (empty inputs, large numbers, etc.)",
                "Read error messages carefully - they often tell you exactly what's wrong",
                "Compare your solution with any provided examples",
                "Ask for help if stuck for more than 15 minutes"
              ],
              tip: "Every expert was once a beginner who asked good questions!"
            }
          ]
        },
        project: {
          title: "🏗️ Beginner Project Blueprint",
          steps: [
            {
              step: "PLANNING PHASE",
              duration: "15 minutes",
              description: "Plan before you build",
              actions: [
                "Read project requirements 3 times",
                "List all features/components needed",
                "Break the project into 5-7 small tasks",
                "Estimate time for each task",
                "Identify what you don't know yet (research list)"
              ],
              tip: "15 minutes of planning saves hours of confusion!"
            },
            {
              step: "RESEARCH & LEARNING",
              duration: "20 minutes", 
              description: "Fill knowledge gaps",
              actions: [
                "Look up concepts you don't understand",
                "Find 2-3 similar project examples online",
                "Watch a tutorial video if available",
                "Bookmark helpful resources for later"
              ],
              tip: "Standing on the shoulders of giants makes you taller!"
            },
            {
              step: "BUILD PHASE 1 - BASIC VERSION",
              duration: "40% of time",
              description: "Get something working first",
              actions: [
                "Start with the simplest possible version",
                "Focus on core functionality only",
                "Don't worry about making it pretty yet",
                "Test frequently as you build",
                "Save versions as you progress (v1, v2, v3)"
              ],
              tip: "Done is better than perfect - you can always improve later!"
            },
            {
              step: "BUILD PHASE 2 - ENHANCEMENTS",
              duration: "40% of time",
              description: "Add features and polish",
              actions: [
                "Add one feature at a time",
                "Test after each addition",
                "Improve the visual design",
                "Add error handling",
                "Get feedback from others if possible"
              ],
              tip: "Each small improvement compounds into something amazing!"
            },
            {
              step: "FINALIZATION & REFLECTION",
              duration: "20% of time",
              description: "Polish and learn from the experience",
              actions: [
                "Test everything one final time",
                "Clean up your code/work",
                "Write a brief summary of what you learned",
                "Note what you'd do differently next time",
                "Celebrate your accomplishment! 🎉"
              ],
              tip: "Reflection turns experience into wisdom!"
            }
          ]
        }
      }
    };

    return templates[difficulty.toLowerCase() as keyof typeof templates]?.[type.toLowerCase() as keyof typeof templates.beginner] || null;
  };

  const handleRating = (taskId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [taskId]: rating }));
  };

  const renderStars = (taskId: string, currentRating?: number) => {
    const rating = userRatings[taskId] || currentRating || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-all duration-200 hover:scale-110 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
            onClick={() => handleRating(taskId, star)}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
      </div>
    );
  };

  const handleTaskStart = (task: Task) => {
    if (onTaskStart && task.duration) {
      onTaskStart(task.id, task.title, task.duration);
    }
  };

  const handleTaskEnd = (task: Task) => {
    if (onTaskEnd) {
      onTaskEnd(task.id, task.title);
    }
  };

  // Group tasks by difficulty
  const groupedTasks = tasks.reduce((acc, task) => {
    const difficulty = task.difficulty.toLowerCase();
    if (!acc[difficulty]) acc[difficulty] = [];
    acc[difficulty].push(task);
    return acc;
  }, {} as {[key: string]: Task[]});

  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];

  // Get completed tasks for display
  const completedTasksList = tasks.filter(task => completedTasks.has(task.id));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Learning Journey
        </h2>
        <p className="text-gray-600">
          Progress through three levels of difficulty at your own pace
        </p>
      </div>

      {/* Completed Tasks Section */}
      {completedTasksList.length > 0 && (
        <div className="mb-8 animate-scale-in">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="text-xl font-semibold text-gray-800">Completed Tasks ({completedTasksList.length})</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {completedTasksList.map((task, index) => (
              <Card key={task.id} className="bg-green-50 border-green-200 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">{task.title}</span>
                  </div>
                  <p className="text-sm text-green-600">{task.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {task.difficulty}
                    </Badge>
                    <span className="text-xs text-green-600">✅ Completed</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {difficultyOrder.map((difficulty, levelIndex) => {
        const levelTasks = groupedTasks[difficulty] || [];
        if (levelTasks.length === 0) return null;

        return (
          <div 
            key={difficulty}
            className="space-y-4 animate-fade-in"
            style={{ animationDelay: `${levelIndex * 300}ms` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyGradient(difficulty)} text-white font-semibold text-lg shadow-lg transform hover:scale-105 transition-all duration-300`}>
                Level {levelIndex + 1}: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-gray-200 to-transparent rounded"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levelTasks.map((task, taskIndex) => (
                <Card 
                  key={task.id}
                  className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${
                    completedTasks.has(task.id) ? 'ring-2 ring-green-400 bg-green-50/50' : ''
                  } ${
                    activeTask === task.id ? 'ring-2 ring-blue-400 animate-pulse shadow-blue-200' : ''
                  }`}
                  style={{ animationDelay: `${(levelIndex * 300) + (taskIndex * 150)}ms` }}
                >
                  <CardHeader className="pb-3 relative">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getDifficultyGradient(difficulty)}`}></div>
                    
                    {/* Timer Display */}
                    {activeTask === task.id && timeRemaining[task.id] !== undefined && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
                        <Timer className="h-3 w-3" />
                        {formatTime(timeRemaining[task.id])}
                      </div>
                    )}

                    {/* Completion Badge */}
                    {completedTasks.has(task.id) && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-bounce">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mt-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        {getTypeIcon(task.type)}
                        <span className="text-sm font-medium">{task.type}</span>
                      </div>
                      <Badge className={`${getDifficultyColor(task.difficulty)} border text-xs transition-all duration-300 hover:scale-105`}>
                        {task.difficulty}
                      </Badge>
                    </div>

                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
                      {task.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {task.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.estimatedTime}
                      </div>
                      {task.xpReward && (
                        <div className="flex items-center gap-1 text-purple-600">
                          <Zap className="h-4 w-4" />
                          +{task.xpReward} XP
                        </div>
                      )}
                    </div>

                    {/* Progress Bar for Active Tasks */}
                    {activeTask === task.id && timeRemaining[task.id] !== undefined && (
                      <div className="mt-3">
                        <Progress 
                          value={((taskTimers[task.id].duration - timeRemaining[task.id]) / taskTimers[task.id].duration) * 100}
                          className="h-3 transition-all duration-1000"
                        />
                        <div className="text-xs text-center mt-1 text-gray-600">
                          {Math.round(((taskTimers[task.id].duration - timeRemaining[task.id]) / taskTimers[task.id].duration) * 100)}% Complete
                        </div>
                      </div>
                    )}

                    {/* Star Rating */}
                    <div className="pt-2">
                      {renderStars(task.id, task.rating)}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {!completedTasks.has(task.id) ? (
                        <>
                          {activeTask === task.id ? (
                            <Button 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white transition-all transform hover:scale-105 duration-300"
                              onClick={() => handleTaskEnd(task)}
                            >
                              <StopCircle className="h-4 w-4 mr-1" />
                              End Task
                            </Button>
                          ) : (
                            <Button 
                              className={`bg-gradient-to-r ${getDifficultyGradient(difficulty)} hover:shadow-lg text-white transition-all transform hover:scale-105 duration-300`}
                              onClick={() => handleTaskStart(task)}
                              disabled={activeTask !== null && activeTask !== task.id}
                            >
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Start Task
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="col-span-2 flex items-center justify-center py-3 bg-green-50 rounded-lg text-green-700 font-semibold border border-green-200">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Task Completed! 🎉
                        </div>
                      )}
                      
                      <Button 
                        variant="outline"
                        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                        className="border-gray-300 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                      >
                        {expandedTask === task.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Guide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Guide
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expandable Content with Enhanced Step-by-Step Guide */}
                    <Collapsible open={expandedTask === task.id}>
                      <CollapsibleContent className="space-y-4 animate-accordion-down">
                        {(() => {
                          const template = getStepByStepTemplate(task.difficulty, task.type);
                          if (!template) return null;

                          return (
                            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
                                  <Target className="h-5 w-5 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800">{template.title}</h4>
                              </div>
                              
                              <div className="space-y-6">
                                {template.steps.map((step, index) => (
                                  <div 
                                    key={index} 
                                    className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in border-l-4 border-blue-400"
                                    style={{ animationDelay: `${index * 200}ms` }}
                                  >
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white font-bold text-sm">
                                        {index + 1}
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-gray-800 text-lg">{step.step}</h5>
                                        <span className="text-sm text-blue-600 font-medium">⏱️ {step.duration}</span>
                                      </div>
                                    </div>
                                    
                                    <p className="text-gray-700 mb-4 font-medium">{step.description}</p>
                                    
                                    <div className="space-y-2 mb-4">
                                      {step.actions.map((action, actionIndex) => (
                                        <div key={actionIndex} className="flex items-start gap-3 p-2 bg-blue-50 rounded-lg">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                          <span className="text-gray-700 text-sm">{action}</span>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                      <div className="flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                                        <span className="font-semibold text-yellow-800 text-sm">Pro Tip:</span>
                                      </div>
                                      <p className="text-yellow-700 text-sm mt-1">{step.tip}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <span className="font-bold text-green-800">Success Formula</span>
                                </div>
                                <p className="text-green-700 text-sm">
                                  Follow each step at your own pace. Quality over speed - it's better to understand deeply than to rush through!
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedTasks).length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="mb-4">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">No tasks generated yet.</p>
          <p className="text-gray-400">Enter a topic above to get started on your learning journey!</p>
        </div>
      )}
    </div>
  );
};
