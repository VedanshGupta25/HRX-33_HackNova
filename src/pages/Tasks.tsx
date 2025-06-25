import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { InputSection } from '@/components/InputSection';
import { TaskDisplay } from '@/components/TaskDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProgressDisplay } from '@/components/ProgressDisplay';
import { RewardNotification } from '@/components/RewardNotification';
import { VoiceCommands } from '@/components/VoiceCommands';
import { GuideModal } from '@/components/GuideModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGamification } from '@/hooks/useGamification';
import { GeminiApiService, type TaskGenerationRequest } from '@/utils/geminiApi';
import { BookOpen, Sparkles } from 'lucide-react';

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [inputType, setInputType] = useState<'concept' | 'transcript'>('concept');
  const [currentInput, setCurrentInput] = useState('');
  const [showRewards, setShowRewards] = useState(false);
  const [rewardData, setRewardData] = useState<any>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [taskTimers, setTaskTimers] = useState<{[key: string]: { startTime: Date, duration: number }}>({});
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [showGuide, setShowGuide] = useState(false);
  const { toast } = useToast();
  const { userProgress, completeTask, useVoiceCommand, getXpForNextLevel } = useGamification();

  const handleInputSubmit = async (input: string) => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a concept or transcript to generate tasks.",
        variant: "destructive"
      });
      return;
    }

    setCurrentInput(input);
    await generateTasks(input);
  };

  const generateTasks = async (input: string) => {
    setIsLoading(true);
    console.log('Processing input:', input, 'Type:', inputType);
    
    try {
      const request: TaskGenerationRequest = {
        input: input.trim(),
        inputType,
        skillLevel: 'beginner',
        userPreferences: []
      };

      const generatedTasks = await GeminiApiService.generateTasks(request);
      console.log('Generated tasks:', generatedTasks);
      
      setTasks(generatedTasks);
      
      toast({
        title: "Tasks Generated! 🎯",
        description: `Generated ${generatedTasks.length} personalized learning tasks using AI.`,
      });
    } catch (error) {
      console.error('Error generating tasks:', error);
      
      const mockTasks = [
        {
          id: 'mock_1',
          title: `Introduction to ${input}`,
          description: `Learn the fundamentals and core concepts of ${input}`,
          difficulty: 'Beginner',
          estimatedTime: '15 minutes',
          type: 'Reading',
          duration: 15
        },
        {
          id: 'mock_2',
          title: `Practical Application of ${input}`,
          description: `Apply your knowledge through hands-on exercises`,
          difficulty: 'Intermediate',
          estimatedTime: '30 minutes',
          type: 'Exercise',
          duration: 30
        },
        {
          id: 'mock_3',
          title: `Advanced ${input} Techniques`,
          description: `Master advanced concepts and best practices`,
          difficulty: 'Advanced',
          estimatedTime: '45 minutes',
          type: 'Project',
          duration: 45
        }
      ];
      
      setTasks(mockTasks);
      
      toast({
        title: "Using Fallback Tasks",
        description: "API temporarily unavailable. Showing sample tasks instead.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskStart = (taskId: string, taskTitle: string, duration: number) => {
    console.log('Starting task:', { taskId, taskTitle, duration });
    
    if (completedTasks.has(taskId)) {
      toast({
        title: "Task Already Completed",
        description: "This task has already been completed and cannot be restarted.",
        variant: "destructive"
      });
      return;
    }

    if (activeTask === taskId) {
      toast({
        title: "Task Already Active",
        description: "This task is already in progress.",
        variant: "destructive"
      });
      return;
    }

    if (activeTask) {
      toast({
        title: "Another Task Active",
        description: "Please complete or end the current task before starting a new one.",
        variant: "destructive"
      });
      return;
    }

    // Use the duration in minutes directly
    const durationMinutes = duration;

    setActiveTask(taskId);
    setTaskTimers(prev => ({
      ...prev,
      [taskId]: {
        startTime: new Date(),
        duration: durationMinutes * 60 // Convert minutes to seconds
      }
    }));

    toast({
      title: "Task Started! ⏰",
      description: `Timer started for "${taskTitle}". You have ${durationMinutes > 60 ? `${Math.floor(durationMinutes/60)} hour${Math.floor(durationMinutes/60) > 1 ? 's' : ''}` + (durationMinutes % 60 > 0 ? ` ${durationMinutes % 60} minutes` : '') : `${durationMinutes} minutes`} to complete it.`,
    });
  };

  const handleTaskEnd = (taskId: string, taskTitle: string) => {
    console.log('Ending task:', { taskId, taskTitle });
    
    if (completedTasks.has(taskId)) {
      toast({
        title: "Task Already Completed",
        description: "You've already earned points for this task.",
        variant: "destructive"
      });
      return;
    }

    const result = completeTask('learning');
    setCompletedTasks(prev => new Set([...prev, taskId]));
    
    // Remove from active tasks and timers
    if (activeTask === taskId) {
      setActiveTask(null);
    }
    setTaskTimers(prev => {
      const updated = { ...prev };
      delete updated[taskId];
      return updated;
    });
    
    // Show reward notification
    setRewardData({
      ...result,
      newLevel: userProgress.level
    });
    setShowRewards(true);
    
    let toastMessage = `Great job! You earned ${result.reward.points} points, ${result.reward.xp} XP, and ${result.reward.coins} coins!`;
    
    if (result.levelUp) {
      toastMessage += ` 🎉 Level up to ${userProgress.level + 1}!`;
    }
    
    if (result.unlockedAchievements.length > 0) {
      toastMessage += ` 🏆 ${result.unlockedAchievements.length} new achievement${result.unlockedAchievements.length > 1 ? 's' : ''} unlocked!`;
    }

    toast({
      title: "Task Completed! 🎯",
      description: toastMessage,
    });
  };

  const handleVoiceCommand = (command: string, text?: string) => {
    // Track voice command usage
    const voiceResult = useVoiceCommand();
    
    if (voiceResult.unlockedAchievements.length > 0) {
      setRewardData({
        reward: { points: 0, xp: 0, coins: 0 },
        unlockedAchievements: voiceResult.unlockedAchievements,
        levelUp: false,
        newLevel: userProgress.level
      });
      setShowRewards(true);
    }

    switch (command) {
      case 'generate':
        if (currentInput.trim()) {
          generateTasks(currentInput);
        } else {
          toast({
            title: "No Input Available",
            description: "Please enter a concept or transcript first.",
            variant: "destructive"
          });
        }
        break;
      case 'start':
        if (tasks.length > 0) {
          const firstAvailableTask = tasks.find(task => 
            !completedTasks.has(task.id) && activeTask !== task.id
          );
          if (firstAvailableTask) {
            handleTaskStart(firstAvailableTask.id, firstAvailableTask.title, firstAvailableTask.duration || 30);
          } else {
            toast({
              title: "No Available Tasks",
              description: "All tasks are either completed or already active.",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "No Tasks Available",
            description: "Generate tasks first to start learning.",
            variant: "destructive"
          });
        }
        break;
      case 'showDetails':
        toast({
          title: "Showing Details 👁️",
          description: "Task details are now visible.",
        });
        break;
      case 'hideDetails':
        toast({
          title: "Hiding Details 🙈",
          description: "Task details are now hidden.",
        });
        break;
    }
  };

  const handleVoiceInput = (text: string) => {
    setCurrentInput(text);
    useVoiceCommand();
  };

  const handleGuideRating = (rating: number) => {
    toast({
      title: "Thanks for your feedback! ⭐",
      description: `You rated the guide ${rating} star${rating > 1 ? 's' : ''}. This helps us improve!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 ease-in-out">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Theme Toggle and Guide Button */}
          <div className="flex justify-end gap-2 mb-4">
            <Button
              onClick={() => setShowGuide(true)}
              variant="outline"
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-purple-900/20"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Learning Guide</span>
              <span className="sm:hidden">Guide</span>
              <Sparkles className="h-3 w-3 ml-1 animate-pulse" />
            </Button>
            <ThemeToggle />
          </div>

          <ProgressDisplay 
            userProgress={userProgress}
            getXpForNextLevel={getXpForNextLevel}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
              Learning Tasks
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Generate personalized learning tasks and earn rewards for your progress
            </p>
          </div>

          <InputSection
            onSubmit={handleInputSubmit}
            inputType={inputType}
            onInputTypeChange={setInputType}
            isLoading={isLoading}
          />

          {isLoading && <LoadingSpinner />}

          {tasks.length > 0 && !isLoading && (
            <TaskDisplay 
              tasks={tasks} 
              onTaskStart={handleTaskStart}
              onTaskEnd={handleTaskEnd}
              activeTask={activeTask}
              taskTimers={taskTimers}
              completedTasks={completedTasks}
            />
          )}
        </div>
      </main>

      <VoiceCommands 
        onVoiceCommand={handleVoiceCommand}
        onVoiceInput={handleVoiceInput}
      />

      {showRewards && rewardData && (
        <RewardNotification
          reward={rewardData.reward}
          unlockedAchievements={rewardData.unlockedAchievements}
          levelUp={rewardData.levelUp}
          newLevel={rewardData.newLevel}
          onClose={() => setShowRewards(false)}
        />
      )}

      <GuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onRate={handleGuideRating}
      />
    </div>
  );
};

export default Tasks;
