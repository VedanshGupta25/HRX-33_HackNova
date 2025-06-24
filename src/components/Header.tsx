
import React from 'react';
import { Brain, Users, Trophy, HelpCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              LearnAI
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/tasks" 
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/tasks') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Brain className="h-4 w-4" />
              <span>Tasks</span>
            </Link>
            <Link 
              to="/collaborate" 
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/collaborate') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Collaborate</span>
            </Link>
            <Link 
              to="/achievements" 
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/achievements') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Achievements</span>
            </Link>
            <Link 
              to="/help-support" 
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/help-support') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center space-x-1 transition-colors ${
                isActive('/profile') 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </nav>
          
          <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all transform hover:scale-105">
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};
