import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Star, 
  PlayCircle, 
  CheckCircle, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Lightbulb,
  Code,
  BookOpen,
  Timer,
  StopCircle
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  type: string;
  xpReward?: number;
  rating?: number;
  duration?: number;
}

interface TaskDisplayProps {
  tasks: Task[];
  onTaskStart?: (taskId: string, taskTitle: string, duration: number) => void;
  onTaskComplete?: (taskId: string, taskTitle: string) => void;
  activeTask?: string | null;
  taskTimers?: {[key: string]: { startTime: Date, duration: number }};
  completedTasks?: Set<string>;
}

export const TaskDisplay: React.FC<TaskDisplayProps> = ({ 
  tasks, 
  onTaskStart,
  onTaskComplete,
  activeTask,
  taskTimers = {},
  completedTasks = new Set()
}) => {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [userRatings, setUserRatings] = useState<{[key: string]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState<{[key: string]: number}>({});

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      const updated: {[key: string]: number} = {};
      
      Object.entries(taskTimers).forEach(([taskId, timer]) => {
        const elapsed = Math.floor((Date.now() - timer.startTime.getTime()) / 1000);
        const remaining = Math.max(0, timer.duration - elapsed);
        updated[taskId] = remaining;
        
        // Auto-complete if time runs out
        if (remaining === 0 && activeTask === taskId && !completedTasks.has(taskId)) {
          const task = tasks.find(t => t.id === taskId);
          if (task && onTaskComplete) {
            onTaskComplete(taskId, task.title);
          }
        }
      });
      
      setTimeRemaining(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [taskTimers, activeTask, completedTasks, tasks, onTaskComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyGradient = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reading': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <PlayCircle className="h-4 w-4" />;
      case 'project': return <CheckCircle className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getTaskHints = (difficulty: string, type: string) => {
    const hints = {
      beginner: {
        reading: ["Start with basic concepts", "Take notes while reading", "Look up unfamiliar terms"],
        exercise: ["Follow step-by-step instructions", "Practice multiple times", "Ask for help when stuck"],
        project: ["Break into small tasks", "Use templates provided", "Focus on learning over perfection"]
      },
      intermediate: {
        reading: ["Connect concepts to prior knowledge", "Analyze examples critically", "Research additional sources"],
        exercise: ["Try variations of problems", "Understand the why behind solutions", "Time yourself for efficiency"],
        project: ["Plan before coding", "Implement core features first", "Document your process"]
      },
      advanced: {
        reading: ["Question assumptions in the material", "Compare different approaches", "Identify real-world applications"],
        exercise: ["Optimize for performance", "Handle edge cases", "Create your own test cases"],
        project: ["Design scalable architecture", "Consider user experience", "Implement best practices"]
      }
    };
    
    return hints[difficulty.toLowerCase() as keyof typeof hints]?.[type.toLowerCase() as keyof typeof hints.beginner] || [];
  };

  const getTemplate = (difficulty: string, type: string) => {
    const templates = {
      beginner: {
        reading: `📚 Step-by-Step Reading Guide:
1. PREVIEW (5 mins)
   - Scan headings and subheadings
   - Look at images, diagrams, and captions
   - Read the introduction and conclusion first
   - Identify key terms in bold or italics

2. ACTIVE READING (Main Time)
   - Read one section at a time
   - Stop after each paragraph to summarize in your own words
   - Take notes using bullet points
   - Ask yourself: "What is the main idea here?"
   - Write down any questions that come up

3. NOTE-TAKING TEMPLATE:
   Topic: _______________
   Main Ideas:
   • Point 1: ________________
   • Point 2: ________________
   • Point 3: ________________
   
   Key Terms:
   • Term 1: Definition
   • Term 2: Definition
   
   Questions I Have:
   • Question 1: ________________
   • Question 2: ________________

4. REVIEW & REFLECT (5 mins)
   - Summarize the entire reading in 2-3 sentences
   - Connect to what you already know
   - Identify what you want to learn more about

💡 Pro Tips:
- Read in a quiet environment
- Take breaks every 15-20 minutes
- Use highlighters for key concepts
- Don't try to memorize everything - focus on understanding`,

        exercise: `💻 Exercise Completion Framework:
1. SETUP PHASE (5 mins)
   - Read all instructions twice before starting
   - Gather all necessary tools/software
   - Create a workspace (folder, files, etc.)
   - Set up your development environment

2. UNDERSTANDING PHASE (10 mins)
   - Break down the problem into smaller parts
   - Identify what you need to achieve
   - Look at any provided examples
   - Write down the steps in plain English

3. IMPLEMENTATION CHECKLIST:
   □ Start with the basics - get something working first
   □ Test each small part before moving on
   □ Follow the examples provided
   □ Don't skip steps - do them in order
   □ Save your work frequently
   □ Comment your code/work as you go

4. TESTING TEMPLATE:
   Test Case 1: Expected _____ Got _____
   Test Case 2: Expected _____ Got _____
   Test Case 3: Expected _____ Got _____

5. TROUBLESHOOTING STEPS:
   - Read error messages carefully
   - Check spelling and syntax
   - Compare with provided examples
   - Try the simplest version first
   - Ask for help if stuck for more than 15 minutes

6. COMPLETION CHECKLIST:
   □ Does it work as expected?
   □ Did I test different scenarios?
   □ Is my code/work clean and organized?
   □ Can I explain what I did?

🎯 Success Metrics:
- Working solution ✓
- Understanding the process ✓
- Ability to reproduce it ✓`,

        project: `🏗️ Beginner Project Blueprint:
1. PLANNING PHASE (15 mins)
   - Read project requirements 3 times
   - List all deliverables needed
   - Break project into 5-7 small tasks
   - Estimate time for each task
   - Identify what you don't know yet

2. PROJECT BREAKDOWN TEMPLATE:
   Project Goal: _______________
   
   Task 1: _______________  (Est: ___ mins)
   Task 2: _______________  (Est: ___ mins)
   Task 3: _______________  (Est: ___ mins)
   Task 4: _______________  (Est: ___ mins)
   Task 5: _______________  (Est: ___ mins)
   
   Learning Goals:
   • What new skill will I gain?
   • What concept will I understand better?

3. IMPLEMENTATION STRATEGY:
   - Start with the simplest part first
   - Get one piece working before moving on
   - Use provided templates and examples
   - Don't try to make it perfect - make it work first
   - Save versions as you progress (v1, v2, v3)

4. QUALITY CHECKLIST:
   □ Meets minimum requirements
   □ Works without errors
   □ Includes all required components
   □ Has been tested with different inputs
   □ Documentation/comments explain the work

5. PRESENTATION PREP:
   - Can you demo it working?
   - Can you explain your approach?
   - What would you do differently next time?
   - What was the most challenging part?

📋 Deliverables:
- Working project files
- Brief explanation of approach
- List of challenges and solutions
- Reflection on learning outcomes

🌟 Remember: Focus on learning over perfection!`
      },
      intermediate: {
        reading: `📖 Advanced Reading Strategy:
1. STRATEGIC PREVIEW (10 mins)
   - Analyze the structure and flow
   - Identify the author's main arguments
   - Look for supporting evidence and examples
   - Note methodology or approach used

2. ANALYTICAL READING PROCESS:
   - Read with specific questions in mind
   - Challenge assumptions and conclusions
   - Connect ideas across different sections
   - Evaluate the strength of arguments
   - Compare with other sources you know

3. ADVANCED NOTE-TAKING:
   Argument Map:
   Main Thesis: _______________
   Supporting Evidence:
   • Evidence 1: _______________
     - Strength: _______________
     - Weakness: _______________
   • Evidence 2: _______________
     - Strength: _______________
     - Weakness: _______________
   
   Critical Questions:
   • What assumptions is the author making?
   • What evidence would strengthen this argument?
   • How does this connect to [related topic]?
   • What are the practical implications?

4. SYNTHESIS & APPLICATION:
   - How can you apply these concepts?
   - What questions remain unanswered?
   - How does this change your understanding?
   - What would you research next?

🎯 Advanced Techniques:
- Create concept maps linking ideas
- Write counter-arguments to strengthen understanding
- Research additional sources for comparison
- Prepare to teach the concept to someone else`,

        exercise: `⚡ Intermediate Problem-Solving Framework:
1. PROBLEM ANALYSIS (15 mins)
   - Understand the problem deeply
   - Identify constraints and requirements
   - Research best practices and approaches
   - Plan your solution architecture

2. SOLUTION DESIGN:
   Problem Breakdown:
   • Core challenge: _______________
   • Sub-problems: _______________
   • Dependencies: _______________
   • Success criteria: _______________
   
   Approach Options:
   Option A: _______________
   Pros: _______________
   Cons: _______________
   
   Option B: _______________
   Pros: _______________
   Cons: _______________
   
   Chosen Approach: _______________
   Reasoning: _______________

3. IMPLEMENTATION STRATEGY:
   - Build incrementally with testing
   - Optimize for readability first
   - Handle edge cases systematically
   - Document complex logic
   - Measure performance where relevant

4. VALIDATION FRAMEWORK:
   Test Categories:
   □ Basic functionality tests
   □ Edge case scenarios
   □ Performance benchmarks
   □ User experience validation
   □ Integration compatibility

5. OPTIMIZATION PHASE:
   - Profile performance bottlenecks
   - Refactor for maintainability
   - Add comprehensive error handling
   - Enhance user feedback mechanisms

💡 Professional Practices:
- Code review your own work
- Write tests before optimizing
- Document your decision-making process
- Consider scalability implications`,

        project: `🚀 Intermediate Project Management:
1. REQUIREMENTS ANALYSIS (20 mins)
   - Define functional requirements
   - Identify non-functional requirements
   - Analyze user stories or use cases
   - Plan technical architecture
   - Assess risks and mitigation strategies

2. PROJECT ARCHITECTURE:
   System Design:
   • Core components: _______________
   • Data flow: _______________
   • External dependencies: _______________
   • Technology stack: _______________
   
   Implementation Phases:
   Phase 1 - MVP: _______________
   Phase 2 - Core Features: _______________
   Phase 3 - Enhancement: _______________
   Phase 4 - Polish: _______________

3. DEVELOPMENT WORKFLOW:
   - Set up version control with meaningful commits
   - Implement feature branches for major components
   - Write tests for critical functionality
   - Regular code reviews and refactoring
   - Continuous integration and testing

4. QUALITY ASSURANCE:
   Code Quality Checklist:
   □ Follows established coding standards
   □ Includes comprehensive error handling
   □ Has appropriate documentation
   □ Passes all test cases
   □ Performs well under expected load
   □ Handles security considerations

5. DEPLOYMENT & DOCUMENTATION:
   - Prepare deployment scripts/configurations
   - Create user documentation
   - Write technical documentation
   - Plan maintenance and updates
   - Gather feedback for improvements

📊 Success Metrics:
- Meets all functional requirements
- Maintains good performance
- Includes proper error handling
- Has comprehensive documentation
- Demonstrates best practices`
      },
      advanced: {
        reading: `🧠 Expert-Level Critical Analysis:
1. CONTEXTUAL ANALYSIS (15 mins)
   - Research author's background and perspective
   - Understand historical/cultural context
   - Identify theoretical frameworks used
   - Analyze intended audience and purpose

2. CRITICAL EVALUATION FRAMEWORK:
   Methodology Assessment:
   • Research methods: _______________
   • Data quality: _______________
   • Statistical significance: _______________
   • Potential biases: _______________
   
   Argument Structure:
   • Logical consistency: _______________
   • Evidence quality: _______________
   • Counter-arguments addressed: _______________
   • Generalizability: _______________

3. COMPARATIVE ANALYSIS:
   Compare with seminal works:
   • How does this advance the field?
   • What gaps does it address?
   • Where does it align/differ from consensus?
   • What new questions does it raise?

4. INNOVATION IDENTIFICATION:
   - Novel approaches or methodologies
   - Paradigm shifts or breakthrough insights
   - Practical applications and implications
   - Future research directions suggested

5. SYNTHESIS & CONTRIBUTION:
   - Integrate with existing knowledge base
   - Identify actionable insights
   - Develop original perspectives
   - Plan follow-up research or application

🔬 Advanced Techniques:
- Meta-analysis of multiple sources
- Interdisciplinary connections
- Original hypothesis generation
- Policy or practice recommendations`,

        exercise: `🔬 Advanced Problem-Solving Methodology:
1. COMPREHENSIVE PROBLEM MODELING (20 mins)
   - Define problem space and boundaries
   - Model system interactions and dependencies
   - Identify optimization criteria
   - Analyze computational complexity
   - Research state-of-the-art solutions

2. MULTI-APPROACH DESIGN:
   Algorithm Design:
   • Time complexity target: _______________
   • Space complexity constraints: _______________
   • Scalability requirements: _______________
   • Fault tolerance needs: _______________
   
   Solution Alternatives:
   Approach 1: _______________
   Trade-offs: _______________
   Use cases: _______________
   
   Approach 2: _______________
   Trade-offs: _______________
   Use cases: _______________
   
   Hybrid Approach: _______________
   Optimization strategy: _______________

3. IMPLEMENTATION EXCELLENCE:
   - Implement multiple algorithms for comparison
   - Create comprehensive test suites
   - Build performance benchmarking tools
   - Design for extensibility and maintenance
   - Include detailed logging and monitoring

4. ADVANCED VALIDATION:
   Testing Strategy:
   □ Unit tests with 100% coverage
   □ Integration tests for system interactions
   □ Load testing under various conditions
   □ Chaos engineering for resilience
   □ Security vulnerability assessment
   □ Usability testing with real users

5. OPTIMIZATION & INNOVATION:
   - Profile and optimize critical paths
   - Implement advanced algorithms/data structures
   - Design novel solutions for unique constraints
   - Contribute to open source or research community

🏆 Excellence Standards:
- Publishable quality implementation
- Comprehensive documentation and examples
- Reusable components and libraries
- Performance benchmarks and comparisons
- Novel contributions to the field`,

        project: `🏆 Professional-Grade Project Development:
1. STRATEGIC PROJECT DESIGN (30 mins)
   - Conduct stakeholder analysis
   - Define success metrics and KPIs
   - Create technical specification document
   - Design system architecture and APIs
   - Plan scalability and security from the start

2. ENTERPRISE ARCHITECTURE:
   System Design Document:
   • Microservices architecture: _______________
   • Database design: _______________
   • API specifications: _______________
   • Security framework: _______________
   • Monitoring and logging: _______________
   • Deployment strategy: _______________
   
   Technology Stack Justification:
   • Frontend: _______________
   • Backend: _______________
   • Database: _______________
   • Infrastructure: _______________
   • Reasoning for each choice: _______________

3. PROFESSIONAL DEVELOPMENT PROCESS:
   - Implement CI/CD pipeline
   - Use infrastructure as code
   - Implement comprehensive testing strategy
   - Set up monitoring and alerting
   - Plan disaster recovery procedures
   - Document everything thoroughly

4. QUALITY ASSURANCE FRAMEWORK:
   Code Standards:
   □ Follows industry best practices
   □ Implements design patterns appropriately
   □ Includes comprehensive error handling
   □ Has 90%+ test coverage
   □ Passes security audits
   □ Meets performance benchmarks
   □ Includes accessibility features
   □ Supports internationalization

5. PRODUCTION DEPLOYMENT:
   Launch Checklist:
   □ Load testing completed
   □ Security penetration testing passed
   □ Backup and recovery procedures tested
   □ Monitoring dashboards configured
   □ Documentation completed
   □ Team training conducted
   □ Rollback procedures defined
   □ Post-launch support plan ready

6. CONTINUOUS IMPROVEMENT:
   - Implement user feedback collection
   - Set up A/B testing framework
   - Plan feature roadmap based on metrics
   - Contribute learnings back to community
   - Mentor others on project insights

🎯 Professional Excellence:
- Production-ready, scalable solution
- Comprehensive documentation and training
- Measurable business impact
- Industry best practices demonstrated
- Knowledge sharing and mentorship`
      }
    };
    
    return templates[difficulty.toLowerCase() as keyof typeof templates]?.[type.toLowerCase() as keyof typeof templates.beginner] || "Template not available";
  };

  const handleRating = (taskId: string, rating: number) => {
    setUserRatings(prev => ({ ...prev, [taskId]: rating }));
  };

  const renderStars = (taskId: string, currentRating?: number) => {
    const rating = userRatings[taskId] || currentRating || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-colors ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => handleRating(taskId, star)}
          />
        ))}
        <span className="text-sm text-gray-600 ml-2">({rating}/5)</span>
      </div>
    );
  };

  const handleTaskStart = (task: Task) => {
    if (onTaskStart && task.duration) {
      onTaskStart(task.id, task.title, task.duration);
    }
  };

  const handleTaskComplete = (task: Task) => {
    if (onTaskComplete) {
      onTaskComplete(task.id, task.title);
    }
  };

  // Group tasks by difficulty
  const groupedTasks = tasks.reduce((acc, task) => {
    const difficulty = task.difficulty.toLowerCase();
    if (!acc[difficulty]) acc[difficulty] = [];
    acc[difficulty].push(task);
    return acc;
  }, {} as {[key: string]: Task[]});

  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Learning Journey
        </h2>
        <p className="text-gray-600">
          Progress through three levels of difficulty at your own pace
        </p>
      </div>

      {difficultyOrder.map((difficulty, levelIndex) => {
        const levelTasks = groupedTasks[difficulty] || [];
        if (levelTasks.length === 0) return null;

        return (
          <div 
            key={difficulty}
            className="space-y-4"
            style={{ animationDelay: `${levelIndex * 300}ms` }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getDifficultyGradient(difficulty)} text-white font-semibold text-lg shadow-lg`}>
                Level {levelIndex + 1}: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-gray-200 to-transparent rounded"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {levelTasks.map((task, taskIndex) => (
                <Card 
                  key={task.id}
                  className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white/95 backdrop-blur-sm border-0 shadow-lg overflow-hidden ${
                    completedTasks.has(task.id) ? 'ring-2 ring-green-400' : ''
                  } ${
                    activeTask === task.id ? 'ring-2 ring-blue-400 animate-pulse' : ''
                  }`}
                  style={{ animationDelay: `${(levelIndex * 300) + (taskIndex * 150)}ms` }}
                >
                  <CardHeader className="pb-3 relative">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getDifficultyGradient(difficulty)}`}></div>
                    
                    {/* Timer Display */}
                    {activeTask === task.id && timeRemaining[task.id] !== undefined && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {formatTime(timeRemaining[task.id])}
                      </div>
                    )}

                    {/* Completion Badge */}
                    {completedTasks.has(task.id) && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mt-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        {getTypeIcon(task.type)}
                        <span className="text-sm font-medium">{task.type}</span>
                      </div>
                      <Badge className={`${getDifficultyColor(task.difficulty)} border text-xs`}>
                        {task.difficulty}
                      </Badge>
                    </div>

                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {task.description}
                    </CardDescription>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.estimatedTime}
                      </div>
                      {task.xpReward && (
                        <div className="flex items-center gap-1 text-purple-600">
                          <Zap className="h-4 w-4" />
                          +{task.xpReward} XP
                        </div>
                      )}
                    </div>

                    {/* Progress Bar for Active Tasks */}
                    {activeTask === task.id && timeRemaining[task.id] !== undefined && (
                      <div className="mt-3">
                        <Progress 
                          value={((taskTimers[task.id].duration - timeRemaining[task.id]) / taskTimers[task.id].duration) * 100}
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Star Rating */}
                    <div className="pt-2">
                      {renderStars(task.id, task.rating)}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      {!completedTasks.has(task.id) ? (
                        <>
                          {activeTask === task.id ? (
                            <Button 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white transition-all transform hover:scale-105"
                              onClick={() => handleTaskComplete(task)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          ) : (
                            <Button 
                              className={`bg-gradient-to-r ${getDifficultyGradient(difficulty)} hover:shadow-lg text-white transition-all transform hover:scale-105`}
                              onClick={() => handleTaskStart(task)}
                              disabled={activeTask !== null && activeTask !== task.id}
                            >
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Start Task
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="col-span-2 flex items-center justify-center py-2 bg-green-50 rounded-lg text-green-700 font-semibold">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Task Completed!
                        </div>
                      )}
                      
                      <Button 
                        variant="outline"
                        onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        {expandedTask === task.id ? 'Hide' : 'Guide'}
                      </Button>
                    </div>

                    {/* Expandable Content */}
                    <Collapsible open={expandedTask === task.id}>
                      <CollapsibleContent className="space-y-4 animate-accordion-down">
                        {/* Hints Section */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            <h4 className="font-semibold text-blue-800">Helpful Hints</h4>
                          </div>
                          <ul className="space-y-1">
                            {getTaskHints(task.difficulty, task.type).map((hint, index) => (
                              <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                                {hint}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Template Section */}
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Code className="h-4 w-4 text-green-600" />
                            <h4 className="font-semibold text-green-800">Step-by-Step Template Guide</h4>
                          </div>
                          <pre className="text-sm text-green-700 whitespace-pre-wrap font-mono bg-white/50 p-3 rounded border max-h-96 overflow-y-auto">
                            {getTemplate(task.difficulty, task.type)}
                          </pre>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {Object.keys(groupedTasks).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks generated yet. Enter a topic above to get started!</p>
        </div>
      )}
    </div>
  );
};
