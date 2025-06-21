
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
}

const GEMINI_API_KEY = 'AIzaSyAE5FLtFYjCFLHonUVoHY9htSY5AucS48U';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiApiService {
  static async generateTasks(request: TaskGenerationRequest): Promise<Task[]> {
    console.log('Generating structured tasks with Gemini API for:', request.input);
    
    const prompt = `
You are an expert AI instructional designer for online learning platforms.

For the given learning topic, ALWAYS generate exactly:

✅ 1 Reading task (label: Reading)  
✅ 1 Practical Exercise task (label: Exercise)  
✅ 1 Project-based task (label: Project)  

For each task, provide:

- "title": string  
- "description": string (2-3 sentences)  
- "difficulty": "Beginner" | "Intermediate" | "Advanced"  
- "estimatedTime": string (example: "30 minutes" or "60-90 minutes")  
- "type": "Reading" | "Exercise" | "Project"  
- "xpReward": number (example: 50, 75, 100)  
- "badgeUnlock": string (optional, can be null)  
- "streakBonus": string (optional, can be null)  
- "unlocksNext": true | false  

**Learning Topic:** ${request.input}  
**User Skill Level:** ${request.skillLevel}  
**User Interests:** ${request.userPreferences.join(', ')}  

**Style guide:**  
Reading → explore core ideas through articles or papers  
Exercise → short practice using datasets, tools, quizzes  
Project → larger activity to apply concepts in real-world  

ALWAYS return only a valid JSON array of exactly 3 task objects — [ Reading, Exercise, Project ]  
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
        xpReward: task.xpReward,
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
