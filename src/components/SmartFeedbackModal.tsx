
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from './LoadingSpinner';
import { AIFeedbackService, AI_PERSONAS, type CodeFeedback } from '@/utils/aiFeedbackService';
import { Brain, Bug, Lightbulb, Search, Star, MessageSquare } from 'lucide-react';

interface SmartFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language?: string;
}

export const SmartFeedbackModal: React.FC<SmartFeedbackModalProps> = ({
  isOpen,
  onClose,
  code,
  language = 'javascript'
}) => {
  const [feedback, setFeedback] = useState<CodeFeedback | null>(null);
  const [selectedPersona, setSelectedPersona] = useState('code-reviewer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const analyzeFeedback = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const result = await AIFeedbackService.analyzeCode(code, language, selectedPersona);
      setFeedback(result);
    } catch (error) {
      console.error('Feedback analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!askQuestion.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await AIFeedbackService.askWithPersona(
        askQuestion, 
        selectedPersona, 
        `Code context: ${code.substring(0, 500)}...`
      );
      setChatResponse(response);
    } catch (error) {
      console.error('Question failed:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const selectedPersonaData = AI_PERSONAS.find(p => p.id === selectedPersona);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Smart Code Feedback & AI Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Persona Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">AI Persona:</label>
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_PERSONAS.map(persona => (
                  <SelectItem key={persona.id} value={persona.id}>
                    <div className="flex items-center gap-2">
                      <span>{persona.emoji}</span>
                      <span>{persona.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPersonaData && (
              <Badge variant="outline" className="text-xs">
                {selectedPersonaData.description}
              </Badge>
            )}
          </div>

          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="feedback">Code Analysis</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="feedback" className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={analyzeFeedback} disabled={isAnalyzing || !code.trim()}>
                  {isAnalyzing ? <LoadingSpinner /> : <Search className="h-4 w-4 mr-2" />}
                  Analyze Code
                </Button>
              </div>

              {feedback && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Score */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-sm">
                        Overall Score
                        <div className={`flex items-center gap-2 ${getScoreColor(feedback.score)}`}>
                          <Star className="h-4 w-4" />
                          <span className="text-lg font-bold">{feedback.score}/100</span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={feedback.score} className="w-full" />
                    </CardContent>
                  </Card>

                  {/* Feedback Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Brain className="h-4 w-4 text-blue-600" />
                          Code Quality
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {feedback.codeQuality.map((point, index) => (
                          <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                            • {point}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Search className="h-4 w-4 text-purple-600" />
                          Design Feedback
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {feedback.designFeedback.map((point, index) => (
                          <div key={index} className="text-sm p-2 bg-purple-50 rounded">
                            • {point}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          Improvements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {feedback.improvementSuggestions.map((point, index) => (
                          <div key={index} className="text-sm p-2 bg-yellow-50 rounded">
                            💡 {point}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {feedback.bugs.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Bug className="h-4 w-4 text-red-600" />
                            Potential Issues
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {feedback.bugs.map((bug, index) => (
                            <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-300">
                              🐛 {bug}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <span className="text-2xl">{selectedPersonaData?.emoji}</span>
                <div>
                  <div className="font-medium">{selectedPersonaData?.name}</div>
                  <div className="text-sm text-gray-600">{selectedPersonaData?.description}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={askQuestion}
                  onChange={(e) => setAskQuestion(e.target.value)}
                  placeholder="Ask the AI about your code..."
                  className="flex-1 px-3 py-2 border rounded-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                />
                <Button onClick={handleAskQuestion} disabled={isAsking || !askQuestion.trim()}>
                  {isAsking ? <LoadingSpinner /> : <MessageSquare className="h-4 w-4" />}
                </Button>
              </div>

              {chatResponse && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      {selectedPersonaData?.emoji} {selectedPersonaData?.name} Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-wrap p-3 bg-gray-50 rounded">
                      {chatResponse}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
