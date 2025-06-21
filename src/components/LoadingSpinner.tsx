
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 justify-center">
          <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
          AI is crafting your learning path...
        </h3>
        <p className="text-gray-600 mt-2">This may take a few moments</p>
      </div>
      
      <div className="mt-4 flex space-x-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};
