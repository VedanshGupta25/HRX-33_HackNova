
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from '@/pages/Index';
import Tasks from '@/pages/Tasks';
import TaskDetails from '@/pages/TaskDetails';
import Achievements from '@/pages/Achievements';
import Profile from '@/pages/Profile';
import Collaborate from '@/pages/Collaborate';
import HelpSupport from '@/pages/HelpSupport';
import ChatSupport from '@/pages/ChatSupport';
import Interview from '@/pages/Interview';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/task/:taskType/:taskId" element={<TaskDetails />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/collaborate" element={<Collaborate />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/chat" element={<ChatSupport />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
