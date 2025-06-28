
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from './LoadingSpinner';
import { AIFeedbackService, AI_PERSONAS } from '@/utils/aiFeedbackService';
import { Lightbulb, Sparkles, MessageSquare, Brain } from 'lucide-react';

interface AIBrainstormModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
}

export const AIBrainstormModal: React.FC<AIBrainstormModalProps> = ({
  isOpen,
  onClose,
  topic = ''
}) => {
  const [selectedPersona, setSelectedPersona] = useState('curious-friend');
  const [brainstormTopic, setBrainstormTopic] = useState(topic);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'ai', message: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const brainstormPrompts = [
    "What are some creative features I could add?",
    "How can I make this more user-friendly?",
    "What are some potential challenges I might face?",
    "Can you suggest some innovative approaches?",
    "What would make this project stand out?",
    "How can I improve the user experience?",
    "What are some interesting use cases?",
    "Can you help me think of edge cases?"
  ];

  const generateIdeas = async () => {
    if (!brainstormTopic.trim()) return;
    
    setIsGenerating(true);
    try {
      const prompt = `I'm working on: ${brainstormTopic}. 
      
      Please brainstorm creative ideas, features, and approaches. Be enthusiastic and think outside the box! Provide at least 5-8 practical ideas that could enhance this project.`;
      
      const response = await AIFeedbackService.askWithPersona(prompt, selectedPersona);
      
      // Extract ideas from response
      const ideaLines = response.split('\n')
        .filter(line => line.trim() && (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('*')))
        .map(line => line.replace(/^[\s\-\•\*\d\.]+/, '').trim())
        .filter(line => line.length > 10);
      
      setIdeas(ideaLines.length > 0 ? ideaLines : [response]);
      
      setConversation(prev => [...prev, 
        { role: 'user', message: `Brainstorm ideas for: ${brainstormTopic}` },
        { role: 'ai', message: response }
      ]);
    } catch (error) {
      console.error('Brainstorming failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    setIsGenerating(true);
    const userMessage = currentMessage;
    setCurrentMessage('');
    
    setConversation(prev => [...prev, { role: 'user', message: userMessage }]);
    
    try {
      const context = brainstormTopic ? `Project context: ${brainstormTopic}` : '';
      const response = await AIFeedbackService.askWithPersona(userMessage, selectedPersona, context);
      
      setConversation(prev => [...prev, { role: 'ai', message: response }]);
    } catch (error) {
      console.error('Message failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedPersonaData = AI_PERSONAS.find(p => p.id === selectedPersona);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            AI Brainstorm Assistant
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
          </div>

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Project/Topic:</label>
            <input
              type="text"
              value={brainstormTopic}
              onChange={(e) => setBrainstormTopic(e.target.value)}
              placeholder="What are you working on?"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <Button onClick={generateIdeas} disabled={isGenerating || !brainstormTopic.trim()}>
              {isGenerating ? <LoadingSpinner /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate Ideas
            </Button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick Questions:</label>
            <div className="flex flex-wrap gap-2">
              {brainstormPrompts.map((prompt, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setCurrentMessage(prompt)}
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>

          {/* Generated Ideas */}
          {ideas.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4 text-blue-600" />
                  Generated Ideas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                {ideas.map((idea, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded">
                    <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{idea}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Conversation */}
          {conversation.length > 0 && (
            <Card className="max-h-64 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  Conversation with {selectedPersonaData?.name} {selectedPersonaData?.emoji}
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-48 overflow-y-auto space-y-3">
                {conversation.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-2 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.role === 'ai' && <span className="text-lg mr-1">{selectedPersonaData?.emoji}</span>}
                      {msg.message}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={`Ask ${selectedPersonaData?.name} anything...`}
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={isGenerating || !currentMessage.trim()}>
              {isGenerating ? <LoadingSpinner /> : <MessageSquare className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
