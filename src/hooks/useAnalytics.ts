
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface StudySession {
  id: string;
  session_type: string;
  duration_minutes: number;
  subject: string | null;
  started_at: string;
  completed_at: string | null;
  focus_score: number | null;
}

interface TaskCompletion {
  id: string;
  task_title: string;
  task_type: string;
  difficulty: string;
  subject: string;
  xp_earned: number | null;
  completion_time_minutes: number | null;
  completed_at: string;
}

interface UserPerformance {
  id: string;
  week_start_date: string;
  total_study_hours: number | null;
  total_tasks_completed: number | null;
  average_focus_score: number | null;
  subjects_studied: string[] | null;
  streak_days: number | null;
  completion_rate: number | null;
}

interface LearningPath {
  id: string;
  path_name: string;
  total_steps: number;
  completed_steps: number;
  current_step: number;
  progress_percentage: number | null;
  started_at: string;
  last_activity: string | null;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  // Fetch study sessions
  const { data: studySessions, isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['study-sessions', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for study sessions query');
        return [];
      }
      
      console.log('Fetching study sessions for user:', user.id);
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching study sessions:', error);
        // Don't throw error, return empty array to prevent app crash
        return [];
      }
      
      console.log('Study sessions fetched:', data?.length || 0);
      return data as StudySession[] || [];
    },
    enabled: !!user,
  });

  // Fetch task completions
  const { data: taskCompletions, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['task-completions', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for task completions query');
        return [];
      }
      
      console.log('Fetching task completions for user:', user.id);
      const { data, error } = await supabase
        .from('task_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching task completions:', error);
        // Don't throw error, return empty array to prevent app crash
        return [];
      }
      
      console.log('Task completions fetched:', data?.length || 0);
      return data as TaskCompletion[] || [];
    },
    enabled: !!user,
  });

  // Fetch user performance
  const { data: userPerformance, isLoading: performanceLoading, error: performanceError } = useQuery({
    queryKey: ['user-performance', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for user performance query');
        return null;
      }
      
      console.log('Fetching user performance for user:', user.id);
      const { data, error } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user performance:', error);
        // Don't throw error, return null to prevent app crash
        return null;
      }
      
      console.log('User performance fetched:', !!data);
      return data as UserPerformance | null;
    },
    enabled: !!user,
  });

  // Fetch learning paths
  const { data: learningPaths, isLoading: pathsLoading, error: pathsError } = useQuery({
    queryKey: ['learning-paths', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for learning paths query');
        return [];
      }
      
      console.log('Fetching learning paths for user:', user.id);
      const { data, error } = await supabase
        .from('user_learning_paths')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity', { ascending: false });
      
      if (error) {
        console.error('Error fetching learning paths:', error);
        // Don't throw error, return empty array to prevent app crash
        return [];
      }
      
      console.log('Learning paths fetched:', data?.length || 0);
      return data as LearningPath[] || [];
    },
    enabled: !!user,
  });

  // Function to record a study session
  const recordStudySession = async (sessionData: {
    sessionType: string;
    durationMinutes: number;
    subject?: string;
    focusScore?: number;
  }) => {
    if (!user) {
      console.error('No user found for recording study session');
      throw new Error('User not authenticated');
    }
    
    console.log('Recording study session:', sessionData);
    const { error } = await supabase
      .from('study_sessions')
      .insert({
        user_id: user.id,
        session_type: sessionData.sessionType,
        duration_minutes: sessionData.durationMinutes,
        subject: sessionData.subject,
        focus_score: sessionData.focusScore,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error recording study session:', error);
      throw error;
    }
    
    console.log('Study session recorded successfully');
  };

  // Function to record task completion
  const recordTaskCompletion = async (taskData: {
    taskTitle: string;
    taskType: string;
    difficulty: string;
    subject: string;
    xpEarned?: number;
    completionTimeMinutes?: number;
  }) => {
    if (!user) {
      console.error('No user found for recording task completion');
      throw new Error('User not authenticated');
    }
    
    console.log('Recording task completion:', taskData);
    const { error } = await supabase
      .from('task_completions')
      .insert({
        user_id: user.id,
        task_title: taskData.taskTitle,
        task_type: taskData.taskType,
        difficulty: taskData.difficulty,
        subject: taskData.subject,
        xp_earned: taskData.xpEarned || 0,
        completion_time_minutes: taskData.completionTimeMinutes,
      });

    if (error) {
      console.error('Error recording task completion:', error);
      throw error;
    }
    
    console.log('Task completion recorded successfully');
  };

  // Transform data for charts
  const getWeeklyProgressData = () => {
    if (!studySessions || studySessions.length === 0) {
      console.log('No study sessions data available for weekly progress');
      return [];
    }
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const sessionsForDay = studySessions.filter(session => 
        session.started_at.split('T')[0] === date
      );
      const tasksForDay = taskCompletions?.filter(task => 
        task.completed_at.split('T')[0] === date
      ) || [];
      
      const totalMinutes = sessionsForDay.reduce((sum, session) => sum + session.duration_minutes, 0);
      const xp = tasksForDay.reduce((sum, task) => sum + (task.xp_earned || 0), 0);
      
      return {
        day: dayName,
        xp,
        tasks: tasksForDay.length,
        studyMinutes: totalMinutes
      };
    });
  };

  const getSubjectBreakdown = () => {
    if (!studySessions || studySessions.length === 0) {
      console.log('No study sessions data available for subject breakdown');
      return [];
    }
    
    const subjectHours: { [key: string]: number } = {};
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
    
    // Count study session hours by subject
    studySessions.forEach(session => {
      const subject = session.subject || 'General';
      const hours = session.duration_minutes / 60;
      subjectHours[subject] = (subjectHours[subject] || 0) + hours;
    });

    return Object.entries(subjectHours)
      .map(([subject, hours], index) => ({
        subject,
        hours: Math.round(hours * 10) / 10,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.hours - a.hours);
  };

  const getPerformanceStats = () => {
    const totalHours = studySessions?.reduce((sum, session) => sum + session.duration_minutes, 0) / 60 || 0;
    const totalTasks = taskCompletions?.length || 0;
    const averageFocus = studySessions?.length > 0 
      ? studySessions.reduce((sum, session) => sum + (session.focus_score || 100), 0) / studySessions.length 
      : 100;
    const completionRate = userPerformance?.completion_rate || 85;

    // Calculate current streak (simplified)
    const streak = userPerformance?.streak_days || 0;

    return {
      totalHours: Math.round(totalHours * 10) / 10,
      averageSession: studySessions?.length > 0 ? Math.round((totalHours * 60) / studySessions.length) : 45,
      completionRate: Math.round(completionRate),
      focusScore: Math.round(averageFocus),
      streakData: {
        current: streak,
        longest: streak + 8, // Mock longest streak
        thisWeek: Math.min(streak, 7)
      }
    };
  };

  const isLoading = sessionsLoading || tasksLoading || performanceLoading || pathsLoading;

  // Log any errors
  React.useEffect(() => {
    if (sessionsError) console.error('Study sessions error:', sessionsError);
    if (tasksError) console.error('Task completions error:', tasksError);
    if (performanceError) console.error('User performance error:', performanceError);
    if (pathsError) console.error('Learning paths error:', pathsError);
  }, [sessionsError, tasksError, performanceError, pathsError]);

  return {
    studySessions: studySessions || [],
    taskCompletions: taskCompletions || [],
    userPerformance,
    learningPaths: learningPaths || [],
    isLoading,
    recordStudySession,
    recordTaskCompletion,
    getWeeklyProgressData,
    getSubjectBreakdown,
    getPerformanceStats,
  };
};
