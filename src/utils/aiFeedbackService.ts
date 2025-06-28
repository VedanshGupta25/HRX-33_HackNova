
import { GeminiChatService } from './geminiChatApi';

export interface CodeFeedback {
  codeQuality: string[];
  designFeedback: string[];
  improvementSuggestions: string[];
  bugs: string[];
  score: number;
}

export interface AIPersona {
  id: string;
  name: string;
  emoji: string;
  description: string;
  systemPrompt: string;
}

export const AI_PERSONAS: AIPersona[] = [
  {
    id: 'strict-mentor',
    name: 'Strict Mentor',
    emoji: '🧠',
    description: 'Direct, critical feedback focused on best practices',
    systemPrompt: `You are a seasoned, demanding software architect. Your feedback is direct, critical, and focused on best practices, efficiency, and robustness. When reviewing code, be thorough and point out every potential flaw. When answering questions, provide the most optimal and professional solution. Be constructive but demanding.`
  },
  {
    id: 'curious-friend',
    name: 'Curious Friend',
    emoji: '🤖',
    description: 'Enthusiastic and exploratory, loves brainstorming',
    systemPrompt: `You are a friendly, enthusiastic AI assistant. You love exploring ideas and learning new things. When someone asks a question, try to provide a comprehensive answer and then follow up with related questions to encourage further exploration. Brainstorming is your favorite activity. Be encouraging and curious.`
  },
  {
    id: 'college-ta',
    name: 'College TA',
    emoji: '🧑‍🏫',
    description: 'Patient teacher focused on step-by-step learning',
    systemPrompt: `You are a helpful Teaching Assistant for a computer science course. Your goal is to explain concepts clearly, break down complex problems, and guide the user toward understanding. Assume they are learning and might make common mistakes. Offer encouragement and provide step-by-step explanations.`
  },
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    emoji: '🔍',
    description: 'Focused on code quality and security analysis',
    systemPrompt: `You are an expert code reviewer with years of experience in software development. Focus on code quality, security vulnerabilities, performance issues, and maintainability. Provide specific, actionable feedback with examples when possible.`
  }
];

export class AIFeedbackService {
  static async analyzeCode(code: string, language: string = 'javascript', persona?: string): Promise<CodeFeedback> {
    try {
      const selectedPersona = AI_PERSONAS.find(p => p.id === persona) || AI_PERSONAS[3]; // Default to code-reviewer
      
      const prompt = `${selectedPersona.systemPrompt}

Analyze the following ${language} code for quality, design patterns, and potential bugs. Provide specific feedback and suggest improvements.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Please format your response as JSON with the following structure:
{
  "codeQuality": ["point 1", "point 2", ...],
  "designFeedback": ["point 1", "point 2", ...],
  "improvementSuggestions": ["suggestion 1", "suggestion 2", ...],
  "bugs": ["bug 1", "bug 2", ...],
  "score": 85
}

Focus on being practical and actionable. The score should be out of 100.`;

      const response = await GeminiChatService.sendMessage(prompt);
      
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const feedback = JSON.parse(jsonMatch[0]);
        return feedback;
      }
      
      // Fallback parsing if JSON extraction fails
      return this.parseFeedbackResponse(response);
    } catch (error) {
      console.error('Error analyzing code:', error);
      return this.createFallbackFeedback();
    }
  }

  static async askWithPersona(question: string, persona: string, context?: string): Promise<string> {
    try {
      const selectedPersona = AI_PERSONAS.find(p => p.id === persona);
      if (!selectedPersona) {
        throw new Error(`Persona "${persona}" not found`);
      }

      const contextPrefix = context ? `Context: ${context}\n\n` : '';
      const fullPrompt = `${contextPrefix}${question}`;

      return await GeminiChatService.sendMessage(fullPrompt, [], undefined, selectedPersona.id);
    } catch (error) {
      console.error('Error with persona chat:', error);
      throw error;
    }
  }

  private static parseFeedbackResponse(response: string): CodeFeedback {
    // Basic parsing for non-JSON responses
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      codeQuality: lines.filter(line => line.includes('quality') || line.includes('clean')).slice(0, 3),
      designFeedback: lines.filter(line => line.includes('design') || line.includes('pattern')).slice(0, 3),
      improvementSuggestions: lines.filter(line => line.includes('improve') || line.includes('suggest')).slice(0, 3),
      bugs: lines.filter(line => line.includes('bug') || line.includes('issue') || line.includes('error')).slice(0, 2),
      score: 75 // Default score
    };
  }

  private static createFallbackFeedback(): CodeFeedback {
    return {
      codeQuality: ['Code structure looks reasonable', 'Consider adding more comments'],
      designFeedback: ['Design patterns are appropriately used', 'Consider separating concerns further'],
      improvementSuggestions: ['Add error handling', 'Consider performance optimizations'],
      bugs: [],
      score: 80
    };
  }
}
