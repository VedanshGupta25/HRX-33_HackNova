
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Code2,
  Monitor,
  Zap,
  CheckCircle,
  ArrowRight,
  Download,
  ArrowLeft,
  FileText,
  Palette
} from 'lucide-react';
import { MonacoEditor } from './MonacoEditor';
import { CodeUtils, type CodeTemplate } from '@/utils/codeUtils';
import { useToast } from '@/hooks/use-toast';

interface CodePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskType: string;
}

interface PracticeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  action: () => void;
  available: boolean;
}

export const CodePracticeModal: React.FC<CodePracticeModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  taskType
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null);
  const [notepadContent, setNotepadContent] = useState('');
  const { toast } = useToast();

  const handleVSCodeDesktop = () => {
    CodeUtils.openVSCode();
    
    toast({
      title: "Opening VS Code Desktop! 💻",
      description: "Attempting to launch VS Code on your desktop.",
    });
  };

  const handleInBrowser = () => {
    const taskTemplates = CodeUtils.generateCodeTemplate(taskTitle, taskType, 'beginner');
    setTemplates(taskTemplates);
    setSelectedTemplate(taskTemplates[0]);
    setShowEditor(true);
    
    toast({
      title: "Loading Code Editor! ⚡",
      description: "Setting up your in-browser coding environment.",
    });
  };

  const handleNotepad = () => {
    setShowNotepad(true);
    
    toast({
      title: "Opening Notepad! 📝",
      description: "Perfect for jotting down ideas and planning your approach.",
    });
  };

  const handleCanvas = () => {
    setShowCanvas(true);
    
    toast({
      title: "Opening Canvas! 🎨",
      description: "Great for visual brainstorming and diagram creation.",
    });
  };

  const handleBackToOptions = () => {
    setShowEditor(false);
    setShowNotepad(false);
    setShowCanvas(false);
    setSelectedTemplate(null);
  };

  const practiceOptions: PracticeOption[] = [
    {
      id: 'vscode-desktop',
      title: 'VS Code Desktop',
      description: 'Open VS Code on your desktop with full development environment and local file access.',
      icon: <Monitor className="h-6 w-6 text-green-600 dark:text-green-400" />,
      badge: 'Full Featured',
      action: handleVSCodeDesktop,
      available: true
    },
    {
      id: 'browser',
      title: 'In-Browser Editor',
      description: 'Quick coding practice with syntax highlighting and auto-completion right here.',
      icon: <Code2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      badge: 'Quick Start',
      action: handleInBrowser,
      available: true
    },
    {
      id: 'notepad',
      title: 'Notepad',
      description: 'Simple text editor for planning, note-taking, and brainstorming your solutions.',
      icon: <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      badge: 'Planning',
      action: handleNotepad,
      available: true
    },
    {
      id: 'canvas',
      title: 'Drawing Canvas',
      description: 'Visual workspace for creating diagrams, flowcharts, and sketching out ideas.',
      icon: <Palette className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
      badge: 'Visual',
      action: handleCanvas,
      available: true
    }
  ];

  if (showNotepad) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleBackToOptions}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <DialogTitle className="text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Notepad - {taskTitle}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Plan your approach, take notes, and organize your thoughts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <textarea
              value={notepadContent}
              onChange={(e) => setNotepadContent(e.target.value)}
              placeholder="Start writing your notes, ideas, or planning here..."
              className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            />
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(notepadContent);
                  toast({
                    title: "Copied!",
                    description: "Notes copied to clipboard.",
                  });
                }}
                variant="outline"
              >
                Copy Notes
              </Button>
              <Button
                onClick={() => {
                  setNotepadContent('');
                  toast({
                    title: "Cleared!",
                    description: "Notepad has been cleared.",
                  });
                }}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showCanvas) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleBackToOptions}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <DialogTitle className="text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                Drawing Canvas - {taskTitle}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Create diagrams, flowcharts, and visual representations of your ideas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-4">
              <canvas
                width={800}
                height={400}
                className="border border-gray-200 dark:border-gray-700 rounded bg-white cursor-crosshair"
                onMouseDown={(e) => {
                  const canvas = e.currentTarget;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.beginPath();
                    const rect = canvas.getBoundingClientRect();
                    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                    
                    const draw = (event: MouseEvent) => {
                      ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
                      ctx.stroke();
                    };
                    
                    const stopDrawing = () => {
                      canvas.removeEventListener('mousemove', draw);
                      canvas.removeEventListener('mouseup', stopDrawing);
                    };
                    
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', stopDrawing);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      toast({
                        title: "Canvas Cleared!",
                        description: "Drawing canvas has been cleared.",
                      });
                    }
                  }
                }}
                variant="outline"
              >
                Clear Canvas
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showEditor) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleBackToOptions}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <DialogTitle className="text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  Code Editor - {taskTitle}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.language}
                    onClick={() => setSelectedTemplate(template)}
                    variant={selectedTemplate?.language === template.language ? "default" : "outline"}
                    size="sm"
                    className="capitalize"
                  >
                    {template.language}
                  </Button>
                ))}
              </div>
            </div>
            <DialogDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Start coding with the selected template. You can run, copy, or download your code.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedTemplate && (
              <MonacoEditor
                initialCode={selectedTemplate.code}
                language={selectedTemplate.language}
                onCodeChange={(code) => {
                  setSelectedTemplate({
                    ...selectedTemplate,
                    code
                  });
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Code2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Practice Code
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Choose your preferred environment for "{taskTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2 transition-colors duration-300">
                <Zap className="h-5 w-5" />
                Ready to Code!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 dark:text-blue-400 transition-colors duration-300">
                Time to put your knowledge into practice! Choose how you'd like to start working on this {taskType.toLowerCase()} task.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-300">
              Choose Your Environment
            </h3>
            
            {practiceOptions.map((option) => (
              <Card 
                key={option.id}
                className={`transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
                  selectedOption === option.id 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                } dark:bg-gray-800/50`}
                onClick={() => setSelectedOption(option.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
                          {option.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        className={`${
                          option.badge === 'Full Featured'
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                            : option.badge === 'Quick Start'
                            ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
                            : option.badge === 'Planning'
                            ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                            : 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700'
                        }`}
                      >
                        {option.badge}
                      </Badge>
                      {option.available && (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      option.action();
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transition-all duration-300 hover:scale-105"
                    disabled={!option.available}
                  >
                    {option.id === 'vscode-desktop' && <Download className="h-4 w-4 mr-2" />}
                    {option.id === 'browser' && <ArrowRight className="h-4 w-4 mr-2" />}
                    {option.id === 'notepad' && <FileText className="h-4 w-4 mr-2" />}
                    {option.id === 'canvas' && <Palette className="h-4 w-4 mr-2" />}
                    {option.id === 'vscode-desktop' ? 'Launch VS Code Desktop' : 
                     option.id === 'browser' ? 'Start Coding Here' :
                     option.id === 'notepad' ? 'Open Notepad' : 'Open Canvas'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2 transition-colors duration-300">
                <Zap className="h-5 w-5 text-yellow-500" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Desktop VS Code offers the full development experience with extensions and debugging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>In-browser editor is great for focused coding sessions and quick practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use the notepad to plan your approach before coding</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Draw diagrams and flowcharts on the canvas to visualize your solution</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
