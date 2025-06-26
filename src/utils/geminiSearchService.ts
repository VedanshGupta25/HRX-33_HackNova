
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
  private static cache = new Map<string, LearningReference[]>();
  private static readonly GEMINI_API_KEY = 'AIzaSyAE5FLtFYjCFLHonUVoHY9htSY5AucS48U';
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  static async getReferencesForStep(
    stepTitle: string,
    stepDescription: string,
    taskType: string,
    difficulty: string
  ): Promise<LearningReference[]> {
    // Create cache key
    const cacheKey = `${stepTitle}_${taskType}_${difficulty}`.toLowerCase();
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log('Using cached references for:', stepTitle);
      return this.cache.get(cacheKey)!;
    }

    try {
      const searchPrompt = `Find specific, relevant references for learning about "${stepTitle}" in the context of ${taskType} at ${difficulty} level.

Step details: ${stepDescription}

IMPORTANT: Provide topic-specific resources, not generic coding resources unless this is explicitly a programming task.

For NON-PROGRAMMING topics (like finance, biology, history, etc.), provide:
- Academic textbooks and educational resources
- Specialized websites and portals
- Educational institutions and courses
- Industry-specific documentation

For PROGRAMMING topics, provide:
- Technical documentation and coding resources
- Programming books and tutorials
- Developer platforms and tools

Format response as JSON array with objects containing:
- "type": "book" | "website" | "tutorial" | "documentation"
- "title": string (specific and relevant)
- "url": string (real, working URLs when possible)
- "author": string (for books)
- "description": string (detailed description)
- "relevance": string (why this is useful for this specific topic)

Return exactly 3-5 high-quality, topic-specific references.`;

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: searchPrompt
            }]
          }]
        })
      });

      if (!response.ok) {
        console.warn(`Gemini API error: ${response.status}, using intelligent fallback`);
        return this.getIntelligentFallbackReferences(stepTitle, stepDescription, taskType, difficulty);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.warn('Invalid Gemini response, using intelligent fallback');
        return this.getIntelligentFallbackReferences(stepTitle, stepDescription, taskType, difficulty);
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON found in Gemini response, using intelligent fallback');
        return this.getIntelligentFallbackReferences(stepTitle, stepDescription, taskType, difficulty);
      }
      
      const references = JSON.parse(jsonMatch[0]);
      const validReferences = Array.isArray(references) ? references : [];
      
      // Cache successful results
      if (validReferences.length > 0) {
        this.cache.set(cacheKey, validReferences);
      }
      
      return validReferences;

    } catch (error) {
      console.error('Error fetching references:', error);
      return this.getIntelligentFallbackReferences(stepTitle, stepDescription, taskType, difficulty);
    }
  }

  private static getIntelligentFallbackReferences(
    stepTitle: string,
    stepDescription: string,
    taskType: string,
    difficulty: string
  ): LearningReference[] {
    const combinedText = `${stepTitle} ${stepDescription}`.toLowerCase();
    
    // Detect topic categories
    const isFinance = this.detectFinancialTopic(combinedText);
    const isBiology = this.detectBiologyTopic(combinedText);
    const isHistory = this.detectHistoryTopic(combinedText);
    const isScience = this.detectScienceTopic(combinedText);
    const isProgramming = this.detectProgrammingTopic(combinedText, taskType);
    const isMath = this.detectMathTopic(combinedText);
    const isLanguage = this.detectLanguageTopic(combinedText);

    // Return topic-specific references
    if (isFinance) {
      return this.getFinancialReferences(stepTitle, difficulty);
    } else if (isBiology) {
      return this.getBiologyReferences(stepTitle, difficulty);
    } else if (isHistory) {
      return this.getHistoryReferences(stepTitle, difficulty);
    } else if (isScience) {
      return this.getScienceReferences(stepTitle, difficulty);
    } else if (isProgramming) {
      return this.getProgrammingReferences(stepTitle, difficulty);
    } else if (isMath) {
      return this.getMathReferences(stepTitle, difficulty);
    } else if (isLanguage) {
      return this.getLanguageReferences(stepTitle, difficulty);
    }

    // Default educational references
    return this.getGeneralEducationalReferences(stepTitle, difficulty);
  }

  private static detectFinancialTopic(text: string): boolean {
    const financialKeywords = [
      'financial', 'finance', 'money', 'investment', 'stock', 'bond', 'dividend',
      'market', 'trading', 'economy', 'economic', 'banking', 'credit', 'debt',
      'portfolio', 'asset', 'liability', 'revenue', 'profit', 'budget', 'accounting'
    ];
    return financialKeywords.some(keyword => text.includes(keyword));
  }

  private static detectBiologyTopic(text: string): boolean {
    const biologyKeywords = [
      'biology', 'biological', 'photosynthesis', 'cell', 'organism', 'genetics',
      'evolution', 'ecosystem', 'dna', 'rna', 'protein', 'enzyme', 'bacteria',
      'virus', 'plant', 'animal', 'species', 'habitat', 'biodiversity'
    ];
    return biologyKeywords.some(keyword => text.includes(keyword));
  }

  private static detectHistoryTopic(text: string): boolean {
    const historyKeywords = [
      'history', 'historical', 'ancient', 'medieval', 'renaissance', 'revolution',
      'war', 'civilization', 'culture', 'empire', 'dynasty', 'century', 'era',
      'timeline', 'event', 'historical figure'
    ];
    return historyKeywords.some(keyword => text.includes(keyword));
  }

  private static detectScienceTopic(text: string): boolean {
    const scienceKeywords = [
      'science', 'scientific', 'physics', 'chemistry', 'astronomy', 'geology',
      'experiment', 'hypothesis', 'theory', 'research', 'laboratory', 'analysis'
    ];
    return scienceKeywords.some(keyword => text.includes(keyword));
  }

  private static detectProgrammingTopic(text: string, taskType: string): boolean {
    const programmingKeywords = [
      'code', 'coding', 'programming', 'development', 'software', 'algorithm',
      'javascript', 'python', 'html', 'css', 'react', 'api', 'database', 'function'
    ];
    return programmingKeywords.some(keyword => text.includes(keyword)) || 
           ['exercise', 'project'].includes(taskType.toLowerCase());
  }

  private static detectMathTopic(text: string): boolean {
    const mathKeywords = [
      'math', 'mathematics', 'algebra', 'geometry', 'calculus', 'statistics',
      'equation', 'formula', 'theorem', 'proof', 'number', 'arithmetic'
    ];
    return mathKeywords.some(keyword => text.includes(keyword));
  }

  private static detectLanguageTopic(text: string): boolean {
    const languageKeywords = [
      'language', 'grammar', 'vocabulary', 'literature', 'writing', 'reading',
      'english', 'spanish', 'french', 'german', 'chinese', 'linguistic'
    ];
    return languageKeywords.some(keyword => text.includes(keyword));
  }

  private static getFinancialReferences(stepTitle: string, difficulty: string): LearningReference[] {
    const baseReferences = [
      {
        type: 'book' as const,
        title: 'The Intelligent Investor',
        author: 'Benjamin Graham',
        description: 'Classic guide to value investing and financial market principles',
        relevance: 'Fundamental concepts for understanding financial markets and investment strategies'
      },
      {
        type: 'website' as const,
        title: 'Investopedia',
        url: 'https://www.investopedia.com',
        description: 'Comprehensive financial education and market analysis',
        relevance: 'Detailed explanations of financial terms and market concepts'
      },
      {
        type: 'website' as const,
        title: 'SEC Investor.gov',
        url: 'https://www.investor.gov',
        description: 'Official U.S. Securities and Exchange Commission investor education',
        relevance: 'Authoritative source for investment basics and market regulations'
      }
    ];

    if (difficulty.toLowerCase() === 'beginner') {
      baseReferences.push({
        type: 'tutorial' as const,
        title: 'Khan Academy Personal Finance',
        url: 'https://www.khanacademy.org/college-careers-more/personal-finance',
        description: 'Free basic financial literacy course',
        relevance: 'Step-by-step introduction to financial concepts for beginners'
      });
    }

    return baseReferences;
  }

  private static getBiologyReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'book',
        title: 'Campbell Biology',
        author: 'Jane Reece',
        description: 'Comprehensive biology textbook covering all major topics',
        relevance: 'Standard reference for biological concepts and processes'
      },
      {
        type: 'website',
        title: 'Khan Academy Biology',
        url: 'https://www.khanacademy.org/science/biology',
        description: 'Free biology courses with videos and practice exercises',
        relevance: 'Interactive learning platform for biological concepts'
      },
      {
        type: 'website',
        title: 'Nature Education',
        url: 'https://www.nature.com/scitable',
        description: 'Scientific articles and educational resources from Nature',
        relevance: 'Peer-reviewed content on current biological research and concepts'
      }
    ];
  }

  private static getHistoryReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'website',
        title: 'Smithsonian National Museum of American History',
        url: 'https://americanhistory.si.edu',
        description: 'Extensive collection of historical artifacts and educational materials',
        relevance: 'Primary sources and expert analysis of historical events'
      },
      {
        type: 'website',
        title: 'BBC History',
        url: 'https://www.bbc.co.uk/history',
        description: 'Comprehensive historical articles and documentaries',
        relevance: 'Well-researched historical content with multimedia resources'
      },
      {
        type: 'book',
        title: 'A People\'s History of the World',
        author: 'Chris Harman',
        description: 'Global perspective on historical events and social movements',
        relevance: 'Broad understanding of historical patterns and human societies'
      }
    ];
  }

  private static getScienceReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'website',
        title: 'NASA Educational Resources',
        url: 'https://www.nasa.gov/audience/foreducators',
        description: 'Scientific educational materials and current research',
        relevance: 'Authoritative source for space science and earth science concepts'
      },
      {
        type: 'website',
        title: 'National Geographic Education',
        url: 'https://education.nationalgeographic.org',
        description: 'Science education resources with visual content',
        relevance: 'Engaging multimedia approach to scientific concepts'
      },
      {
        type: 'book',
        title: 'The Structure of Scientific Revolutions',
        author: 'Thomas Kuhn',
        description: 'Philosophical examination of how scientific knowledge develops',
        relevance: 'Understanding the nature of scientific inquiry and discovery'
      }
    ];
  }

  private static getProgrammingReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'book',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        description: 'Best practices for writing maintainable and readable code',
        relevance: 'Essential principles for professional software development'
      },
      {
        type: 'website',
        title: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        description: 'Comprehensive web development documentation',
        relevance: 'Official documentation for web technologies and APIs'
      },
      {
        type: 'website',
        title: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        description: 'Programming Q&A community platform',
        relevance: 'Find solutions to specific programming problems and challenges'
      }
    ];
  }

  private static getMathReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'website',
        title: 'Khan Academy Mathematics',
        url: 'https://www.khanacademy.org/math',
        description: 'Comprehensive math courses from basic to advanced topics',
        relevance: 'Step-by-step video lessons and practice exercises'
      },
      {
        type: 'book',
        title: 'Principles of Mathematical Analysis',
        author: 'Walter Rudin',
        description: 'Rigorous introduction to mathematical analysis',
        relevance: 'Foundation for advanced mathematical thinking and proofs'
      },
      {
        type: 'website',
        title: 'Wolfram MathWorld',
        url: 'https://mathworld.wolfram.com',
        description: 'Comprehensive mathematics reference',
        relevance: 'Detailed mathematical definitions and theorem explanations'
      }
    ];
  }

  private static getLanguageReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'website',
        title: 'Duolingo',
        url: 'https://www.duolingo.com',
        description: 'Interactive language learning platform',
        relevance: 'Gamified approach to language acquisition and vocabulary building'
      },
      {
        type: 'book',
        title: 'The Elements of Style',
        author: 'Strunk and White',
        description: 'Classic guide to English writing and grammar',
        relevance: 'Essential principles for clear and effective writing'
      },
      {
        type: 'website',
        title: 'Grammar Girl',
        url: 'https://www.quickanddirtytips.com/grammar-girl',
        description: 'Grammar and writing tips in easy-to-understand format',
        relevance: 'Practical advice for improving writing skills and grammar'
      }
    ];
  }

  private static getGeneralEducationalReferences(stepTitle: string, difficulty: string): LearningReference[] {
    return [
      {
        type: 'website',
        title: 'Coursera',
        url: 'https://www.coursera.org',
        description: 'Online courses from top universities and companies',
        relevance: 'Structured learning paths with expert instruction and certifications'
      },
      {
        type: 'website',
        title: 'edX',
        url: 'https://www.edx.org',
        description: 'Free online courses from leading institutions',
        relevance: 'High-quality educational content across multiple disciplines'
      },
      {
        type: 'website',
        title: 'TED-Ed',
        url: 'https://ed.ted.com',
        description: 'Educational videos and lessons on diverse topics',
        relevance: 'Engaging visual content to support learning and understanding'
      }
    ];
  }

  // Clear cache method for testing or manual refresh
  static clearCache(): void {
    this.cache.clear();
    console.log('References cache cleared');
  }

  // Get cache stats for debugging
  static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
