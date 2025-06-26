
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
  ArrowLeft
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
  const [templates, setTemplates] = useState<CodeTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null);
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

  const handleBackToOptions = () => {
    setShowEditor(false);
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
    }
  ];

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
                  // Update the template with new code
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
            Choose your preferred coding environment for "{taskTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Info */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2 transition-colors duration-300">
                <Zap className="h-5 w-5" />
                Ready to Code!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-600 dark:text-blue-400 transition-colors duration-300">
                Time to put your knowledge into practice! Choose how you'd like to start coding for this {taskType.toLowerCase()} task.
              </p>
            </CardContent>
          </Card>

          {/* Practice Options */}
          <div className="grid gap-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-300">
              Choose Your Coding Environment
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
                            : 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
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
                    {option.id === 'vscode-desktop' ? 'Launch VS Code Desktop' : 'Start Coding Here'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips Section */}
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
                  <span>Use the in-browser editor to test ideas before moving to your main development environment</span>
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
