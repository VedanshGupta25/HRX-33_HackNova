
import React, { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'hint' | 'solution' | 'explanation' | 'alternative' | 'general';
}

interface MissionPath {
  id: string;
  title: string;
  description: string;
  steps: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  prerequisites: string[];
  outcomes: string[];
}

const ChatSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Learning Assistant. I\'m here to help you with concepts, solve problems, provide hints, and guide you through your learning journey. What would you like to learn about today?',
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [missionPaths, setMissionPaths] = useState<MissionPath[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const generateMissionPath = (topic: string): MissionPath => {
    const paths = {
      'web development': {
        id: 'web-dev',
        title: 'Full-Stack Web Developer',
        description: 'Master modern web development from frontend to backend',
        steps: [
          'HTML & CSS Fundamentals',
          'JavaScript ES6+ Mastery',
          'React.js Development',
          'Node.js & Express',
          'Database Design (MongoDB/PostgreSQL)',
          'API Development & Integration',
          'Deployment & DevOps',
          'Advanced Topics & Frameworks'
        ],
        difficulty: 'Intermediate' as const,
        estimatedTime: '6-8 months',
        prerequisites: ['Basic computer skills', 'Problem-solving mindset'],
        outcomes: ['Build full-stack applications', 'Deploy to production', 'Work with databases', 'Create APIs']
      },
      'react': {
        id: 'react-path',
        title: 'React.js Specialist',
        description: 'Become proficient in React ecosystem and modern frontend development',
        steps: [
          'JavaScript Fundamentals Review',
          'React Components & JSX',
          'State Management & Hooks',
          'React Router & Navigation',
          'API Integration & Async Operations',
          'State Management (Redux/Zustand)',
          'Testing React Applications',
          'Performance Optimization',
          'Advanced Patterns & Best Practices'
        ],
        difficulty: 'Intermediate' as const,
        estimatedTime: '3-4 months',
        prerequisites: ['JavaScript ES6+', 'HTML/CSS', 'Basic programming concepts'],
        outcomes: ['Build complex SPAs', 'Manage application state', 'Implement routing', 'Write testable code']
      },
      'machine learning': {
        id: 'ml-path',
        title: 'Machine Learning Engineer',
        description: 'Learn ML from basics to advanced implementations',
        steps: [
          'Mathematics Foundation (Linear Algebra, Statistics)',
          'Python Programming for Data Science',
          'Data Manipulation with Pandas/NumPy',
          'Supervised Learning Algorithms',
          'Unsupervised Learning & Clustering',
          'Deep Learning with TensorFlow/PyTorch',
          'Computer Vision & NLP Basics',
          'Model Deployment & MLOps',
          'Advanced ML Topics & Research'
        ],
        difficulty: 'Advanced' as const,
        estimatedTime: '8-12 months',
        prerequisites: ['Strong math background', 'Programming experience', 'Statistics knowledge'],
        outcomes: ['Build ML models', 'Deploy ML solutions', 'Work with neural networks', 'Handle real-world data']
      }
    };

    const defaultPath: MissionPath = {
      id: 'custom-path',
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Learning Path`,
      description: `Comprehensive learning journey for ${topic}`,
      steps: [
        `${topic} Fundamentals`,
        `Core Concepts & Theory`,
        `Hands-on Practice`,
        `Real-world Applications`,
        `Advanced Techniques`,
        `Best Practices & Optimization`,
        `Project Development`,
        `Professional Application`
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '4-6 months',
      prerequisites: ['Basic understanding of related concepts'],
      outcomes: [`Master ${topic} concepts`, `Apply knowledge practically`, `Build projects`]
    };

    return paths[topic.toLowerCase() as keyof typeof paths] || defaultPath;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!apiKey && showApiInput) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to use the chat feature.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check if user is asking for a learning path
    const lowerInput = inputMessage.toLowerCase();
    if (lowerInput.includes('learning path') || lowerInput.includes('roadmap') || lowerInput.includes('mission map')) {
      const topic = lowerInput.replace(/.*(?:learning path|roadmap|mission map).*?(?:for|about|in)?\s*/, '').trim();
      if (topic) {
        const missionPath = generateMissionPath(topic);
        setMissionPaths(prev => [...prev, missionPath]);
      }
    }

    try {
      // Simulate API call with educational responses
      const responses = {
        hint: [
          "Here's a helpful hint: Break down the problem into smaller, manageable parts. Start with the most basic version and gradually add complexity.",
          "💡 Tip: Try working backwards from your desired outcome. What's the last step you need? What comes before that?",
          "Think about this step by step:\n1. Identify what you know\n2. Identify what you need to find\n3. Connect the dots between them",
        ],
        solution: [
          "Here's a step-by-step solution approach:\n\n1. **Analyze the Problem**: Understand what you're trying to solve\n2. **Plan Your Approach**: Outline the steps needed\n3. **Implement**: Write the code/solution incrementally\n4. **Test**: Verify your solution works correctly\n5. **Optimize**: Improve efficiency if needed",
          "Let me walk you through this solution:\n\n```\n// Start with the basic structure\n// Add functionality step by step\n// Test each part as you build\n// Refactor for clarity\n```\n\nWould you like me to elaborate on any specific step?",
        ],
        explanation: [
          "Let me explain this concept clearly:\n\nThink of it like building a house 🏠. You need:\n- Foundation (basic concepts)\n- Framework (core principles)\n- Walls (main functionality)\n- Roof (final implementation)\n\nEach layer builds upon the previous one.",
          "This works because of a fundamental principle: **separation of concerns**. By breaking complex problems into smaller, focused pieces, we can:\n- Understand each part better\n- Debug more easily\n- Reuse components\n- Scale our solution",
        ],
        alternative: [
          "Here are 3 alternative approaches you could try:\n\n**Approach 1: Iterative Method**\n- Start simple, improve gradually\n- Good for: Learning and experimentation\n\n**Approach 2: Framework-Based**\n- Use existing tools and libraries\n- Good for: Rapid development\n\n**Approach 3: Custom Solution**\n- Build from scratch\n- Good for: Deep understanding and control",
          "Consider these different strategies:\n\n🎯 **Quick Win**: Use proven patterns and templates\n🔬 **Deep Dive**: Research and implement custom logic\n⚖️ **Balanced**: Combine existing tools with custom solutions\n\nWhich approach aligns best with your goals?",
        ],
        general: [
          "I'm here to help you learn! Whether you need:\n- 💡 Hints to guide your thinking\n- 🔧 Solutions to specific problems\n- 📚 Explanations of concepts\n- 🌟 Alternative approaches\n\nJust tell me what you're working on, and I'll provide targeted assistance.",
          "Great question! Learning is most effective when it's:\n- **Interactive**: Ask questions and experiment\n- **Incremental**: Build knowledge step by step\n- **Applied**: Use concepts in real projects\n- **Reflective**: Think about what you've learned\n\nWhat aspect would you like to explore?",
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const category = detectMessageCategory(inputMessage);
      const categoryResponses = responses[category] || responses.general;
      const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        category
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Response Generated! 🤖",
        description: "AI assistant has provided a helpful response.",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. In the meantime, here are some general tips:\n\n1. Break down complex problems into smaller parts\n2. Research similar examples online\n3. Try different approaches\n4. Don't hesitate to ask for help\n\nPlease try again in a moment!",
        timestamp: new Date(),
        category: 'general'
      };

      setMessages(prev => [...prev, errorMessage]);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Bot className="h-12 w-12 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800">AI Learning Assistant</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Powered by Advanced AI • Real-time Help</span>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant help with concepts, solutions, hints, and personalized learning paths. 
              Your AI tutor is available 24/7 to guide your learning journey.
            </p>
          </div>

          {/* API Key Input (if needed) */}
          {showApiInput && (
            <Card className="mb-6 bg-yellow-50 border-yellow-200 animate-scale-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 mb-2">
                      To use the AI chat feature, please enter your OpenAI API key:
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-white"
                      />
                      <Button 
                        onClick={() => setShowApiInput(false)}
                        disabled={!apiKey}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Category Filter Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
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
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full justify-start transition-all duration-200 ${
                            selectedCategory === category.id 
                              ? `${category.color} text-white hover:opacity-90` 
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {category.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Mission Paths */}
              {missionPaths.length > 0 && (
                <Card className="mt-4 bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      Learning Paths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {missionPaths.map((path, index) => (
                        <div key={path.id} className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg animate-scale-in" style={{ animationDelay: `${index * 200}ms` }}>
                          <h4 className="font-semibold text-gray-800 mb-1">{path.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{path.description}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{path.difficulty}</Badge>
                            <Badge variant="outline" className="text-xs">{path.estimatedTime}</Badge>
                          </div>
                          <div className="text-xs text-gray-700">
                            <strong>Next Steps:</strong>
                            <ul className="list-disc list-inside mt-1">
                              {path.steps.slice(0, 3).map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
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
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl h-[600px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Learning Chat
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-normal opacity-90">Online</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {filteredMessages.map((message, index) => {
                      const Icon = message.type === 'user' ? User : Bot;
                      const CategoryIcon = getCategoryIcon(message.category || 'general');
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 animate-fade-in ${
                            message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className={`max-w-[80%] ${
                            message.type === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            <div className={`inline-block p-3 rounded-2xl shadow-lg ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                            }`}>
                              {message.type === 'assistant' && message.category && message.category !== 'general' && (
                                <div className="flex items-center gap-1 mb-2 pb-2 border-b border-gray-200">
                                  <CategoryIcon className="h-3 w-3" />
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                    {message.category}
                                  </span>
                                </div>
                              )}
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                              </div>
                            </div>
                            <div className={`text-xs text-gray-500 mt-1 ${
                              message.type === 'user' ? 'text-right' : 'text-left'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {isLoading && (
                      <div className="flex gap-3 animate-fade-in">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-3 shadow-lg">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4 bg-gray-50 rounded-b-lg">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your learning topic... (e.g., 'Can you explain React hooks?' or 'I need a hint for this problem')"
                      className="flex-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 transition-all transform hover:scale-105"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[
                      { label: '💡 Need a hint', action: 'Can you give me a hint about' },
                      { label: '🔧 Show solution', action: 'Can you show me the solution for' },
                      { label: '📚 Explain concept', action: 'Can you explain' },
                      { label: '🗺️ Learning roadmap', action: 'Can you create a learning roadmap for' }
                    ].map((quickAction, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(quickAction.action + ' ')}
                        className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all"
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
