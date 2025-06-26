
import { GeminiApiService } from './geminiApi';

export interface LearningReference {
  type: 'book' | 'website' | 'tutorial' | 'documentation';
  title: string;
  url?: string;
  author?: string;
  description: string;
  relevance: string;
}

export class GeminiSearchService {
  static async getReferencesForStep(
    stepTitle: string,
    stepDescription: string,
    taskType: string,
    difficulty: string
  ): Promise<LearningReference[]> {
    try {
      const searchPrompt = `Find specific references for learning about "${stepTitle}" in the context of ${taskType} at ${difficulty} level. 

Step details: ${stepDescription}

Please provide:
1. Specific book recommendations with titles and authors
2. High-quality websites and online resources with URLs
3. Tutorials and documentation links
4. Make sure all recommendations are current and accessible

Format the response as a JSON array with objects containing:
- type: "book" | "website" | "tutorial" | "documentation"
- title: string
- url?: string (for online resources)
- author?: string (for books)
- description: string
- relevance: string (why this resource is useful for this step)

Focus on practical, actionable resources that directly help with "${stepTitle}".`;

      const response = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchPrompt,
          includeWeb: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch references');
      }

      const result = await response.json();
      
      // Parse the JSON response from Gemini
      try {
        const references = JSON.parse(result.content);
        return Array.isArray(references) ? references : [];
      } catch (parseError) {
        console.warn('Failed to parse references JSON, returning fallback');
        return this.getFallbackReferences(stepTitle, taskType);
      }
    } catch (error) {
      console.error('Error fetching references:', error);
      return this.getFallbackReferences(stepTitle, taskType);
    }
  }

  private static getFallbackReferences(stepTitle: string, taskType: string): LearningReference[] {
    const baseReferences: LearningReference[] = [];

    // Add general programming references for coding tasks
    if (taskType.toLowerCase().includes('exercise') || taskType.toLowerCase().includes('project')) {
      baseReferences.push(
        {
          type: 'book',
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          description: 'Essential principles for writing maintainable and readable code',
          relevance: 'Provides fundamental coding best practices'
        },
        {
          type: 'website',
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org',
          description: 'Comprehensive web development documentation',
          relevance: 'Official documentation for web technologies'
        },
        {
          type: 'website',
          title: 'Stack Overflow',
          url: 'https://stackoverflow.com',
          description: 'Community-driven programming Q&A platform',
          relevance: 'Find solutions to specific programming problems'
        }
      );
    }

    // Add reading-specific references
    if (taskType.toLowerCase().includes('reading')) {
      baseReferences.push(
        {
          type: 'website',
          title: 'Khan Academy',
          url: 'https://www.khanacademy.org',
          description: 'Free online courses and learning materials',
          relevance: 'Structured learning paths for various topics'
        },
        {
          type: 'website',
          title: 'Coursera',
          url: 'https://www.coursera.org',
          description: 'Online courses from top universities and companies',
          relevance: 'High-quality educational content and certifications'
        }
      );
    }

    return baseReferences;
  }
}
