
import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Code, 
  BookOpen, 
  MessageCircle,
  Sparkles,
  Brain,
  Zap,
  HelpCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Map,
  Sun,
  Moon,
  Monitor,
  Menu,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GeminiChatService, type ChatMessage } from '@/utils/geminiChatApi';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'hint' | 'solution' | 'explanation' | 'alternative' | 'general';
  isLoading?: boolean;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  steps: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  outcomes: string[];
  resources?: Array<{
    title: string;
    type: string;
    url?: string;
    description: string;
  }>;
}

const ChatSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Learning Assistant powered by Gemini. I\'m here to help you with concepts, solve problems, provide hints, and guide you through your learning journey. What would you like to learn about today?',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showGuide, setShowGuide] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<'light' | 'dark' | 'system'>('system');

  const categories = [
    { id: 'all', label: 'All Topics', icon: MessageCircle, color: 'bg-blue-500' },
    { id: 'hint', label: 'Hints', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'solution', label: 'Solutions', icon: CheckCircle, color: 'bg-green-500' },
    { id: 'explanation', label: 'Explanations', icon: BookOpen, color: 'bg-purple-500' },
    { id: 'alternative', label: 'Alternatives', icon: Zap, color: 'bg-orange-500' },
    { id: 'general', label: 'General Help', icon: HelpCircle, color: 'bg-gray-500' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectMessageCategory = (content: string): Message['category'] => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('hint') || lowerContent.includes('clue') || lowerContent.includes('tip')) {
      return 'hint';
    } else if (lowerContent.includes('solution') || lowerContent.includes('answer') || lowerContent.includes('solve')) {
      return 'solution';
    } else if (lowerContent.includes('explain') || lowerContent.includes('what is') || lowerContent.includes('how does')) {
      return 'explanation';
    } else if (lowerContent.includes('alternative') || lowerContent.includes('different') || lowerContent.includes('other way')) {
      return 'alternative';
    }
    return 'general';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Detect if user is asking for a learning path
    const lowerInput = inputMessage.toLowerCase();
    const isLearningPathRequest = lowerInput.includes('learning path') || 
                                 lowerInput.includes('roadmap') || 
                                 lowerInput.includes('mission map') ||
                                 lowerInput.includes('study plan');

    try {
      let response: string;
      const category = detectMessageCategory(inputMessage);
      
      if (isLearningPathRequest) {
        const topic = inputMessage.replace(/.*(?:learning path|roadmap|mission map|study plan).*?(?:for|about|in)?\s*/, '').trim();
        if (topic) {
          const learningPath = await GeminiChatService.generateLearningPath(topic);
          setLearningPaths(prev => [...prev, learningPath]);
          setCurrentTopic(topic);
          
          response = `I've created a comprehensive learning path for "${topic}"! You can see it in the Learning Paths section on the left. The path includes ${learningPath.steps.length} steps and is estimated to take ${learningPath.estimatedTime}. 

Here's a quick overview:
${learningPath.steps.slice(0, 3).map((step, i) => `${i + 1}. ${step}`).join('\n')}

Would you like me to explain any specific step or help you get started with the first one?`;
        } else {
          response = "I'd be happy to create a learning path for you! Please specify what topic you'd like to learn. For example: 'Create a learning path for React' or 'I need a roadmap for web development'.";
        }
      } else {
        // Extract topic from conversation for context
        const topicMatch = inputMessage.match(/(?:about|for|with|regarding)\s+([a-zA-Z0-9\s]+)/i);
        const detectedTopic = topicMatch ? topicMatch[1].trim() : currentTopic;
        
        response = await GeminiChatService.sendMessage(
          inputMessage, 
          conversationHistory,
          detectedTopic,
          category
        );
        
        if (detectedTopic && !currentTopic) {
          setCurrentTopic(detectedTopic);
        }
      }

      // Update conversation history
      const newUserMessage: ChatMessage = {
        role: 'user',
        parts: [{ text: inputMessage }]
      };
      
      const newAssistantMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: response }]
      };
      
      setConversationHistory(prev => [...prev, newUserMessage, newAssistantMessage]);

      // Remove loading message and add real response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response,
          timestamp: new Date(),
          category
        }];
      });
      
      toast({
        title: "Response Generated! 🤖",
        description: "AI assistant provided a helpful response.",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove loading message and add error response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "I apologize, but I'm having trouble connecting right now. Here are some general tips:\n\n1. Break down complex problems into smaller parts\n2. Research similar examples online\n3. Try different approaches\n4. Don't hesitate to ask for help\n\nPlease try again in a moment!",
          timestamp: new Date(),
          category: 'general'
        }];
      });
      
      toast({
        title: "Connection Error",
        description: "Using offline mode with general guidance.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : MessageCircle;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const filteredMessages = selectedCategory === 'all' 
    ? messages 
    : messages.filter(msg => msg.category === selectedCategory || msg.type === 'user');

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: 'Hello! I\'m your AI Learning Assistant powered by Gemini. I\'m here to help you with concepts, solve problems, provide hints, and guide you through your learning journey. What would you like to learn about today?',
        timestamp: new Date(),
        category: 'general'
      }
    ]);
    setConversationHistory([]);
    setCurrentTopic('');
    toast({
      title: "Conversation Cleared",
      description: "Starting fresh with a new conversation.",
    });
  };

  const guideSteps = [
    {
      title: "Getting Started",
      description: "Welcome to your AI Learning Assistant! Here's how to get the most out of our chat support:",
      steps: [
        "Type your question or concept in the message box below",
        "Use specific keywords like 'hint', 'solution', 'explain' to get targeted help",
        "Ask for learning paths with phrases like 'roadmap for React' or 'learning path for Python'"
      ]
    },
    {
      title: "Quick Actions",
      description: "Use these quick action buttons for faster interaction:",
      steps: [
        "💡 Need a hint - Get subtle guidance without full answers",
        "🔧 Show solution - Get complete step-by-step solutions",
        "📚 Explain concept - Get detailed explanations with examples",
        "🗺️ Learning roadmap - Generate personalized learning paths"
      ]
    },
    {
      title: "Advanced Features",
      description: "Maximize your learning experience:",
      steps: [
        "Set a current topic to get contextual responses",
        "Use the category filters to focus on specific types of help",
        "Generated learning paths appear in the sidebar with detailed steps",
        "All conversations are contextual - the AI remembers your discussion"
      ]
    },
    {
      title: "Best Practices",
      description: "Tips for effective learning:",
      steps: [
        "Be specific about what you're struggling with",
        "Ask follow-up questions to deepen understanding",
        "Request examples and real-world applications",
        "Use the clear conversation button to start fresh topics"
      ]
    }
  ];

  const applyDarkMode = (mode: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (mode === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemPrefersDark);
    } else {
      root.classList.toggle('dark', mode === 'dark');
    }
  };

  const toggleDarkMode = () => {
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(darkMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setDarkMode(nextMode);
    localStorage.setItem('darkMode', nextMode);
    applyDarkMode(nextMode);
  };

  const getDarkModeIcon = () => {
    switch (darkMode) {
      case 'light': return Sun;
      case 'dark': return Moon;
      case 'system': return Monitor;
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') as 'light' | 'dark' | 'system' || 'system';
    setDarkMode(savedMode);
    applyDarkMode(savedMode);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Bot className="h-8 w-8 sm:h-12 sm:w-12 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">AI Learning Assistant</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Powered by Gemini AI • Real-time Help</span>
                </div>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2">
              Get instant help with concepts, solutions, hints, and personalized learning paths. 
              Your AI tutor is available 24/7 to guide your learning journey.
            </p>
            {currentTopic && (
              <div className="mt-4">
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2">
                  Current Topic: {currentTopic}
                </Badge>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            <Button
              onClick={() => setShowGuide(!showGuide)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transform hover:scale-105 transition-all duration-300"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Step-by-Step Guide</span>
              <span className="sm:hidden">Guide</span>
            </Button>
            
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="sm"
              className="hover:scale-105 transition-all duration-300 dark:border-gray-600 dark:text-gray-200"
            >
              {React.createElement(getDarkModeIcon(), { className: "h-4 w-4 mr-2" })}
              <span className="hidden sm:inline">
                {darkMode === 'light' ? 'Light' : darkMode === 'dark' ? 'Dark' : 'System'}
              </span>
              <span className="sm:hidden">
                {darkMode === 'light' ? 'L' : darkMode === 'dark' ? 'D' : 'S'}
              </span>
            </Button>

            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="outline"
              size="sm"
              className="lg:hidden hover:scale-105 transition-all duration-300 dark:border-gray-600 dark:text-gray-200"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Guide Modal */}
          {showGuide && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-2xl animate-scale-in">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-6 w-6" />
                      Step-by-Step Learning Guide
                    </CardTitle>
                    <Button
                      onClick={() => setShowGuide(false)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {guideSteps.map((section, index) => (
                    <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-blue-200 dark:border-gray-600">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          {section.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{section.description}</p>
                        <ul className="space-y-3">
                          {section.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-3 text-gray-700 dark:text-gray-200">
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border border-green-200 dark:border-gray-600 animate-slide-up" style={{ animationDelay: '800ms' }}>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <Sparkles className="h-6 w-6" />
                      Pro Tips
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Use voice commands for hands-free interaction</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Learning paths adapt to your progress</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">AI remembers context within conversations</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Dark mode for comfortable night learning</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Category Filter Sidebar */}
            <div className={`lg:col-span-1 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "ghost"}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full justify-start transition-all duration-300 text-sm ${
                            selectedCategory === category.id 
                              ? `${category.color} text-white hover:opacity-90 transform scale-105` 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:transform hover:scale-105 dark:text-gray-200'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline lg:inline">{category.label}</span>
                          <span className="sm:hidden lg:hidden">{category.label.split(' ')[0]}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Paths */}
              {learningPaths.length > 0 && (
                <Card className="mt-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                      <Map className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Learning Paths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {learningPaths.map((path, index) => (
                        <div key={path.id} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg animate-scale-in border border-blue-200 dark:border-gray-600 transition-all duration-300 hover:scale-105" style={{ animationDelay: `${index * 200}ms` }}>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 text-sm">{path.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">{path.description}</p>
                          <div className="flex flex-wrap items-center gap-1 mb-3">
                            <Badge variant="outline" className="text-xs dark:border-gray-500 dark:text-gray-300">{path.difficulty}</Badge>
                            <Badge variant="outline" className="text-xs dark:border-gray-500 dark:text-gray-300">{path.estimatedTime}</Badge>
                          </div>
                          <div className="text-xs text-gray-700 dark:text-gray-300">
                            <strong>Next Steps:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {path.steps.slice(0, 3).map((step, i) => (
                                <li key={i} className="text-xs">{step}</li>
                              ))}
                              {path.steps.length > 3 && (
                                <li className="text-xs text-blue-600 dark:text-blue-400 font-medium">+{path.steps.length - 3} more steps...</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl h-[70vh] sm:h-[600px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    Learning Chat
                    <div className="ml-auto flex items-center gap-2 sm:gap-3">
                      <Button
                        onClick={clearConversation}
                        variant="outline"
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/20 transition-all duration-300 text-xs sm:text-sm"
                      >
                        <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Clear</span>
                      </Button>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-normal opacity-90">Online</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-2 sm:p-4">
                  <div className="space-y-3 sm:space-y-4">
                    {filteredMessages.map((message, index) => {
                      const Icon = message.type === 'user' ? User : Bot;
                      const CategoryIcon = getCategoryIcon(message.category || 'general');
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex gap-2 sm:gap-3 animate-fade-in ${
                            message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          }`}>
                            <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                          
                          <div className={`max-w-[85%] sm:max-w-[80%] ${
                            message.type === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            <div className={`inline-block p-3 sm:p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                            }`}>
                              {message.type === 'assistant' && message.category && message.category !== 'general' && (
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600">
                                  <CategoryIcon className="h-4 w-4" />
                                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                    {message.category}
                                  </span>
                                </div>
                              )}
                              {message.isLoading ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span className="text-sm">Thinking...</span>
                                </div>
                              ) : (
                                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">
                                  {message.content}
                                </div>
                              )}
                            </div>
                            <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                              message.type === 'user' ? 'text-right' : 'text-left'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your learning topic..."
                      className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 text-sm dark:text-gray-100 dark:placeholder-gray-400"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-4 sm:px-6 transition-all transform hover:scale-105 duration-300"
                      size="sm"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-1 sm:gap-2 mt-3 flex-wrap">
                    {[
                      { label: '💡 Hint', action: 'Can you give me a hint about ' },
                      { label: '🔧 Solution', action: 'Can you show me the solution for ' },
                      { label: '📚 Explain', action: 'Can you explain ' },
                      { label: '🗺️ Roadmap', action: 'Create a learning path for ' }
                    ].map((quickAction, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(quickAction.action)}
                        className="text-xs hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:border-gray-600 dark:text-gray-200 transition-all duration-300 hover:scale-105"
                        disabled={isLoading}
                      >
                        {quickAction.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatSupport;
