
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
  Map
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
                  <span className="text-sm text-gray-600">Powered by Gemini AI • Real-time Help</span>
                </div>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant help with concepts, solutions, hints, and personalized learning paths. 
              Your AI tutor is available 24/7 to guide your learning journey.
            </p>
            {currentTopic && (
              <div className="mt-4">
                <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                  Current Topic: {currentTopic}
                </Badge>
              </div>
            )}
          </div>

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
                          className={`w-full justify-start transition-all duration-300 ${
                            selectedCategory === category.id 
                              ? `${category.color} text-white hover:opacity-90 transform scale-105` 
                              : 'hover:bg-gray-100 hover:transform hover:scale-105'
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

              {/* Learning Paths */}
              {learningPaths.length > 0 && (
                <Card className="mt-4 bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-orange-600" />
                      Learning Paths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {learningPaths.map((path, index) => (
                        <div key={path.id} className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg animate-scale-in border border-blue-200" style={{ animationDelay: `${index * 200}ms` }}>
                          <h4 className="font-semibold text-gray-800 mb-2">{path.title}</h4>
                          <p className="text-xs text-gray-600 mb-3">{path.description}</p>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">{path.difficulty}</Badge>
                            <Badge variant="outline" className="text-xs">{path.estimatedTime}</Badge>
                          </div>
                          <div className="text-xs text-gray-700">
                            <strong>Next Steps:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {path.steps.slice(0, 3).map((step, i) => (
                                <li key={i} className="text-xs">{step}</li>
                              ))}
                              {path.steps.length > 3 && (
                                <li className="text-xs text-blue-600 font-medium">+{path.steps.length - 3} more steps...</li>
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
              <Card className="bg-white/90 backdrop-blur-sm shadow-2xl h-[600px] flex flex-col">
                <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Learning Chat
                    <div className="ml-auto flex items-center gap-3">
                      <Button
                        onClick={clearConversation}
                        variant="outline"
                        size="sm"
                        className="text-white border-white/30 hover:bg-white/20 transition-all duration-300"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-normal opacity-90">Online</span>
                      </div>
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
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className={`max-w-[80%] ${
                            message.type === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            <div className={`inline-block p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                            }`}>
                              {message.type === 'assistant' && message.category && message.category !== 'general' && (
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                  <CategoryIcon className="h-4 w-4" />
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
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
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {message.content}
                                </div>
                              )}
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
                      className="flex-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 transition-all transform hover:scale-105 duration-300"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[
                      { label: '💡 Need a hint', action: 'Can you give me a hint about ' },
                      { label: '🔧 Show solution', action: 'Can you show me the solution for ' },
                      { label: '📚 Explain concept', action: 'Can you explain ' },
                      { label: '🗺️ Learning roadmap', action: 'Create a learning path for ' }
                    ].map((quickAction, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInputMessage(quickAction.action)}
                        className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105"
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
