export interface TaskClassificationResult {
  isCodeRelated: boolean;
  confidence: number;
  reasoning: string;
  suggestedLanguages?: string[];
}

export class GeminiTaskClassifier {
  private static cache = new Map<string, TaskClassificationResult>();
  private static readonly GEMINI_API_KEY = 'AIzaSyCrpNKMFmfrPkGmqij4_VZZS_3wSGe8k5o';
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  static async classifyTask(
    title: string,
    description: string,
    type: string
  ): Promise<TaskClassificationResult> {
    // Create cache key
    const cacheKey = `${title}_${description}_${type}`.toLowerCase();
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log('Using cached classification for:', title);
      return this.cache.get(cacheKey)!;
    }

    const prompt = `
Analyze the following learning task and determine if it involves programming, coding, or software development:

**Task Title:** ${title}
**Task Description:** ${description}
**Task Type:** ${type}

Respond with a JSON object containing:
- "isCodeRelated": boolean (true if the task involves any programming, coding, algorithms, software development, web development, app development, or technical implementation)
- "confidence": number (0.0 to 1.0, how confident you are in this classification)
- "reasoning": string (brief explanation of your decision)
- "suggestedLanguages": string[] (if code-related, suggest relevant programming languages like "JavaScript", "Python", "HTML", "CSS", etc.)

Examples of CODE-RELATED tasks:
- Building a calculator app
- Learning JavaScript functions
- Creating HTML layouts
- Writing Python algorithms
- Database design and SQL
- API development
- Mobile app development
- Web design and CSS styling
- Software architecture
- Data structures and algorithms

Examples of NON-CODE-RELATED tasks:
- Learning about photosynthesis in biology
- Reading about historical events
- Studying mathematical theorems (unless implementing them)
- Language learning and grammar
- Art and design theory
- Business strategy
- Literature analysis
- Scientific research without programming

Return ONLY the JSON object, no additional text.
    `;

    try {
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
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
        console.warn('Gemini API error, using fallback classification');
        return this.getFallbackClassification(title, description, type);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.warn('Invalid Gemini response, using fallback classification');
        return this.getFallbackClassification(title, description, type);
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Gemini response, using fallback');
        return this.getFallbackClassification(title, description, type);
      }
      
      const result = JSON.parse(jsonMatch[0]);
      
      // Validate result structure
      const classificationResult: TaskClassificationResult = {
        isCodeRelated: Boolean(result.isCodeRelated),
        confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0.5)),
        reasoning: String(result.reasoning || 'AI classification'),
        suggestedLanguages: Array.isArray(result.suggestedLanguages) ? result.suggestedLanguages : undefined
      };

      // Cache the result
      this.cache.set(cacheKey, classificationResult);
      
      console.log(`Task "${title}" classified as ${classificationResult.isCodeRelated ? 'code-related' : 'non-code'} with ${Math.round(classificationResult.confidence * 100)}% confidence`);
      
      return classificationResult;

    } catch (error) {
      console.error('Error classifying task with Gemini:', error);
      return this.getFallbackClassification(title, description, type);
    }
  }

  private static getFallbackClassification(
    title: string,
    description: string,
    type: string
  ): TaskClassificationResult {
    // Enhanced fallback logic as backup
    const codeKeywords = [
      'code', 'coding', 'programming', 'development', 'algorithm', 'function',
      'implementation', 'software', 'app', 'application', 'website', 'web',
      'javascript', 'python', 'html', 'css', 'react', 'node', 'api',
      'database', 'sql', 'framework', 'library', 'component', 'variable',
      'loop', 'conditional', 'object', 'array', 'class', 'method'
    ];

    const nonCodeKeywords = [
      'biology', 'chemistry', 'physics', 'history', 'literature', 'art',
      'photosynthesis', 'evolution', 'grammar', 'language', 'essay',
      'research', 'analysis', 'theory', 'philosophy', 'psychology'
    ];

    const taskText = `${title} ${description} ${type}`.toLowerCase();
    
    const codeScore = codeKeywords.reduce((score, keyword) => 
      taskText.includes(keyword) ? score + 1 : score, 0);
    
    const nonCodeScore = nonCodeKeywords.reduce((score, keyword) => 
      taskText.includes(keyword) ? score + 1 : score, 0);

    // Exercise and Project types are more likely to be code-related
    const typeBonus = ['exercise', 'project'].includes(type.toLowerCase()) ? 1 : 0;
    
    const finalCodeScore = codeScore + typeBonus;
    const isCodeRelated = finalCodeScore > nonCodeScore && finalCodeScore > 0;
    
    return {
      isCodeRelated,
      confidence: 0.6, // Lower confidence for fallback
      reasoning: `Fallback classification based on keyword analysis (code keywords: ${codeScore}, non-code keywords: ${nonCodeScore})`,
      suggestedLanguages: isCodeRelated ? ['JavaScript', 'Python'] : undefined
    };
  }

  // Clear cache method for testing or manual refresh
  static clearCache(): void {
    this.cache.clear();
    console.log('Task classification cache cleared');
  }

  // Get cache stats for debugging
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
