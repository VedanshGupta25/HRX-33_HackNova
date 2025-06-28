const GEMINI_API_KEY = 'AIzaSyDOnF9uiH2vXtqTu2Y-PNJ4EhPWApFE31c';
const GEMINI_API_KEY_BACKUP = 'AIzaSyDow_jx0BdrvPHkKP8fo4_tKs3DscbiJRA';

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
  private static readonly BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
          temperature: category === 'interview' ? 0.8 : 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: category === 'interview' ? 2048 : 1024,
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
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        // Fallback: return a friendly message
        return 'Sorry, the AI interviewer is temporarily unavailable. Please try again in a few moments.';
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        // Fallback: return a friendly message
        return 'Sorry, the AI interviewer could not generate a response right now. Please try again soon.';
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback: return a friendly message
      return 'Sorry, there was a technical issue with the AI interviewer. Please try again later.';
    }
  }

  static async generateInterviewPrompt(projectTitle: string, projectDescription: string, technologies: string[], code?: string): Promise<string> {
    const prompt = `You are Gemini-Interviewer, a Senior Software Engineer at a top tech company conducting a professional technical interview.

**Your Personality:**
- Professional, insightful, and engaging
- Ask thoughtful, probing questions
- Provide constructive feedback
- Focus on both technical knowledge and problem-solving approach

**The Candidate's Project:**
- **Title:** ${projectTitle}
- **Description:** ${projectDescription}  
- **Technologies:** ${technologies.join(', ')}
${code ? `- **Code Sample:**\n\`\`\`\n${code.substring(0, 1000)}${code.length > 1000 ? '...' : ''}\n\`\`\`` : ''}

**Interview Structure:**
1. **Introduction & Conceptual Questions** (5-7 minutes)
   - Introduce yourself professionally
   - Ask 2-3 deep questions about technology choices, architecture, and design decisions
   - Probe their understanding of the technologies they used

2. **Live Coding Challenge** (7 minutes)
   - Present a practical coding task that extends or modifies their project
   - Give clear requirements and time limit
   - Ask them to explain their approach

3. **Evaluation & Feedback**
   - Provide detailed, constructive feedback
   - Score their performance
   - Give actionable improvement suggestions

**Important Guidelines:**
- Keep responses conversational but professional
- Ask follow-up questions to test deeper understanding  
- When transitioning to coding phase, clearly state "Now let's move to a practical coding challenge"
- Be encouraging while maintaining professional standards
- Focus on problem-solving process, not just final answers

Begin the interview now with a professional introduction and your first conceptual question.`;

    return prompt;
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
      
      'interview': `\n\nYou are Gemini-Interviewer, a Senior Software Engineer conducting a professional technical interview. 

**Your Personality & Approach:**
- Professional, insightful, and engaging
- Ask thoughtful questions that test both knowledge and problem-solving
- Provide constructive feedback with specific examples
- Balance being encouraging with maintaining professional standards
- Focus on the candidate's thought process, not just correct answers

**Interview Guidelines:**
- Keep responses conversational but professional (as if speaking directly to the candidate)
- Ask follow-up questions to probe deeper understanding
- When ready for coding phase, clearly indicate with phrases like "Now let's move to a practical coding challenge"
- For evaluations, provide specific scores and actionable feedback
- Structure your questions to build from basic concepts to more complex scenarios

**Interview Phases:**
1. **Conceptual Phase**: Deep technical questions about their project choices and architecture
2. **Coding Phase**: Practical challenges that extend their existing work  
3. **Evaluation Phase**: Comprehensive feedback with scores and improvement suggestions

Conduct the interview as a senior engineer would - professional, thorough, and focused on assessing both technical skills and problem-solving approach.`,
      
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
