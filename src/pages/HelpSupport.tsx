
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  User, 
  MessageSquare, 
  Star, 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  Target,
  Zap,
  Brain
} from 'lucide-react';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const quickStartSteps = [
    {
      icon: User,
      title: "Set Up Your Profile",
      description: "Add your background, interests, and skill level for personalized recommendations."
    },
    {
      icon: MessageSquare,
      title: "Enter a Concept",
      description: "Type in a topic you're learning or paste a lecture transcript."
    },
    {
      icon: Star,
      title: "Generate Projects",
      description: "Get AI-powered project suggestions tailored to your learning goals."
    },
    {
      icon: BookOpen,
      title: "Start Building",
      description: "Use templates and hints to bring your chosen project to life."
    }
  ];

  const platformFeatures = [
    "AI-powered project generation based on learning concepts",
    "Personalized recommendations using your profile data",
    "Multi-domain projects: coding, hardware, design, research",
    "Difficulty-based filtering and complexity indicators",
    "Project templates and guided learning hints",
    "Community rating system for continuous improvement"
  ];

  const faqs = [
    {
      id: "ai-generator",
      question: "How does the AI project generator work?",
      answer: "Our AI analyzes your input concept or transcript, considers your skill level and interests, then generates personalized learning tasks including reading materials, practical exercises, and hands-on projects. The system uses advanced natural language processing to understand context and create relevant, engaging content."
    },
    {
      id: "project-types", 
      question: "What types of projects can be generated?",
      answer: "The platform can generate projects across multiple domains including web development, mobile apps, data science, machine learning, IoT, robotics, UI/UX design, cybersecurity, electronics, and research projects. Each project is tailored to your experience level and interests."
    },
    {
      id: "improve-quality",
      question: "How do I improve the quality of project suggestions?",
      answer: "To get better suggestions: 1) Complete your profile with detailed background information, 2) Be specific when entering concepts, 3) Rate generated projects to help our AI learn your preferences, 4) Update your skill level as you progress, and 5) Add relevant interests and goals to your profile."
    },
    {
      id: "customize-difficulty",
      question: "Can I customize the difficulty level of projects?",
      answer: "Yes! You can set your experience level (Beginner, Intermediate, Advanced) in your profile. You can also filter projects by difficulty and complexity indicators. The AI will automatically adjust project scope and requirements based on your selected skill level."
    },
    {
      id: "templates-hints",
      question: "What are templates and guided hints?",
      answer: "Templates provide structured starting points for your projects with pre-built code, documentation, and resource lists. Guided hints offer step-by-step instructions, troubleshooting tips, and learning resources to help you complete projects successfully, especially useful for beginners."
    },
    {
      id: "rating-system",
      question: "How does the rating system work?",
      answer: "After viewing project suggestions, you can rate them from 1-5 stars. Your ratings help our AI learn your preferences and improve future recommendations. High-rated projects also help other users discover quality content. The system tracks rating patterns to continuously enhance the generation algorithm."
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Help & Support</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Everything you need to get started and make the most of your learning journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Quick Start Guide */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>Quick Start Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border border-blue-100 dark:border-blue-800">
                    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-2 flex-shrink-0">
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1 transition-colors duration-300">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Features */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 dark:border-gray-700">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5" />
                  <CardTitle>Platform Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {platformFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-300 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5" />
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {filteredFAQs.map((faq) => (
                <Collapsible 
                  key={faq.id}
                  open={openFAQ === faq.id}
                  onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-4 h-auto text-left hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg mb-2 transition-all duration-300"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFAQ === faq.id ? (
                        <ChevronUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg p-4 mt-2 transition-all duration-300">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">No FAQs match your search. Try different keywords.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
