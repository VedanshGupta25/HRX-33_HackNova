import { useState, useEffect } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastTaskDate: string | null;
  totalTasksCompleted: number;
}

export const useStreak = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastTaskDate: null,
    totalTasksCompleted: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('learningStreak');
    if (saved) {
      const data = JSON.parse(saved);
      // Check if streak should be reset (more than 1 day since last task)
      if (data.lastTaskDate) {
        const lastDate = new Date(data.lastTaskDate);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 1) {
          // Reset current streak but keep longest streak and total tasks
          setStreakData({
            ...data,
            currentStreak: 0
          });
        } else {
          setStreakData(data);
        }
      } else {
        setStreakData(data);
      }
    }
  }, []);

  const completeTask = () => {
    const today = new Date().toDateString();
    
    setStreakData(prev => {
      const isNewDay = prev.lastTaskDate !== today;
      const newCurrentStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak;
      const newData = {
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(prev.longestStreak, newCurrentStreak),
        lastTaskDate: today,
        totalTasksCompleted: prev.totalTasksCompleted + 1
      };
      
      localStorage.setItem('learningStreak', JSON.stringify(newData));
      return newData;
    });
  };

  return {
    streakData,
    completeTask
  };
};
