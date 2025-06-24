
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  BookOpen
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
  onTaskComplete?: (taskTitle: string) => void;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ tasks, onTaskComplete }) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});

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

  const getTaskHints = (difficulty: string, type: string) => {
    const hints = {
      beginner: {
        reading: ["Start with basic concepts", "Take notes while reading", "Look up unfamiliar terms"],
        exercise: ["Follow step-by-step instructions", "Practice multiple times", "Ask for help when stuck"],
        project: ["Break into small tasks", "Use templates provided", "Focus on learning over perfection"]
      },
      intermediate: {
        reading: ["Connect concepts to prior knowledge", "Analyze examples critically", "Research additional sources"],
        exercise: ["Try variations of problems", "Understand the why behind solutions", "Time yourself for efficiency"],
        project: ["Plan before coding", "Implement core features first", "Document your process"]
      },
      advanced: {
        reading: ["Question assumptions in the material", "Compare different approaches", "Identify real-world applications"],
        exercise: ["Optimize for performance", "Handle edge cases", "Create your own test cases"],
        project: ["Design scalable architecture", "Consider user experience", "Implement best practices"]
      }
    };
    
    return hints[difficulty.toLowerCase() as keyof typeof hints]?.[type.toLowerCase() as keyof typeof hints.beginner] || [];
  };

  const getTemplate = (difficulty: string, type: string) => {
    const templates = {
      beginner: {
        reading: "📚 Reading Template:\n1. Preview the material\n2. Read actively with notes\n3. Summarize key points\n4. Review and reflect",
        exercise: "💻 Exercise Template:\n1. Read instructions carefully\n2. Set up environment\n3. Follow examples\n4. Test your solution",
        project: "🏗️ Project Template:\n1. Understand requirements\n2. Plan your approach\n3. Build incrementally\n4. Test and improve"
      },
      intermediate: {
        reading: "📖 Advanced Reading:\n1. Scan for main ideas\n2. Deep dive into complex sections\n3. Create concept maps\n4. Apply to scenarios",
        exercise: "⚡ Intermediate Practice:\n1. Analyze the problem\n2. Plan your solution\n3. Implement efficiently\n4. Validate thoroughly",
        project: "🚀 Project Framework:\n1. Design architecture\n2. Implement core features\n3. Add enhancements\n4. Polish and optimize"
      },
      advanced: {
        reading: "🧠 Expert Analysis:\n1. Critical evaluation\n2. Compare methodologies\n3. Identify innovations\n4. Plan applications",
        exercise: "🔬 Advanced Problem Solving:\n1. Multi-angle analysis\n2. Optimize algorithms\n3. Handle edge cases\n4. Benchmark performance",
        project: "🏆 Professional Project:\n1. System design\n2. Scalable implementation\n3. Testing strategy\n4. Production deployment"
      }
    };
    
    return templates[difficulty.toLowerCase() as keyof typeof templates]?.[type.toLowerCase() as keyof typeof templates.beginner] || "Template not available";
  };

  const handleRating = (taskId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [taskId]: rating }));
  };

  const handleTaskStart = (task: Task) => {
    console.log(`Starting task: ${task.title}`);
    if (onTaskComplete) {
      onTaskComplete(task.title);
    }
  };

  const renderStars = (taskId: string, currentRating?: number) => {
    const rating = userRatings[taskId] || currentRating || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRating(taskId, star)}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
      </div>
    );
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
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Learning Journey
        </h2>
        <p className="text-gray-600">
          Progress through three levels of difficulty at your own pace
        </p>
      </div>

      {difficultyOrder.map((difficulty, levelIndex) => {
        const levelTasks = groupedTasks[difficulty] || [];
        if (levelTasks.length === 0) return null;

        return (
          <div 
            key={difficulty}
            className="space-y-4"
            style={{ animationDelay: `${levelIndex * 300}ms` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyGradient(difficulty)} text-white font-semibold text-lg shadow-lg`}>
                Level {levelIndex + 1}: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-gray-200 to-transparent rounded"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levelTasks.map((task, taskIndex) => (
                <Card 
                  key={task.id}
                  className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                  style={{ animationDelay: `${(levelIndex * 300) + (taskIndex * 150)}ms` }}
                >
                  <CardHeader className="pb-3 relative">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getDifficultyGradient(difficulty)}`}></div>
                    
                    <div className="flex items-start justify-between mt-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        {getTypeIcon(task.type)}
                        <span className="text-sm font-medium">{task.type}</span>
                      </div>
                      <Badge className={`${getDifficultyColor(task.difficulty)} border text-xs`}>
                        {task.difficulty}
                      </Badge>
                    </div>

                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
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

                    {/* Star Rating */}
                    <div className="pt-2">
                      {renderStars(task.id, task.rating)}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        className={`bg-gradient-to-r ${getDifficultyGradient(difficulty)} hover:shadow-lg text-white transition-all transform hover:scale-105`}
                        onClick={() => handleTaskStart(task)}
                      >
                        Start Task
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        {expandedTask === task.id ? 'Hide' : 'Details'}
                      </Button>
                    </div>

                    {/* Expandable Content */}
                    <Collapsible open={expandedTask === task.id}>
                      <CollapsibleContent className="space-y-4 animate-accordion-down">
                        {/* Hints Section */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <h4 className="font-semibold text-blue-800">Helpful Hints</h4>
                          </div>
                          <ul className="space-y-1">
                            {getTaskHints(task.difficulty, task.type).map((hint, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Template Section */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="h-4 w-4 text-green-600" />
                            <h4 className="font-semibold text-green-800">Template Guide</h4>
                          </div>
                          <pre className="text-sm text-green-700 whitespace-pre-wrap font-mono bg-white/50 p-3 rounded border">
                            {getTemplate(task.difficulty, task.type)}
                          </pre>
                        </div>
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks generated yet. Enter a topic above to get started!</p>
        </div>
      )}
    </div>
  );
};
