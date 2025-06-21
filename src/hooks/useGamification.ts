
import { useState, useEffect } from 'react';

interface UserProgress {
  points: number;
  xp: number;
  level: number;
  coins: number;
  totalTasksCompleted: number;
  skillsUnlocked: string[];
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'points' | 'skills' | 'tasks' | 'special';
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: {
    points: number;
    xp: number;
    coins: number;
  };
}

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 15000, 30000];

export const useGamification = () => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    xp: 0,
    level: 1,
    coins: 0,
    totalTasksCompleted: 0,
    skillsUnlocked: [],
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_steps',
      title: 'First Steps',
      description: 'Complete your first learning task',
      type: 'tasks',
      icon: 'Target',
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      reward: { points: 50, xp: 25, coins: 10 }
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      type: 'streak',
      icon: 'Flame',
      unlocked: false,
      progress: 0,
      maxProgress: 7,
      reward: { points: 200, xp: 100, coins: 50 }
    },
    {
      id: 'dedicated_learner',
      title: 'Dedicated Learner',
      description: 'Complete 25 learning tasks',
      type: 'tasks',
      icon: 'Book',
      unlocked: false,
      progress: 0,
      maxProgress: 25,
      reward: { points: 500, xp: 250, coins: 100 }
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Reach Level 5',
      type: 'points',
      icon: 'Trophy',
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      reward: { points: 1000, xp: 500, coins: 200 }
    },
    {
      id: 'consistency_champion',
      title: 'Consistency Champion',
      description: 'Maintain a 30-day streak',
      type: 'streak',
      icon: 'Star',
      unlocked: false,
      progress: 0,
      maxProgress: 30,
      reward: { points: 1000, xp: 500, coins: 300 }
    }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('gamificationData');
    if (saved) {
      const data = JSON.parse(saved);
      setUserProgress(data.userProgress || userProgress);
      setAchievements(data.achievements || achievements);
    }
  }, []);

  const saveData = (newProgress: UserProgress, newAchievements: Achievement[]) => {
    localStorage.setItem('gamificationData', JSON.stringify({
      userProgress: newProgress,
      achievements: newAchievements
    }));
  };

  const calculateLevel = (xp: number) => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const getXpForNextLevel = (currentLevel: number) => {
    return LEVEL_THRESHOLDS[currentLevel] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  };

  const checkAndUnlockAchievements = (newProgress: UserProgress): Achievement[] => {
    const unlockedAchievements: Achievement[] = [];
    
    const updatedAchievements = achievements.map(achievement => {
      if (!achievement.unlocked) {
        let progress = 0;
        
        switch (achievement.type) {
          case 'tasks':
            progress = newProgress.totalTasksCompleted;
            break;
          case 'streak':
            progress = achievement.id === 'consistency_champion' 
              ? newProgress.longestStreak 
              : newProgress.currentStreak;
            break;
          case 'points':
            progress = newProgress.level;
            break;
        }
        
        const updatedAchievement = {
          ...achievement,
          progress: Math.min(progress, achievement.maxProgress)
        };
        
        if (progress >= achievement.maxProgress && !achievement.unlocked) {
          updatedAchievement.unlocked = true;
          unlockedAchievements.push(updatedAchievement);
        }
        
        return updatedAchievement;
      }
      return achievement;
    });
    
    setAchievements(updatedAchievements);
    return unlockedAchievements;
  };

  const completeTask = (taskType: string = 'general') => {
    const today = new Date().toDateString();
    const baseReward = { points: 10, xp: 15, coins: 5 };
    
    // Streak bonus calculation
    const isNewDay = userProgress.lastActivityDate !== today;
    const newCurrentStreak = isNewDay ? userProgress.currentStreak + 1 : userProgress.currentStreak;
    const streakMultiplier = Math.min(1 + (newCurrentStreak * 0.1), 3); // Max 3x multiplier
    
    const reward = {
      points: Math.floor(baseReward.points * streakMultiplier),
      xp: Math.floor(baseReward.xp * streakMultiplier),
      coins: Math.floor(baseReward.coins * streakMultiplier)
    };
    
    const newProgress: UserProgress = {
      ...userProgress,
      points: userProgress.points + reward.points,
      xp: userProgress.xp + reward.xp,
      coins: userProgress.coins + reward.coins,
      totalTasksCompleted: userProgress.totalTasksCompleted + 1,
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(userProgress.longestStreak, newCurrentStreak),
      lastActivityDate: today,
      level: calculateLevel(userProgress.xp + reward.xp)
    };
    
    setUserProgress(newProgress);
    const unlockedAchievements = checkAndUnlockAchievements(newProgress);
    
    // Award achievement rewards
    if (unlockedAchievements.length > 0) {
      const achievementRewards = unlockedAchievements.reduce((total, achievement) => ({
        points: total.points + achievement.reward.points,
        xp: total.xp + achievement.reward.xp,
        coins: total.coins + achievement.reward.coins
      }), { points: 0, xp: 0, coins: 0 });
      
      const finalProgress = {
        ...newProgress,
        points: newProgress.points + achievementRewards.points,
        xp: newProgress.xp + achievementRewards.xp,
        coins: newProgress.coins + achievementRewards.coins,
        level: calculateLevel(newProgress.xp + achievementRewards.xp)
      };
      
      setUserProgress(finalProgress);
      saveData(finalProgress, achievements);
      
      return { 
        reward: {
          ...reward,
          points: reward.points + achievementRewards.points,
          xp: reward.xp + achievementRewards.xp,
          coins: reward.coins + achievementRewards.coins
        }, 
        unlockedAchievements,
        levelUp: finalProgress.level > userProgress.level
      };
    }
    
    saveData(newProgress, achievements);
    return { 
      reward, 
      unlockedAchievements: [], 
      levelUp: newProgress.level > userProgress.level 
    };
  };

  const checkStreakStatus = () => {
    if (userProgress.lastActivityDate) {
      const lastDate = new Date(userProgress.lastActivityDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff > 1) {
        const resetProgress = {
          ...userProgress,
          currentStreak: 0
        };
        setUserProgress(resetProgress);
        saveData(resetProgress, achievements);
      }
    }
  };

  useEffect(() => {
    checkStreakStatus();
  }, []);

  return {
    userProgress,
    achievements,
    completeTask,
    getXpForNextLevel,
    LEVEL_THRESHOLDS
  };
};
