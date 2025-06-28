
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonacoEditor } from './MonacoEditor';
import { SmartFeedbackModal } from './SmartFeedbackModal';
import { AIBrainstormModal } from './AIBrainstormModal';
import { 
  Code, 
  Play, 
  Save, 
  Download, 
  FileText, 
  Palette, 
  Brain,
  Lightbulb,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface CodePracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskDescription: string;
  language: string;
}

export const CodePracticeModal: React.FC<CodePracticeModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  taskDescription,
  language
}) => {
  const [code, setCode] = useState(getStarterCode(language));
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [output, setOutput] = useState('');
  const [notes, setNotes] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBrainstorm, setShowBrainstorm] = useState(false);
  
  // Canvas state
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'react', label: 'React', icon: '⚛️' },
    { value: 'typescript', label: 'TypeScript', icon: '🔷' }
  ];

  function getStarterCode(lang: string): string {
    const starters = {
      javascript: '// Your JavaScript code here\nconsole.log("Hello, World!");',
      python: '# Your Python code here\nprint("Hello, World!")',
      html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* Your CSS code here */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}',
      react: 'import React from "react";\n\nfunction MyComponent() {\n    return (\n        <div>\n            <h1>Hello, World!</h1>\n        </div>\n    );\n}\n\nexport default MyComponent;',
      typescript: '// Your TypeScript code here\ninterface User {\n    name: string;\n    age: number;\n}\n\nconst user: User = {\n    name: "John",\n    age: 30\n};'
    };
    return starters[lang as keyof typeof starters] || starters.javascript;
  }

  const runCode = () => {
    try {
      if (selectedLanguage === 'javascript') {
        // Capture console.log output
        const originalLog = console.log;
        let output = '';
        console.log = (...args) => {
          output += args.join(' ') + '\n';
        };
        
        // Execute code
        eval(code);
        
        // Restore console.log
        console.log = originalLog;
        setOutput(output || 'Code executed successfully!');
      } else {
        setOutput(`Code execution for ${selectedLanguage} is simulated.\nYour code:\n${code}`);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const saveCode = () => {
    localStorage.setItem(`code_practice_${taskTitle}`, JSON.stringify({
      code,
      language: selectedLanguage,
      notes,
      timestamp: new Date().toISOString()
    }));
    
    console.log('Code saved to localStorage');
  };

  const downloadCode = () => {
    const extension = selectedLanguage === 'javascript' ? 'js' : 
                    selectedLanguage === 'python' ? 'py' :
                    selectedLanguage === 'typescript' ? 'ts' :
                    selectedLanguage;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${taskTitle.replace(/\s+/g, '_')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Canvas functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-600" />
              Code Practice: {taskTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(90vh-8rem)] overflow-hidden">
            {/* Left Panel - Task Info & Tools */}
            <div className="space-y-4 overflow-y-auto">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Task Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{taskDescription}</p>
                </CardContent>
              </Card>

              {/* AI Assistant Tools */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Brain className="h-4 w-4 text-purple-600" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => setShowFeedback(true)}
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                    disabled={!code.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Smart Code Review
                  </Button>
                  <Button
                    onClick={() => setShowBrainstorm(true)}
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Brainstorm Ideas
                  </Button>
                </CardContent>
              </Card>

              {/* Language Selection */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedLanguage} onValueChange={(value) => {
                    setSelectedLanguage(value);
                    setCode(getStarterCode(value));
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <span>{lang.icon}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={runCode} size="sm" className="text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                    <Button onClick={saveCode} size="sm" variant="outline" className="text-xs">
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                  <Button onClick={downloadCode} size="sm" variant="outline" className="w-full text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download Code
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Middle Panel - Code Editor */}
            <div className="lg:col-span-2 flex flex-col overflow-hidden">
              <Tabs defaultValue="code" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="output">Output</TabsTrigger>
                  <TabsTrigger value="notes">Notepad</TabsTrigger>
                  <TabsTrigger value="canvas">Canvas</TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="flex-1 mt-2">
                  <div className="h-full border rounded-lg overflow-hidden">
                    <MonacoEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage}
                      height="100%"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="output" className="flex-1 mt-2">
                  <div className="h-full border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">Output</h3>
                      <Badge variant="outline">{selectedLanguage}</Badge>
                    </div>
                    <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto h-full">
                      {output || 'Run your code to see output here...'}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="flex-1 mt-2">
                  <div className="h-full border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <h3 className="font-medium text-sm">Planning Notes</h3>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your planning notes, pseudocode, or thoughts here..."
                      className="w-full h-full resize-none border-none outline-none text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="canvas" className="flex-1 mt-2">
                  <div className="h-full border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-gray-600" />
                        <h3 className="font-medium text-sm">Drawing Canvas</h3>
                      </div>
                      <Button onClick={clearCanvas} size="sm" variant="outline">
                        Clear
                      </Button>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={300}
                      className="border rounded cursor-crosshair bg-white"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Draw diagrams, flowcharts, or visualize your ideas
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SmartFeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        code={code}
        language={selectedLanguage}
      />

      <AIBrainstormModal
        isOpen={showBrainstorm}
        onClose={() => setShowBrainstorm(false)}
        topic={taskTitle}
      />
    </>
  );
};
