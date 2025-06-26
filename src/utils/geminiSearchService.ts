export interface Reference {
  title: string;
  url: string;
  type: "website" | "video" | "tutorial" | "article" | "book";
}

const getTopicCategory = (topic: string): string => {
  const topicLower = topic.toLowerCase();
  
  // Finance and Economics
  if (topicLower.includes('financial') || topicLower.includes('market') || 
      topicLower.includes('stock') || topicLower.includes('investment') ||
      topicLower.includes('economy') || topicLower.includes('trading') ||
      topicLower.includes('cryptocurrency') || topicLower.includes('banking')) {
    return 'finance';
  }
  
  // Science (Biology, Chemistry, Physics)
  if (topicLower.includes('photosynthesis') || topicLower.includes('biology') ||
      topicLower.includes('chemistry') || topicLower.includes('physics') ||
      topicLower.includes('science') || topicLower.includes('anatomy') ||
      topicLower.includes('molecule') || topicLower.includes('atom')) {
    return 'science';
  }
  
  // Programming and Web Development
  if (topicLower.includes('javascript') || topicLower.includes('html') ||
      topicLower.includes('css') || topicLower.includes('react') ||
      topicLower.includes('programming') || topicLower.includes('code') ||
      topicLower.includes('web development') || topicLower.includes('api')) {
    return 'programming';
  }
  
  // Mathematics
  if (topicLower.includes('math') || topicLower.includes('calculus') ||
      topicLower.includes('algebra') || topicLower.includes('geometry') ||
      topicLower.includes('statistics') || topicLower.includes('equation')) {
    return 'mathematics';
  }
  
  // History
  if (topicLower.includes('history') || topicLower.includes('historical') ||
      topicLower.includes('ancient') || topicLower.includes('medieval') ||
      topicLower.includes('war') || topicLower.includes('civilization')) {
    return 'history';
  }
  
  return 'general';
};

const getRelevantReferences = (topic: string): Reference[] => {
  const category = getTopicCategory(topic);
  
  switch (category) {
    case 'finance':
      return [
        {
          title: "Financial Markets Overview",
          url: "https://www.investopedia.com/terms/f/financial-market.asp",
          type: "website"
        },
        {
          title: "Market Analysis Guide",
          url: "https://www.investopedia.com/articles/basics/04/100804.asp",
          type: "website"
        },
        {
          title: "Investment Fundamentals",
          url: "https://www.investopedia.com/investing-4427685",
          type: "website"
        }
      ];
      
    case 'science':
      return [
        {
          title: "Khan Academy Biology",
          url: "https://www.khanacademy.org/science/biology",
          type: "website"
        },
        {
          title: "Photosynthesis Explained",
          url: "https://www.khanacademy.org/science/biology/photosynthesis-in-plants",
          type: "website"
        },
        {
          title: "Scientific Method Guide",
          url: "https://www.khanacademy.org/science/intro-to-biology/science-of-biology",
          type: "website"
        }
      ];
      
    case 'programming':
      return [
        {
          title: "MDN Web Docs",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          type: "website"
        },
        {
          title: "JavaScript Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
          type: "website"
        },
        {
          title: "React Documentation",
          url: "https://react.dev/learn",
          type: "website"
        }
      ];
      
    case 'mathematics':
      return [
        {
          title: "Khan Academy Math",
          url: "https://www.khanacademy.org/math",
          type: "website"
        },
        {
          title: "Calculus Fundamentals",
          url: "https://www.khanacademy.org/math/calculus-1",
          type: "website"
        },
        {
          title: "Algebra Basics",
          url: "https://www.khanacademy.org/math/algebra",
          type: "website"
        }
      ];
      
    case 'history':
      return [
        {
          title: "World History Encyclopedia",
          url: "https://www.worldhistory.org/",
          type: "website"
        },
        {
          title: "Khan Academy History",
          url: "https://www.khanacademy.org/humanities/world-history",
          type: "website"
        },
        {
          title: "Historical Timeline",
          url: "https://www.britannica.com/topic/history",
          type: "website"
        }
      ];
      
    default:
      return [
        {
          title: "Wikipedia",
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
          type: "website"
        },
        {
          title: "Britannica Encyclopedia",
          url: `https://www.britannica.com/search?query=${encodeURIComponent(topic)}`,
          type: "website"
        },
        {
          title: "Khan Academy",
          url: "https://www.khanacademy.org/",
          type: "website"
        }
      ];
  }
};

export const searchRelevantReferences = async (topic: string): Promise<Reference[]> => {
  try {
    // Get topic-specific references
    const references = getRelevantReferences(topic);
    
    console.log(`Generated ${references.length} topic-specific references for: ${topic}`);
    console.log('References:', references.map(ref => `${ref.title} (${ref.url})`));
    
    return references;
  } catch (error) {
    console.error('Error in searchRelevantReferences:', error);
    
    // Fallback references based on topic category
    const category = getTopicCategory(topic);
    return getRelevantReferences(topic);
  }
};
