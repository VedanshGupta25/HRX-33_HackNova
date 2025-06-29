import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Timer, 
  Coffee,
  Target,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudyTimerProps {
  onSessionComplete?: (duration: number) => void;
  defaultDuration?: number; // in minutes
}

export const StudyTimer: React.FC<StudyTimerProps> = ({
  onSessionComplete,
  defaultDuration = 25
}) => {
  const [timeLeft, setTimeLeft] = useState(defaultDuration * 60); // in seconds
  const [totalTime, setTotalTime] = useState(defaultDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Study session completed
      setSessionsCompleted(prev => prev + 1);
      onSessionComplete?.(totalTime - timeLeft);
      
      toast({
        title: "Study Session Complete! 🎯",
        description: "Great job! Time for a well-deserved break.",
      });
      
      // Start break timer
      const breakDuration = sessionsCompleted % 4 === 3 ? 15 : 5; // Long break every 4 sessions
      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
      setTotalTime(breakDuration * 60);
    } else {
      // Break completed
      toast({
        title: "Break Complete! ⚡",
        description: "Ready to get back to learning?",
      });
      
      // Reset to study session
      setIsBreak(false);
      setTimeLeft(defaultDuration * 60);
      setTotalTime(defaultDuration * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? (sessionsCompleted % 4 === 3 ? 15 : 5) * 60 : defaultDuration * 60);
    setTotalTime(isBreak ? (sessionsCompleted % 4 === 3 ? 15 : 5) * 60 : defaultDuration * 60);
  };

  const stopSession = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(defaultDuration * 60);
    setTotalTime(defaultDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className={`w-full max-w-md mx-auto ${
      isBreak 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
    } transition-all duration-500`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          {isBreak ? (
            <>
              <Coffee className="h-6 w-6 text-green-600" />
              Break Time
            </>
          ) : (
            <>
              <Timer className="h-6 w-6 text-blue-600" />
              Study Session
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${
            isBreak ? 'text-green-600' : 'text-blue-600'
          } transition-colors duration-300`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {isBreak ? 'Break time remaining' : 'Study time remaining'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className={`h-3 ${isBreak ? 'bg-green-100' : 'bg-blue-100'}`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0:00</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>

        {/* Session Counter */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="font-medium">Sessions: {sessionsCompleted}</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="text-gray-600">
            Next: {sessionsCompleted % 4 === 3 ? 'Long break' : isBreak ? 'Study' : 'Short break'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={toggleTimer}
            className={`${
              isBreak 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-all duration-300 hover:scale-105`}
          >
            {isRunning ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Pause' : 'Start'}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            className="transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={stopSession}
            variant="destructive"
            className="transition-all duration-300 hover:scale-105"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>

        {/* Tips */}
        <div className={`p-3 rounded-lg ${
          isBreak 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        } text-sm text-center`}>
          {isBreak ? (
            "💡 Take a walk, stretch, or grab some water to recharge!"
          ) : (
            "🎯 Focus on one task at a time. You've got this!"
          )}
        </div>
      </CardContent>
    </Card>
  );
};