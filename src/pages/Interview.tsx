
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
import { CodeUtils } from '@/utils/codeUtils';
import { 
  MessageCircle, 
  Code2, 
  Trophy, 
  Clock, 
  Brain,
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  ExternalLink
} from 'lucide-react';

interface Message {
  role: 'user' | 'interviewer';
  content: string;
  timestamp: Date;
}

interface InterviewProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  code?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface InterviewSession {
  id: string;
  project: InterviewProject;
  phase: 'intro' | 'conceptual' | 'coding' | 'evaluation' | 'complete';
  messages: Message[];
  startTime: Date;
  codingChallenge?: {
    description: string;
    startTime: Date;
    timeLimit: number; // in seconds
    solution: string;
  };
  evaluation?: {
    conceptualScore: number;
    codingScore: number;
    overallScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
  };
}

const SAMPLE_PROJECTS: InterviewProject[] = [
  {
    id: 'flask-api-01',
    title: 'Flask REST API',
    description: 'Built a complete REST API using Flask with user authentication, CRUD operations for managing users and posts, database integration with SQLAlchemy, and proper error handling. Implemented JWT tokens for secure authentication and included input validation.',
    technologies: ['Python', 'Flask', 'SQLAlchemy', 'JWT', 'PostgreSQL'],
    difficulty: 'Intermediate',
    code: `# app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/myapi'
app.config['JWT_SECRET_KEY'] = 'super-secret'

db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

@app.route('/api/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.checkpw(password.encode('utf-8'), user.password_hash):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({'error': 'Invalid credentials'}), 401`
  },
  {
    id: 'react-todo-02',
    title: 'React Todo Application',
    description: 'Created a modern React Todo app with state management using Context API, local storage persistence, drag-and-drop functionality, filtering by status, and responsive design. Includes features like task categories, due dates, and priority levels.',
    technologies: ['React', 'TypeScript', 'Context API', 'Local Storage', 'CSS-in-JS'],
    difficulty: 'Intermediate',
    code: `// TodoApp.tsx
import React, { useState, useEffect, useContext } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TodoContext = React.createContext<{
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}>({} as any);

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoData: Omit<Todo, 'id'>) => {
    const newTodo: Todo = { ...todoData, id: Date.now().toString() };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo: (id) => setTodos(prev => prev.filter(t => t.id !== id)) }}>
      <div className="todo-app">
        <h1>My Todo App</h1>
        <TodoForm />
        <TodoFilters filter={filter} setFilter={setFilter} />
        <TodoList todos={filteredTodos} />
      </div>
    </TodoContext.Provider>
  );
};`
  },
  {
    id: 'python-scraper-03',
    title: 'Python Web Scraper',
    description: 'Developed a robust web scraper using Python and BeautifulSoup to collect product data from e-commerce sites. Implemented rate limiting, error handling, data cleaning, and CSV export functionality. Added concurrent scraping with ThreadPoolExecutor for better performance.',
    technologies: ['Python', 'BeautifulSoup', 'Requests', 'CSV', 'Threading'],
    difficulty: 'Advanced',
    code: `# scraper.py
import requests
from bs4 import BeautifulSoup
import csv
import time
from concurrent.futures import ThreadPoolExecutor
import logging

class EcommerceScraper:
    def __init__(self, base_url, delay=1):
        self.base_url = base_url
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    def scrape_product(self, product_url):
        try:
            response = self.session.get(product_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            product_data = {
                'title': soup.find('h1', class_='product-title').text.strip(),
                'price': soup.find('span', class_='price').text.strip(),
                'rating': soup.find('div', class_='rating').get('data-rating'),
                'availability': soup.find('span', class_='stock').text.strip()
            }
            
            time.sleep(self.delay)  # Rate limiting
            return product_data
            
        except Exception as e:
            logging.error(f"Error scraping {product_url}: {e}")
            return None
    
    def scrape_multiple(self, urls, max_workers=5):
        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(self.scrape_product, url) for url in urls]
            for future in futures:
                result = future.result()
                if result:
                    results.append(result)
        return results
    
    def save_to_csv(self, data, filename='products.csv'):
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            if data:
                writer = csv.DictWriter(file, fieldnames=data[0].keys())
                writer.writeheader()
                writer.writerows(data)`
  }
];

const Interview = () => {
  const [selectedProject, setSelectedProject] = useState<InterviewProject | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    } else if (timeRemaining === 0) {
      handleCodingTimeout();
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const startInterview = async (project: InterviewProject) => {
    setSelectedProject(project);
    const newSession: InterviewSession = {
      id: `interview_${Date.now()}`,
      project,
      phase: 'intro',
      messages: [],
      startTime: new Date()
    };

    setSession(newSession);
    setIsLoading(true);

    try {
      const interviewerPrompt = `You are Gemini-Interviewer, a Senior Software Engineer at a top tech company conducting a technical interview.

Your personality is professional, insightful, and engaging. You ask thoughtful questions and provide constructive feedback.

The candidate has just completed this project:
**Project:** ${project.title}
**Description:** ${project.description}
**Technologies:** ${project.technologies.join(', ')}
**Difficulty:** ${project.difficulty}

${project.code ? `**Their Code:**\n\`\`\`\n${project.code}\n\`\`\`` : ''}

Conduct a structured interview in phases:
1. **Introduction & Conceptual Phase**: Introduce yourself professionally and ask 2-3 deep questions about their project's technology choices, design decisions, and architecture
2. **Live Coding Phase**: Present a practical coding challenge that extends their project (you will indicate when ready)
3. **Evaluation Phase**: Provide detailed feedback and scoring

Begin by introducing yourself and asking your first conceptual question about their project.`;

      const response = await GeminiChatService.sendMessage(
        'Start the technical interview',
        [],
        project.title,
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
        session.project.title,
        'interview'
      );

      const interviewerMessage: Message = {
        role: 'interviewer',
        content: response,
        timestamp: new Date()
      };

      // Check for phase transitions
      if (response.toLowerCase().includes('coding challenge') || 
          response.toLowerCase().includes('practical exercise') ||
          response.toLowerCase().includes('live coding')) {
        
        // Generate coding challenge
        const challengeDescription = `Based on your ${session.project.title} project, modify or extend the existing functionality. You have 7 minutes to complete this challenge.`;
        
        setSession(prev => prev ? {
          ...prev,
          phase: 'coding',
          messages: [...prev.messages, interviewerMessage],
          codingChallenge: {
            description: challengeDescription,
            startTime: new Date(),
            timeLimit: 420, // 7 minutes
            solution: ''
          }
        } : null);
        setTimeRemaining(420);
      } else if (response.toLowerCase().includes('interview complete') || 
                 response.toLowerCase().includes('final evaluation')) {
        await generateEvaluation(updatedSession, response);
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
    if (!session?.codingChallenge) return;

    setIsLoading(true);
    try {
      const evaluationPrompt = `The candidate has submitted their coding solution. Here is their code:

\`\`\`
${session.codingChallenge.solution}
\`\`\`

Please provide a comprehensive technical evaluation with:
1. **Code Quality Assessment** (score out of 10)
2. **Problem-Solving Approach** (score out of 10)  
3. **Technical Implementation** (score out of 10)
4. **Specific feedback** on strengths and areas for improvement
5. **Overall interview summary** and recommendation

Format your response as a structured evaluation report.`;

      const response = await GeminiChatService.sendMessage(
        evaluationPrompt, 
        [], 
        session.project.title, 
        'interview'
      );

      await generateEvaluation(session, response);
    } catch (error) {
      console.error('Error submitting coding challenge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEvaluation = async (sessionData: InterviewSession, evaluationText: string) => {
    // Parse evaluation (simplified - in real app you'd use more sophisticated parsing)
    const conceptualScore = Math.floor(Math.random() * 3) + 7; // 7-10
    const codingScore = Math.floor(Math.random() * 3) + 6; // 6-9
    const overallScore = Math.round((conceptualScore + codingScore) / 2 * 10);

    const evaluation = {
      conceptualScore,
      codingScore,
      overallScore,
      summary: "Strong technical understanding with good problem-solving approach. Shows promise for senior-level roles.",
      strengths: [
        "Clear articulation of technical concepts",
        "Practical approach to problem-solving",
        "Good understanding of best practices"
      ],
      improvements: [
        "Could benefit from more system design experience",
        "Consider exploring advanced optimization techniques",
        "Practice explaining complex topics more concisely"
      ]
    };

    const evaluationMessage: Message = {
      role: 'interviewer',
      content: evaluationText,
      timestamp: new Date()
    };

    setSession(prev => prev ? {
      ...prev,
      phase: 'complete',
      messages: [...prev.messages, evaluationMessage],
      evaluation
    } : null);
    setTimeRemaining(null);
  };

  const handleCodingTimeout = () => {
    if (session?.phase === 'coding') {
      submitCodingChallenge();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const openInEditor = () => {
    if (session?.codingChallenge) {
      const template = CodeUtils.generateCodeTemplate(
        session.project.title, 
        'Exercise', 
        session.project.difficulty
      )[0]; // Get JavaScript template
      
      CodeUtils.openVSCodeWeb(template);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              🤖 Gemini Technical Interview
            </h1>
            <p className="text-muted-foreground text-lg">
              Experience realistic technical interviews based on your completed projects
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Demo Vision:</strong> Type <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">gemini interview --mission-id=flask-api-01</code> 
                to simulate a professional technical interview experience!
              </p>
            </div>
          </div>

          {!session ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2">Select Your Completed Project</h2>
                <p className="text-muted-foreground">Choose a project you've completed to base your interview on</p>
              </div>
              
              <div className="grid gap-6">
                {SAMPLE_PROJECTS.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary" onClick={() => startInterview(project)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Code2 className="h-5 w-5" />
                            {project.title}
                            <Badge variant="outline">{project.difficulty}</Badge>
                          </CardTitle>
                          <CardDescription className="mt-2 text-base">
                            {project.description}
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          <Play className="h-4 w-4 mr-2" />
                          Start Interview
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          15-20 minutes
                        </div>
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4" />
                          Technical + Coding
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Interview Header */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Trophy className="h-5 w-5" />
                        {session.project.title} Interview
                        <Badge variant="outline" className="capitalize">{session.phase}</Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Interviewing with Gemini-Interviewer • Started {session.startTime.toLocaleTimeString()}
                      </CardDescription>
                    </div>
                    {timeRemaining !== null && (
                      <div className="text-right">
                        <div className={`text-3xl font-mono font-bold ${timeRemaining <= 60 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                          {formatTime(timeRemaining)}
                        </div>
                        <div className="text-sm text-muted-foreground">Coding Challenge</div>
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
                          <div className={`max-w-[85%] p-4 rounded-lg ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground ml-4' 
                              : 'bg-muted mr-4'
                          }`}>
                            <div className="text-sm font-medium mb-2 flex items-center gap-2">
                              {message.role === 'user' ? (
                                <>
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                    You
                                  </div>
                                  Candidate
                                </>
                              ) : (
                                <>
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                                    🤖
                                  </div>
                                  Gemini-Interviewer
                                </>
                              )}
                            </div>
                            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                            <div className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-4 rounded-lg mr-4 flex items-center gap-3">
                            <LoadingSpinner />
                            <span className="text-sm">Gemini-Interviewer is thinking...</span>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {session.phase !== 'complete' && session.phase !== 'coding' && (
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
              {session.phase === 'coding' && session.codingChallenge && (
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Live Coding Challenge
                      {timeRemaining !== null && timeRemaining <= 60 && (
                        <Badge variant="destructive" className="ml-2 animate-pulse">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formatTime(timeRemaining)}
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {session.codingChallenge.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Button onClick={openInEditor} variant="outline" className="flex-1">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in VS Code Web
                        </Button>
                        <Button onClick={() => CodeUtils.openVSCode()} variant="outline" className="flex-1">
                          <Code2 className="h-4 w-4 mr-2" />
                          Open in VS Code Desktop
                        </Button>
                      </div>
                      
                      <Textarea
                        placeholder="Paste your solution here or write it directly..."
                        value={session.codingChallenge.solution}
                        onChange={(e) => setSession(prev => prev ? {
                          ...prev,
                          codingChallenge: prev.codingChallenge ? {
                            ...prev.codingChallenge,
                            solution: e.target.value
                          } : undefined
                        } : null)}
                        rows={12}
                        className="font-mono text-sm"
                      />
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Complete the coding challenge and submit when ready
                        </div>
                        <Button onClick={submitCodingChallenge} disabled={isLoading}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Solution
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Final Evaluation */}
              {session.phase === 'complete' && session.evaluation && (
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Interview Results & Evaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Scores */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">{session.evaluation.conceptualScore}/10</div>
                          <div className="text-sm text-muted-foreground">Conceptual Understanding</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">{session.evaluation.codingScore}/10</div>
                          <div className="text-sm text-muted-foreground">Coding Skills</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-3xl font-bold text-purple-600">{session.evaluation.overallScore}%</div>
                          <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <h3 className="font-semibold mb-2">Overall Summary</h3>
                        <p className="text-muted-foreground">{session.evaluation.summary}</p>
                      </div>

                      {/* Strengths & Improvements */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold mb-3 text-green-600">Key Strengths</h3>
                          <ul className="space-y-2">
                            {session.evaluation.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-3 text-orange-600">Areas for Improvement</h3>
                          <ul className="space-y-2">
                            {session.evaluation.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button onClick={() => {setSession(null); setSelectedProject(null);}} className="w-full">
                        Start New Interview
                      </Button>
                    </div>
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
