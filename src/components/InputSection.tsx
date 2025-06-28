import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lightbulb, Sparkles } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (input: string) => void;
  inputType: 'concept' | 'transcript';
  onInputTypeChange: (type: 'concept' | 'transcript') => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onSubmit,
  inputType,
  onInputTypeChange,
  isLoading
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    onSubmit(input);
  };

  const exampleConcepts = [
    "Machine Learning Basics",
    "React Hooks",
    "Photosynthesis",
    "Financial Markets"
  ];

  return (
    <Card className="mb-8 shadow-lg border-purple-500/30 bg-black/20 backdrop-blur-md animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
          What would you like to learn?
        </CardTitle>
        <CardDescription className="text-gray-300">
          Enter a concept or paste a lecture transcript to generate personalized learning tasks
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={inputType} onValueChange={(value) => onInputTypeChange(value as 'concept' | 'transcript')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/20 border-purple-500/30">
            <TabsTrigger value="concept" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Lightbulb className="h-4 w-4" />
              Concept
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2 text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4" />
              Transcript
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="concept" className="space-y-4">
            <Textarea
              placeholder="Enter a concept you'd like to learn about (e.g., Machine Learning, React Components, Quantum Physics...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] border-2 border-purple-500/30 focus:border-purple-400 transition-colors bg-black/20 text-white placeholder:text-gray-400"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Quick examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleConcepts.map((concept) => (
                  <button
                    key={concept}
                    onClick={() => setInput(concept)}
                    className="px-3 py-1 text-sm bg-purple-500/20 text-purple-300 rounded-full hover:bg-purple-500/40 transition-colors border border-purple-500/30"
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transcript" className="space-y-4">
            <Textarea
              placeholder="Paste your lecture transcript or notes here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] border-2 border-purple-500/30 focus:border-purple-400 transition-colors bg-black/20 text-white placeholder:text-gray-400"
            />
          </TabsContent>
        </Tabs>
        
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg transition-all transform hover:scale-105 disabled:transform-none disabled:opacity-50 animate-cosmic-glow"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Tasks...
            </div>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate Learning Tasks
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
