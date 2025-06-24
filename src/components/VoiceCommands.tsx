
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
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
  const [isSupported, setIsSupported] = useState(true);
  const { toast } = useToast();

  const voiceCommands = [
    { command: "generate task", action: "Generates learning tasks from your input" },
    { command: "start task", action: "Starts the first available task" },
    { command: "show details", action: "Shows task details and hints" },
    { command: "hide details", action: "Hides task details" },
    { command: "help", action: "Shows this command list" },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
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
        setIsSupported(false);
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, []);

  const handleVoiceInput = (transcript: string) => {
    console.log('Voice input:', transcript);
    
    // Check for voice commands
    if (transcript.includes('generate task') || transcript.includes('generate')) {
      onVoiceCommand('generate');
      toast({
        title: "🎯 Voice Command Executed",
        description: "Generating tasks from your input...",
      });
    } else if (transcript.includes('start task') || transcript.includes('start')) {
      onVoiceCommand('start');
      toast({
        title: "🚀 Voice Command Executed",
        description: "Starting your first task...",
      });
    } else if (transcript.includes('show details')) {
      onVoiceCommand('showDetails');
      toast({
        title: "👁️ Voice Command Executed",
        description: "Showing task details...",
      });
    } else if (transcript.includes('hide details')) {
      onVoiceCommand('hideDetails');
      toast({
        title: "🙈 Voice Command Executed",
        description: "Hiding task details...",
      });
    } else if (transcript.includes('help')) {
      setShowCommands(true);
      toast({
        title: "❓ Voice Commands",
        description: "Showing available voice commands.",
      });
    } else {
      // Regular voice input for concept/transcript
      onVoiceInput(transcript);
      toast({
        title: "🎤 Voice Input Captured",
        description: "Text has been added to the input field.",
      });
    }
  };

  const toggleListening = () => {
    if (!recognition || !isSupported) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition or microphone access is denied.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      toast({
        title: "🔇 Voice Recognition Stopped",
        description: "No longer listening for voice input.",
      });
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast({
          title: "🎤 Voice Recognition Started",
          description: "Listening for voice commands and input...",
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Unable to Start Voice Recognition",
          description: "Please check your microphone permissions.",
          variant: "destructive"
        });
      }
    }
  };

  if (!isSupported) {
    return null; // Hide the component if not supported
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Voice Commands Help Popup */}
      {showCommands && (
        <Card className="mb-4 w-80 bg-white/95 backdrop-blur-sm shadow-2xl border-blue-200 animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Voice Commands</h3>
                <Sparkles className="h-4 w-4 text-yellow-500" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommands(false)}
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              >
                ×
              </Button>
            </div>
            <div className="space-y-3">
              {voiceCommands.map((cmd, index) => (
                <div key={index} className="p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="font-medium text-blue-700">"{cmd.command}"</div>
                  <div className="text-sm text-gray-600">{cmd.action}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-xs text-yellow-800">
                💡 <strong>Tip:</strong> Speak clearly and wait for the microphone to process your command!
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Control Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => setShowCommands(!showCommands)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-blue-50 border-blue-200 shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Volume2 className="h-4 w-4 text-blue-600" />
        </Button>
        
        <div className="relative">
          <Button
            onClick={toggleListening}
            className={`relative overflow-hidden shadow-2xl transform transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 scale-110 animate-pulse' 
                : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105'
            } text-white`}
          >
            {isListening ? (
              <>
                <MicOff className="h-5 w-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 animate-ping opacity-75"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-300 to-pink-300 animate-pulse opacity-50"></div>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 opacity-0 hover:opacity-20 transition-opacity"></div>
              </>
            )}
          </Button>
          
          {/* Listening indicator ring */}
          {isListening && (
            <div className="absolute inset-0 border-4 border-red-300 rounded-lg animate-ping"></div>
          )}
          
          {/* Microphone status indicator */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
            isListening ? 'bg-red-400 animate-pulse' : 'bg-green-400'
          }`}></div>
        </div>
      </div>

      {/* Floating status text */}
      {isListening && (
        <div className="absolute bottom-16 right-0 bg-black/80 text-white px-3 py-1 rounded-lg text-sm animate-fade-in">
          🎤 Listening...
        </div>
      )}
    </div>
  );
};
