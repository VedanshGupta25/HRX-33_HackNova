
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { InputSection } from '@/components/InputSection';
import { TaskDisplay } from '@/components/TaskDisplay';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { GeminiApiService, type TaskGenerationRequest } from '@/utils/geminiApi';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [inputType, setInputType] = useState<'concept' | 'transcript'>('concept');
  const { toast } = useToast();

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
        skillLevel: 'beginner', // Default for now, will be user-configurable later
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
      
      // Fallback to mock data if API fails
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              AI-Powered Learning
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Platform</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform any concept or lecture into personalized, adaptive learning tasks powered by Google Gemini AI
            </p>
          </div>

          {/* Input Section */}
          <InputSection
            onSubmit={handleInputSubmit}
            inputType={inputType}
            onInputTypeChange={setInputType}
            isLoading={isLoading}
          />

          {/* Loading State */}
          {isLoading && <LoadingSpinner />}

          {/* Tasks Display */}
          {tasks.length > 0 && !isLoading && (
            <TaskDisplay tasks={tasks} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
