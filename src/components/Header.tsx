
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  HelpCircle, 
  User,
  MessageCircle,
  LogIn,
  LogOut,
  Briefcase
} from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { user, profile, signOut, loading } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">EduAI</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/tasks">
              <Button 
                variant={isActive('/tasks') ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Tasks</span>
              </Button>
            </Link>
            
            <Link to="/achievements">
              <Button 
                variant={isActive('/achievements') ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Achievements</span>
              </Button>
            </Link>
            
            <Link to="/collaborate">
              <Button 
                variant={isActive('/collaborate') ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Collaborate</span>
              </Button>
            </Link>

            <Link to="/chat">
              <Button 
                variant={isActive('/chat') ? "default" : "ghost"}
                className="flex items-center space-x-2 relative"
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Chat</span>
                <Badge className="bg-green-500 text-white ml-1 animate-pulse">New</Badge>
              </Button>
            </Link>

            <Link to="/interview">
              <Button 
                variant={isActive('/interview') ? "default" : "ghost"}
                className="flex items-center space-x-2 relative"
              >
                <Briefcase className="h-4 w-4" />
                <span>Interview</span>
                <Badge className="bg-blue-500 text-white ml-1 animate-pulse">Hot</Badge>
              </Button>
            </Link>
            
            <Link to="/help">
              <Button 
                variant={isActive('/help') ? "default" : "ghost"}
                className="flex items-center space-x-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </Button>
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link to="/profile">
                      <Button 
                        variant={isActive('/profile') ? "default" : "ghost"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {profile?.first_name || 'Profile'}
                        </span>
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/signin">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
