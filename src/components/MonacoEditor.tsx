import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Download,
  Copy,
  Code2,
  Maximize2,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MonacoEditorProps {
  value?: string;
  onChange?: (code: string) => void;
  language?: string;
  height?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  onRun?: (code: string) => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value = '',
  onChange,
  language = 'javascript',
  height = '100%',
  theme = 'light',
  readOnly = false,
  onRun
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = React.useState(value);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const { toast } = useToast();

  // Update internal state when value prop changes
  React.useEffect(() => {
    setCode(value);
  }, [value]);

  // Simple fallback editor (since Monaco Editor requires complex setup)
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleRun = () => {
    if (onRun) {
      onRun(code);
    } else {
      // Simple JavaScript execution for demo
      if (language === 'javascript') {
        try {
          const result = eval(code);
          toast({
            title: "Code Executed! ⚡",
            description: `Result: ${result}`,
          });
        } catch (error) {
          toast({
            title: "Execution Error",
            description: `Error: ${(error as Error).message}`,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Code Ready! 📝",
          description: "Your code is ready to run in your preferred environment.",
        });
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code Copied! 📋",
        description: "Code has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded! 💾",
      description: `File saved as code.${getFileExtension(language)}`,
    });
  };

  const getFileExtension = (lang: string): string => {
    switch (lang.toLowerCase()) {
      case 'javascript': return 'js';
      case 'typescript': return 'ts';
      case 'python': return 'py';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'txt';
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card className={`transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]' 
        : ''
    } bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700`} style={{ height }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Code Editor
          <Badge variant="outline" className="ml-2 text-xs">
            {language.toUpperCase()}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="h-8 transition-all duration-300 hover:scale-105"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            className="h-8 transition-all duration-300 hover:scale-105"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="h-8 transition-all duration-300 hover:scale-105"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleRun}
            className="h-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 hover:scale-105"
            size="sm"
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-full">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className={`w-full resize-none border-0 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
              isFullscreen ? 'h-[calc(100vh-8rem)]' : 'h-80'
            }`}
            placeholder={`Start coding in ${language}...`}
            readOnly={readOnly}
            spellCheck={false}
            style={{
              fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
              lineHeight: '1.5',
              tabSize: 2
            }}
          />
          
          {/* Simple syntax highlighting overlay could go here */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs bg-white/80 dark:bg-gray-800/80">
              Lines: {code.split('\n').length}
            </Badge>
            <Badge variant="outline" className="text-xs bg-white/80 dark:bg-gray-800/80">
              Chars: {code.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
