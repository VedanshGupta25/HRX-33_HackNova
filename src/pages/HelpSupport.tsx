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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black transition-all duration-300 relative overflow-hidden space-scrollbar">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-star-twinkle-delayed opacity-80"></div>
        <div className="absolute top-60 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-star-twinkle opacity-70"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-star-twinkle-delayed opacity-90"></div>
        <div className="absolute top-96 left-1/2 w-2 h-2 bg-white rounded-full animate-star-twinkle opacity-50"></div>
      </div>
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-4 transition-colors duration-300">Help & Support</h1>
            <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Everything you need to get started and make the most of your learning journey
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Quick Start Guide */}
            <Card className="bg-black/30 backdrop-blur-md shadow-lg border-purple-500/30 hover:shadow-xl transition-all duration-300 animate-cosmic-glow">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>Quick Start Guide</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {quickStartSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-blue-900/40 hover:bg-blue-900/60 transition-colors border border-blue-500/30">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 flex-shrink-0">
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 transition-colors duration-300">{step.title}</h3>
                      <p className="text-purple-200 text-sm transition-colors duration-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Platform Features */}
            <Card className="bg-black/30 backdrop-blur-md shadow-lg border-purple-500/30 hover:shadow-xl transition-all duration-300 animate-cosmic-glow">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5" />
                  <CardTitle>Platform Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {platformFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-900/40 transition-colors">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-purple-200 text-sm transition-colors duration-300">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="bg-black/30 backdrop-blur-md shadow-lg border-purple-500/30 hover:shadow-xl transition-all duration-300 animate-cosmic-glow">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
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
                  className="pl-10 bg-black/40 border-purple-500/30 text-white placeholder:text-purple-300"
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
                      className="w-full justify-between p-4 h-auto text-left hover:bg-purple-900/40 text-white border border-purple-500/30 rounded-lg mb-2 transition-all duration-300"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFAQ === faq.id ? (
                        <ChevronUp className="h-4 w-4 text-purple-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-purple-400" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4">
                    <div className="pt-2 border-t border-purple-500/30 bg-black/20 rounded-lg p-4 mt-2 transition-all duration-300">
                      <p className="text-purple-200 leading-relaxed transition-colors duration-300">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              
              {filteredFAQs.length === 0 && (
                <div className="text-purple-200 text-center py-8">No FAQs found for your search.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
