export interface Reference {
  title: string;
  url: string;
  type: "website" | "video" | "tutorial" | "article" | "book" | "documentation";
}

export interface LearningReference {
  title: string;
  url?: string;
  author?: string;
  description: string;
  relevance: string;
  type: "book" | "website" | "tutorial" | "documentation" | "article";
}

const getTopicInformation = (topic: string, stepTitle: string): LearningReference[] => {
  const topicLower = topic.toLowerCase();
  const stepLower = stepTitle.toLowerCase();
  
  // Generate contextual information based on the step and topic
  if (stepLower.includes('define') && stepLower.includes('scope')) {
    return [
      {
        title: "Project Scope Definition Framework",
        description: "Start by clearly identifying what your project will deliver and what it won't. Define specific deliverables, timelines, and success criteria. Use the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound.",
        relevance: "Essential for establishing clear project boundaries and preventing scope creep",
        type: "tutorial"
      },
      {
        title: "Stakeholder Analysis Technique",
        description: "Identify all project stakeholders and their requirements. Create a stakeholder matrix to understand their influence and interest levels. Document their expectations and constraints.",
        relevance: "Helps ensure all important perspectives are considered in scope definition",
        type: "article"
      },
      {
        title: "Scope Statement Template",
        description: "Create a formal scope statement including: project justification, product description, acceptance criteria, deliverables, exclusions, constraints, and assumptions.",
        relevance: "Provides a structured approach to documenting project scope",
        type: "documentation"
      }
    ];
  }
  
  if (stepLower.includes('break') && stepLower.includes('problem')) {
    return [
      {
        title: "Problem Decomposition Strategy",
        description: "Use the divide-and-conquer approach: break complex problems into smaller, manageable sub-problems. Identify dependencies between components and tackle them in logical order.",
        relevance: "Makes complex problems more approachable and reduces cognitive load",
        type: "tutorial"
      },
      {
        title: "Root Cause Analysis Method",
        description: "Apply the '5 Whys' technique to understand the underlying causes. Create a problem tree diagram showing causes and effects. This helps identify the real issues to address.",
        relevance: "Ensures you're solving the right problem, not just symptoms",
        type: "article"
      },
      {
        title: "Problem Statement Framework",
        description: "Structure your problem statement: What is happening? Where and when does it occur? Who is affected? What is the impact? This creates clarity and focus.",
        relevance: "Provides clear direction for solution development",
        type: "documentation"
      }
    ];
  }
  
  if (stepLower.includes('plan') && stepLower.includes('approach')) {
    return [
      {
        title: "Strategic Planning Framework",
        description: "Use backward planning: start with your end goal and work backwards to identify required steps. Consider resources, timeline, risks, and dependencies at each stage.",
        relevance: "Ensures comprehensive planning and reduces the risk of missing critical steps",
        type: "tutorial"
      },
      {
        title: "Risk Assessment Methodology",
        description: "Identify potential risks, assess their probability and impact, and develop mitigation strategies. Create a risk register to track and monitor throughout execution.",
        relevance: "Helps anticipate and prepare for potential challenges",
        type: "article"
      },
      {
        title: "Resource Allocation Strategy",
        description: "Map required skills, tools, and resources to specific tasks. Consider team capacity, skill gaps, and resource constraints. Plan for resource conflicts and alternatives.",
        relevance: "Ensures realistic planning and successful execution",
        type: "documentation"
      }
    ];
  }
  
  // Default contextual information for other steps
  return [
    {
      title: `${stepTitle} Best Practices`,
      description: `Comprehensive guide covering proven methodologies and techniques for ${stepTitle.toLowerCase()}. Includes practical examples, common pitfalls to avoid, and step-by-step implementation strategies.`,
      relevance: `Directly applicable to your current step: ${stepTitle}`,
      type: "tutorial"
    },
    {
      title: `Implementation Framework`,
      description: `Structured approach to executing ${stepTitle.toLowerCase()} effectively. Covers planning, execution, monitoring, and evaluation phases with clear milestones and checkpoints.`,
      relevance: `Provides systematic methodology for ${stepTitle.toLowerCase()}`,
      type: "article"
    },
    {
      title: `Quality Assurance Guidelines`,
      description: `Standards and criteria for ensuring high-quality results in ${stepTitle.toLowerCase()}. Includes checklists, review processes, and validation techniques.`,
      relevance: `Ensures professional-level outcomes for ${stepTitle.toLowerCase()}`,
      type: "documentation"
    }
  ];
};

export const searchRelevantReferences = async (topic: string): Promise<Reference[]> => {
  try {
    // Return contextual references instead of generic links
    return [
      {
        title: `${topic} Learning Guide`,
        url: "#",
        type: "tutorial"
      },
      {
        title: `${topic} Best Practices`,
        url: "#",
        type: "article"
      },
      {
        title: `${topic} Implementation`,
        url: "#",
        type: "documentation"
      }
    ];
  } catch (error) {
    console.error('Error in searchRelevantReferences:', error);
    return [];
  }
};

export class GeminiSearchService {
  static async getReferencesForStep(
    stepTitle: string, 
    stepDescription: string, 
    taskType: string, 
    difficulty: string
  ): Promise<LearningReference[]> {
    try {
      // Generate contextual information instead of generic links
      const contextualInfo = getTopicInformation(`${taskType} ${difficulty}`, stepTitle);
      
      console.log(`Generated ${contextualInfo.length} contextual references for step: ${stepTitle}`);
      
      return contextualInfo;
    } catch (error) {
      console.error('Error getting references for step:', error);
      
      // Fallback contextual information
      return [
        {
          title: "Step-by-Step Guidance",
          description: `Detailed instructions for completing ${stepTitle.toLowerCase()} effectively. Focus on understanding requirements, planning your approach, and executing with quality.`,
          relevance: "Provides structured approach to this learning step",
          type: "tutorial"
        }
      ];
    }
  }
}
