export interface TaskGenerationRequest {
  input: string;
  inputType: 'concept' | 'transcript';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  userPreferences: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  type: string;
  xpReward: number;
  badgeUnlock?: string;
  streakBonus?: string;
  unlocksNext?: boolean;
  rating?: number;
  showCodePractice?: boolean;
}

const GEMINI_API_KEY = 'AIzaSyC6wBQhfbeVJ5wfWg6lvXd6-CaEEP7CGvI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiApiService {
  static async generateTasks(request: TaskGenerationRequest): Promise<Task[]> {
    console.log('Generating structured tasks with Gemini API for:', request.input);
    
    const prompt = `
You are an expert AI instructional designer for online learning platforms.

For the given learning topic, ALWAYS generate exactly 9 tasks (3 for each difficulty level):

BEGINNER LEVEL (3 tasks):
✅ 1 Reading task (type: "Reading", difficulty: "Beginner")
✅ 1 Exercise task (type: "Exercise", difficulty: "Beginner") 
✅ 1 Project task (type: "Project", difficulty: "Beginner")

INTERMEDIATE LEVEL (3 tasks):
✅ 1 Reading task (type: "Reading", difficulty: "Intermediate")
✅ 1 Exercise task (type: "Exercise", difficulty: "Intermediate")
✅ 1 Project task (type: "Project", difficulty: "Intermediate")

ADVANCED LEVEL (3 tasks):
✅ 1 Reading task (type: "Reading", difficulty: "Advanced")
✅ 1 Exercise task (type: "Exercise", difficulty: "Advanced")
✅ 1 Project task (type: "Project", difficulty: "Advanced")

IMPORTANT INSTRUCTIONS:
- Instead of providing generic resource links, generate RELEVANT INFORMATION about the topic
- For "Define project scope and objectives" → Provide actual guidance on how to define scope
- For "Break down the problem" → Explain step-by-step problem breakdown techniques
- For "Plan your approach" → Give specific planning strategies
- Only set "showCodePractice": true for coding-related topics (React, JavaScript, HTML, CSS, Python, programming languages, web development, etc.)
- For non-coding topics (business, history, science concepts, etc.), set "showCodePractice": false

For each task, provide:
- "title": string (engaging and specific)
- "description": string (2-3 sentences with ACTUAL helpful information, not generic descriptions)
- "difficulty": "Beginner" | "Intermediate" | "Advanced"
- "estimatedTime": string (realistic time estimate like "30 minutes", "2 hours", "1-2 days")
- "type": "Reading" | "Exercise" | "Project"
- "xpReward": number (Beginner: 25-50, Intermediate: 75-100, Advanced: 125-200)
- "rating": number (random between 3.5 and 5.0 for demo purposes)
- "showCodePractice": boolean (true only for coding-related topics)

**Learning Topic:** ${request.input}
**User Skill Level:** ${request.skillLevel}
**User Interests:** ${request.userPreferences.join(', ')}

**Difficulty Guidelines:**
- Beginner: Basic concepts with detailed explanations and step-by-step guidance
- Intermediate: Applied knowledge with practical examples and real-world scenarios
- Advanced: Deep analysis with expert-level insights and best practices

**Type Guidelines:**
- Reading: Comprehensive explanations with actionable insights, not just resource links
- Exercise: Practical activities with clear instructions and expected outcomes
- Project: Complete implementations with detailed planning and execution steps

ALWAYS return only a valid JSON array of exactly 9 task objects.
DO NOT include any extra text or commentary.
    `;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      console.log('Raw Gemini response:', generatedText);
      
      // Extract JSON array
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in Gemini response');
      }
      
      const tasks = JSON.parse(jsonMatch[0]);
      
      return tasks.map((task: any, index: number) => ({
        id: `gemini_${Date.now()}_${index}`,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        estimatedTime: task.estimatedTime,
        type: task.type,
        xpReward: task.xpReward || (task.difficulty === 'Beginner' ? 25 : task.difficulty === 'Intermediate' ? 75 : 125),
        rating: task.rating || (3.5 + Math.random() * 1.5),
        showCodePractice: task.showCodePractice || false,
        badgeUnlock: task.badgeUnlock,
        streakBonus: task.streakBonus,
        unlocksNext: task.unlocksNext
      }));

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}
