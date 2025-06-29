
-- Create table for tracking user study sessions
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'study', -- 'study' or 'break'
  duration_minutes INTEGER NOT NULL,
  subject TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  focus_score INTEGER DEFAULT 100, -- percentage score
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tracking task completion
CREATE TABLE public.task_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_title TEXT NOT NULL,
  task_type TEXT NOT NULL, -- 'reading', 'exercise', 'project'
  difficulty TEXT NOT NULL, -- 'beginner', 'intermediate', 'advanced'
  subject TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completion_time_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user performance metrics
CREATE TABLE public.user_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  week_start_date DATE NOT NULL,
  total_study_hours DECIMAL(5,2) DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  average_focus_score DECIMAL(5,2) DEFAULT 0,
  subjects_studied TEXT[] DEFAULT '{}',
  streak_days INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start_date)
);

-- Create table for learning paths and progress
CREATE TABLE public.user_learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  path_name TEXT NOT NULL,
  total_steps INTEGER NOT NULL DEFAULT 0,
  completed_steps INTEGER NOT NULL DEFAULT 0,
  current_step INTEGER NOT NULL DEFAULT 1,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_paths ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for study_sessions
CREATE POLICY "Users can view their own study sessions" 
  ON public.study_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions" 
  ON public.study_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" 
  ON public.study_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for task_completions
CREATE POLICY "Users can view their own task completions" 
  ON public.task_completions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task completions" 
  ON public.task_completions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_performance
CREATE POLICY "Users can view their own performance" 
  ON public.user_performance 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance" 
  ON public.user_performance 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_learning_paths
CREATE POLICY "Users can view their own learning paths" 
  ON public.user_learning_paths 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own learning paths" 
  ON public.user_learning_paths 
  FOR ALL 
  USING (auth.uid() = user_id);
