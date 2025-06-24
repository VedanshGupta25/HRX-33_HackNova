
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface VoiceCommandsProps {
  onVoiceCommand: (command: string, text?: string) => void;
  onVoiceInput: (text: string) => void;
}

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({ 
  onVoiceCommand, 
  onVoiceInput 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showCommands, setShowCommands] = useState(false);
  const { toast } = useToast();

  const voiceCommands = [
    { command: "generate task", action: "Generates learning tasks" },
    { command: "start task", action: "Starts the selected task" },
    { command: "show details", action: "Shows task details and hints" },
    { command: "hide details", action: "Hides task details" },
    { command: "help", action: "Shows this command list" },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined' && 
        ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        const finalTranscript = Array.from(event.results)
          .filter(result => result.isFinal)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        if (finalTranscript) {
          handleVoiceInput(finalTranscript.toLowerCase().trim());
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  }, []);

  const handleVoiceInput = (transcript: string) => {
    console.log('Voice input:', transcript);
    
    // Check for voice commands
    if (transcript.includes('generate task')) {
      onVoiceCommand('generate');
      toast({
        title: "Voice Command Executed",
        description: "Generating tasks...",
      });
    } else if (transcript.includes('start task')) {
      onVoiceCommand('start');
      toast({
        title: "Voice Command Executed",
        description: "Starting task...",
      });
    } else if (transcript.includes('show details')) {
      onVoiceCommand('showDetails');
      toast({
        title: "Voice Command Executed",
        description: "Showing task details...",
      });
    } else if (transcript.includes('hide details')) {
      onVoiceCommand('hideDetails');
      toast({
        title: "Voice Command Executed",
        description: "Hiding task details...",
      });
    } else if (transcript.includes('help')) {
      setShowCommands(true);
      toast({
        title: "Voice Commands",
        description: "Showing available voice commands.",
      });
    } else {
      // Regular voice input for concept/transcript
      onVoiceInput(transcript);
      toast({
        title: "Voice Input Captured",
        description: "Text has been added to the input field.",
      });
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Voice Recognition Started",
        description: "Listening for voice commands and input...",
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Voice Commands Help Popup */}
      {showCommands && (
        <Card className="mb-4 w-80 bg-white/95 backdrop-blur-sm shadow-xl border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Voice Commands</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommands(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <div className="space-y-2">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-blue-600">"{cmd.command}"</span>
                  <span className="text-gray-600"> - {cmd.action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Control Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowCommands(!showCommands)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-blue-50 border-blue-200"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
        
        <Button
          onClick={toggleListening}
          className={`${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white shadow-lg`}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
