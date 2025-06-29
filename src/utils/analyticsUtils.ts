
import { supabase } from '@/integrations/supabase/client';

export const generateSampleAnalyticsData = async (userId: string) => {
  try {
    // Generate sample study sessions for the past week
    const studySessions = [];
    const taskCompletions = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add 1-3 study sessions per day
      const sessionsPerDay = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < sessionsPerDay; j++) {
        const sessionDate = new Date(date);
        sessionDate.setHours(9 + j * 2, Math.floor(Math.random() * 60));
        
        studySessions.push({
          user_id: userId,
          session_type: 'study',
          duration_minutes: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
          subject: ['Web Development', 'Machine Learning', 'Data Science', 'UI/UX Design'][Math.floor(Math.random() * 4)],
          started_at: sessionDate.toISOString(),
          completed_at: new Date(sessionDate.getTime() + (Math.floor(Math.random() * 45) + 15) * 60000).toISOString(),
          focus_score: Math.floor(Math.random() * 20) + 80, // 80-100
        });
      }
      
      // Add 1-2 task completions per day
      const tasksPerDay = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < tasksPerDay; j++) {
        const taskDate = new Date(date);
        taskDate.setHours(10 + j * 3, Math.floor(Math.random() * 60));
        
        taskCompletions.push({
          user_id: userId,
          task_title: [
            'JavaScript Fundamentals Quiz',
            'React Component Exercise',
            'Database Design Challenge',
            'UI Design Practice',
            'Algorithm Problem Solving'
          ][Math.floor(Math.random() * 5)],
          task_type: ['reading', 'exercise', 'project'][Math.floor(Math.random() * 3)],
          difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
          subject: ['Web Development', 'Machine Learning', 'Data Science', 'UI/UX Design'][Math.floor(Math.random() * 4)],
          xp_earned: Math.floor(Math.random() * 150) + 50, // 50-200 XP
          completion_time_minutes: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
          completed_at: taskDate.toISOString(),
        });
      }
    }

    // Insert study sessions
    const { error: sessionsError } = await supabase
      .from('study_sessions')
      .insert(studySessions);

    if (sessionsError) {
      console.error('Error inserting study sessions:', sessionsError);
    }

    // Insert task completions
    const { error: tasksError } = await supabase
      .from('task_completions')
      .insert(taskCompletions);

    if (tasksError) {
      console.error('Error inserting task completions:', tasksError);
    }

    // Create user performance record
    const totalStudyMinutes = studySessions.reduce((sum, session) => sum + session.duration_minutes, 0);
    const averageFocus = studySessions.reduce((sum, session) => sum + session.focus_score, 0) / studySessions.length;
    const uniqueSubjects = [...new Set(studySessions.map(session => session.subject))];

    const { error: performanceError } = await supabase
      .from('user_performance')
      .upsert({
        user_id: userId,
        week_start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_study_hours: totalStudyMinutes / 60,
        total_tasks_completed: taskCompletions.length,
        average_focus_score: averageFocus,
        subjects_studied: uniqueSubjects,
        streak_days: Math.floor(Math.random() * 10) + 3, // 3-12 days
        completion_rate: Math.floor(Math.random() * 20) + 80, // 80-100%
      });

    if (performanceError) {
      console.error('Error inserting performance data:', performanceError);
    }

    // Create a sample learning path
    const { error: pathError } = await supabase
      .from('user_learning_paths')
      .insert({
        user_id: userId,
        path_name: 'JavaScript Mastery Path',
        total_steps: 10,
        completed_steps: Math.floor(Math.random() * 6) + 2, // 2-7 steps
        current_step: Math.floor(Math.random() * 4) + 3, // 3-6
        progress_percentage: Math.floor(Math.random() * 40) + 30, // 30-70%
      });

    if (pathError) {
      console.error('Error inserting learning path:', pathError);
    }

    return { success: true };
  } catch (error) {
    console.error('Error generating sample data:', error);
    return { success: false, error };
  }
};

export const clearUserAnalyticsData = async (userId: string) => {
  try {
    // Clear all user data
    await Promise.all([
      supabase.from('study_sessions').delete().eq('user_id', userId),
      supabase.from('task_completions').delete().eq('user_id', userId),
      supabase.from('user_performance').delete().eq('user_id', userId),
      supabase.from('user_learning_paths').delete().eq('user_id', userId),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error clearing user data:', error);
    return { success: false, error };
  }
};
