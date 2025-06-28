
import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GeminiChatService } from '@/utils/geminiChatApi';
import { 
  MessageCircle, 
  Code2, 
  Trophy, 
  Clock, 
  Brain,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'interviewer';
  content: string;
  timestamp: Date;
}

interface InterviewSession {
  id: string;
  projectTitle: string;
  projectDescription: string;
  phase: 'setup' | 'conceptual' | 'coding' | 'evaluation' | 'complete';
  messages: Message[];
  startTime: Date;
  score?: {
    conceptual: number;
    coding: number;
    overall: number;
  };
}

const Interview = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codingChallenge, setCodingChallenge] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const startInterview = async (projectType: string) => {
    const projectDescriptions = {
      'flask-api': 'Built a REST API using Flask with user authentication, CRUD operations, and database integration',
      'react-todo': 'Created a React Todo application with state management, local storage, and responsive design',
      'python-scraper': 'Developed a web scraper using Python and BeautifulSoup to collect and analyze data',
      'node-chat': 'Built a real-time chat application using Node.js, Socket.io, and Express'
    };

    const newSession: InterviewSession = {
      id: `interview_${Date.now()}`,
      projectTitle: projectType.replace('-', ' ').toUpperCase(),
      projectDescription: projectDescriptions[projectType as keyof typeof projectDescriptions] || 'Completed a coding project',
      phase: 'setup',
      messages: [],
      startTime: new Date()
    };

    setSession(newSession);
    setIsLoading(true);

    try {
      const systemPrompt = `You are Gemini-Interviewer, a Senior Software Engineer conducting a technical interview. 
      
Your personality is professional, insightful, and engaging. You ask thoughtful questions and provide constructive feedback.

The candidate has just completed: ${newSession.projectDescription}

Conduct a structured interview in phases:
1. **Conceptual Phase**: Ask 2-3 deep questions about their project's technology choices and design decisions
2. **Live Coding Phase**: Present a practical coding challenge that extends their project
3. **Evaluation Phase**: Provide detailed feedback and scoring

Begin by introducing yourself professionally and asking your first conceptual question about their project.`;

      const response = await GeminiChatService.sendMessage(
        `Start the technical interview for the project: ${newSession.projectDescription}`,
        [],
        undefined,
        'interview'
      );

      const interviewerMessage: Message = {
        role: 'interviewer',
        content: response,
        timestamp: new Date()
      };

      setSession(prev => prev ? {
        ...prev,
        phase: 'conceptual',
        messages: [interviewerMessage]
      } : null);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentInput.trim() || !session || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    const updatedSession = {
      ...session,
      messages: [...session.messages, userMessage]
    };
    setSession(updatedSession);
    setCurrentInput('');
    setIsLoading(true);

    try {
      const conversationHistory = updatedSession.messages.map(msg => ({
        role: msg.role === 'interviewer' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await GeminiChatService.sendMessage(
        currentInput,
        conversationHistory,
        undefined,
        'interview'
      );

      const interviewerMessage: Message = {
        role: 'interviewer',
        content: response,
        timestamp: new Date()
      };

      // Check if moving to coding phase
      if (response.toLowerCase().includes('coding challenge') || 
          response.toLowerCase().includes('practical exercise')) {
        setSession(prev => prev ? {
          ...prev,
          phase: 'coding',
          messages: [...prev.messages, interviewerMessage]
        } : null);
        setTimeRemaining(420); // 7 minutes
        setCodingChallenge('# Write your solution here\n# You have 7 minutes to complete this challenge\n\n');
      } else if (response.toLowerCase().includes('interview complete') || 
                 response.toLowerCase().includes('final evaluation')) {
        setSession(prev => prev ? {
          ...prev,
          phase: 'evaluation',
          messages: [...prev.messages, interviewerMessage]
        } : null);
      } else {
        setSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, interviewerMessage]
        } : null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCodingChallenge = async () => {
    if (!codingChallenge.trim() || !session) return;

    setIsLoading(true);
    try {
      const evaluationPrompt = `The candidate has submitted their coding solution. Here is their code:

${codingChallenge}

Please provide a detailed evaluation with:
1. Code quality assessment (score out of 10)
2. Problem-solving approach (score out of 10)  
3. Specific feedback on strengths and areas for improvement
4. Overall interview summary and recommendation

Format your response as a structured evaluation report.`;

      const response = await GeminiChatService.sendMessage(evaluationPrompt, [], undefined, 'interview');

      const evaluationMessage: Message = {
        role: 'interviewer',
        content: response,
        timestamp: new Date()
      };

      setSession(prev => prev ? {
        ...prev,
        phase: 'complete',
        messages: [...prev.messages, evaluationMessage],
        score: {
          conceptual: 8,
          coding: 7,
          overall: 75
        }
      } : null);
      setTimeRemaining(null);
    } catch (error) {
      console.error('Error submitting coding challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              🤖 AI Technical Interview
            </h1>
            <p className="text-muted-foreground text-lg">
              Practice technical interviews with our AI interviewer based on your completed projects
            </p>
          </div>

          {!session ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startInterview('flask-api')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    Flask REST API
                  </CardTitle>
                  <CardDescription>
                    Interview based on your Flask API project with authentication and CRUD operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    15-20 minutes
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startInterview('react-todo')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    React Todo App
                  </CardTitle>
                  <CardDescription>
                    Interview focused on React concepts, state management, and frontend architecture
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    15-20 minutes
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startInterview('python-scraper')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Python Web Scraper
                  </CardTitle>
                  <CardDescription>
                    Technical discussion about web scraping, data processing, and Python best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    15-20 minutes
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startInterview('node-chat')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Node.js Chat App
                  </CardTitle>
                  <CardDescription>
                    Real-time applications, WebSockets, and Node.js backend development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    15-20 minutes
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Interview Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        {session.projectTitle} Interview
                      </CardTitle>
                      <CardDescription>
                        Phase: <Badge variant="outline">{session.phase}</Badge>
                      </CardDescription>
                    </div>
                    {timeRemaining !== null && (
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-destructive">
                          {formatTime(timeRemaining)}
                        </div>
                        <div className="text-sm text-muted-foreground">Time Remaining</div>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Chat Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Interview Conversation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96 w-full pr-4">
                    <div className="space-y-4">
                      {session.messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground ml-4' 
                              : 'bg-muted mr-4'
                          }`}>
                            <div className="text-sm font-medium mb-1">
                              {message.role === 'user' ? 'You' : '🤖 Gemini-Interviewer'}
                            </div>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            <div className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-3 rounded-lg mr-4">
                            <LoadingSpinner />
                            <span className="ml-2 text-sm">Interviewer is thinking...</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {session.phase !== 'complete' && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your response..."
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                          rows={3}
                        />
                        <Button onClick={sendMessage} disabled={isLoading || !currentInput.trim()}>
                          Send
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Coding Challenge */}
              {session.phase === 'coding' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Live Coding Challenge
                      {timeRemaining !== null && timeRemaining <= 60 && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formatTime(timeRemaining)}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write your code solution here..."
                      value={codingChallenge}
                      onChange={(e) => setCodingChallenge(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Complete the coding challenge and submit when ready
                      </div>
                      <Button onClick={submitCodingChallenge} disabled={isLoading}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Solution
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Final Results */}
              {session.phase === 'complete' && session.score && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Interview Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{session.score.conceptual}/10</div>
                        <div className="text-sm text-muted-foreground">Conceptual Understanding</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{session.score.coding}/10</div>
                        <div className="text-sm text-muted-foreground">Coding Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{session.score.overall}%</div>
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                      </div>
                    </div>
                    <Button onClick={() => setSession(null)} className="w-full">
                      Start New Interview
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
