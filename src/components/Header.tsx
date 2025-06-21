
import React from 'react';
import { Brain, Users, Trophy } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              LearnAI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Brain className="h-4 w-4" />
              <span>Tasks</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Users className="h-4 w-4" />
              <span>Collaborate</span>
            </a>
            <a href="#" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Trophy className="h-4 w-4" />
              <span>Achievements</span>
            </a>
          </nav>
          
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};
