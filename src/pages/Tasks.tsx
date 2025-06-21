
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { InputSection } from '@/components/InputSection';
import { TaskDisplay } from '@/components/TaskDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { StreakDisplay } from '@/components/StreakDisplay';
import { useToast } from '@/hooks/use-toast';
import { useStreak } from '@/hooks/useStreak';
import { GeminiApiService, type TaskGenerationRequest } from '@/utils/geminiApi';

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [inputType, setInputType] = useState<'concept' | 'transcript'>('concept');
  const { toast } = useToast();
  const { streakData, completeTask } = useStreak();

  const handleInputSubmit = async (input: string) => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a concept or transcript to generate tasks.",
        variant: "destructive"
      });
      return;
    }

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
        title: "Tasks Generated!",
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
          type: 'Reading'
        },
        {
          id: 'mock_2',
          title: `Practical Application of ${input}`,
          description: `Apply your knowledge through hands-on exercises`,
          difficulty: 'Intermediate',
          estimatedTime: '30 minutes',
          type: 'Exercise'
        },
        {
          id: 'mock_3',
          title: `Advanced ${input} Techniques`,
          description: `Master advanced concepts and best practices`,
          difficulty: 'Advanced',
          estimatedTime: '45 minutes',
          type: 'Project'
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

  const handleTaskComplete = () => {
    completeTask();
    toast({
      title: "Task Completed!",
      description: "Great job! Your learning streak has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <StreakDisplay 
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            totalTasksCompleted={streakData.totalTasksCompleted}
          />

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Learning Tasks
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate personalized learning tasks for any concept or transcript
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
            <TaskDisplay tasks={tasks} onTaskComplete={handleTaskComplete} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Tasks;
