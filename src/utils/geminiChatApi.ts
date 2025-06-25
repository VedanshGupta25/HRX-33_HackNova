
const GEMINI_API_KEY = 'AIzaSyAQHHc54w-TRYRp0YaqWdeZQCwfvIgMu7Y';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export interface GeminiChatRequest {
  contents: ChatMessage[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export class GeminiChatService {
  private static readonly BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  static async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [],
    topic?: string,
    category?: string
  ): Promise<string> {
    try {
      // Create system context based on category and topic
      let systemContext = this.getSystemContext(category, topic);
      
      const requestBody: GeminiChatRequest = {
        contents: [
          {
            role: 'user',
            parts: [{ text: systemContext }]
          },
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      const response = await fetch(`${this.BASE_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  private static getSystemContext(category?: string, topic?: string): string {
    const baseContext = `You are an AI Learning Assistant designed to help students learn effectively. You should provide educational support that is:
- Clear and easy to understand
- Step-by-step when explaining processes
- Encouraging and supportive
- Focused on helping the user learn, not just giving answers
- Practical with real-world examples when relevant`;

    const topicContext = topic ? `\n\nThe current learning topic is: ${topic}. Please tailor your responses to be relevant to this topic.` : '';

    const categoryContexts = {
      'hint': `\n\nYou are being asked for a HINT. Provide guidance without giving the complete answer. Help the user think through the problem step by step. Ask leading questions and provide subtle clues.`,
      
      'solution': `\n\nYou are being asked for a SOLUTION. Provide a complete, step-by-step solution with clear explanations for each step. Include the reasoning behind each step so the user understands the process.`,
      
      'explanation': `\n\nYou are being asked for an EXPLANATION. Break down complex concepts into simple, understandable parts. Use analogies, examples, and clear language. Ensure the user understands the 'why' behind concepts.`,
      
      'alternative': `\n\nYou are being asked for ALTERNATIVE approaches. Provide different ways to solve the problem or understand the concept. Compare the pros and cons of each approach and suggest when each might be most useful.`,
      
      'general': `\n\nProvide general learning support. Be helpful, encouraging, and educational in your response.`
    };

    const categoryContext = category ? categoryContexts[category as keyof typeof categoryContexts] || '' : '';

    return baseContext + topicContext + categoryContext;
  }

  static async generateLearningPath(topic: string): Promise<any> {
    try {
      const prompt = `Create a detailed learning path for: ${topic}

Please structure your response as a JSON object with the following format:
{
  "id": "unique-id",
  "title": "Learning Path Title",
  "description": "Brief description",
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedTime": "X months",
  "steps": [
    "Step 1: ...",
    "Step 2: ...",
    ...
  ],
  "prerequisites": ["prereq1", "prereq2"],
  "outcomes": ["outcome1", "outcome2"],
  "resources": [
    {
      "title": "Resource Title",
      "type": "article|video|course|book",
      "url": "optional-url",
      "description": "Brief description"
    }
  ]
}

Focus on creating a practical, step-by-step progression that builds knowledge incrementally.`;

      const response = await this.sendMessage(prompt);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if JSON extraction fails
      return this.createFallbackLearningPath(topic);
    } catch (error) {
      console.error('Error generating learning path:', error);
      return this.createFallbackLearningPath(topic);
    }
  }

  private static createFallbackLearningPath(topic: string): any {
    return {
      id: `path-${Date.now()}`,
      title: `${topic} Learning Journey`,
      description: `Comprehensive learning path for mastering ${topic}`,
      difficulty: "Intermediate",
      estimatedTime: "3-6 months",
      steps: [
        `Understand ${topic} fundamentals`,
        `Learn core concepts and terminology`,
        `Practice with guided exercises`,
        `Build real-world projects`,
        `Advanced techniques and optimization`,
        `Best practices and industry standards`
      ],
      prerequisites: ["Basic computer skills", "Willingness to learn"],
      outcomes: [`Master ${topic} concepts`, "Build practical projects", "Apply knowledge professionally"],
      resources: [
        {
          title: "Official Documentation",
          type: "article",
          description: `Official ${topic} documentation and guides`
        },
        {
          title: "Interactive Tutorials",
          type: "course",
          description: `Hands-on ${topic} tutorials`
        }
      ]
    };
  }
}
