
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
}

const GEMINI_API_KEY = 'AIzaSyAE5FLtFYjCFLHonUVoHY9htSY5AucS48U';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiApiService {
  static async generateTasks(request: TaskGenerationRequest): Promise<Task[]> {
    console.log('Generating tasks with Gemini API for:', request.input);
    
    const prompt = `
      Act as an expert educational content creator. Based on the following ${request.inputType}, generate 3-5 personalized learning tasks.
      
      ${request.inputType === 'concept' ? 'Concept:' : 'Transcript:'} ${request.input}
      
      User Skill Level: ${request.skillLevel}
      
      For each task, provide:
      1. A clear, engaging title
      2. A detailed description (2-3 sentences)
      3. Difficulty level (Beginner/Intermediate/Advanced)
      4. Estimated completion time
      5. Task type (Reading/Exercise/Project/Quiz)
      
      Make tasks progressive, building upon each other. Ensure they are:
      - Engaging and practical
      - Appropriate for the ${request.skillLevel} level
      - Varied in type and approach
      - Focused on active learning
      
      Return the response as a JSON array of task objects with the fields: title, description, difficulty, estimatedTime, type.
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
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }
      
      const tasks = JSON.parse(jsonMatch[0]);
      
      return tasks.map((task: any, index: number) => ({
        id: `gemini_${Date.now()}_${index}`,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        estimatedTime: task.estimatedTime,
        type: task.type
      }));

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }
}
