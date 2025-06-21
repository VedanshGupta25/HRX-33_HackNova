
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Star, CheckCircle, ArrowLeft, BookOpen, Zap, Trophy } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/hooks/use-toast';

const TaskDetails = () => {
  const { taskId, taskType } = useParams();
  const navigate = useNavigate();
  const { completeTask } = useGamification();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock task data - in real app this would come from API/database
  const getTaskContent = () => {
    const taskTypes = {
      reading: {
        title: "Machine Learning: What's the Big Idea?",
        description: "Start your ML journey by exploring the core concept of teaching computers to learn from data without explicit programming.",
        content: {
          introduction: "Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.",
          sections: [
            {
              title: "What is Machine Learning?",
              content: "Machine learning is the science of getting computers to act without being explicitly programmed. It's everywhere - from Netflix recommendations to email spam filters."
            },
            {
              title: "Types of Machine Learning",
              content: "There are three main types: Supervised Learning (learning with examples), Unsupervised Learning (finding patterns), and Reinforcement Learning (learning through trial and error)."
            },
            {
              title: "Real-World Applications",
              content: "ML powers search engines, recommendation systems, image recognition, natural language processing, and autonomous vehicles."
            }
          ],
          keyTakeaways: [
            "ML enables computers to learn from data patterns",
            "Three main types: supervised, unsupervised, and reinforcement learning",
            "Applications span across industries and daily life",
            "Foundation for modern AI technologies"
          ]
        }
      },
      exercise: {
        title: "Hands-on with Supervised Learning: Predicting Pet Types",
        description: "Use a simple dataset to predict whether a pet is a cat or a dog through a guided decision tree example.",
        content: {
          introduction: "In this hands-on exercise, you'll learn supervised learning by building a simple pet classifier using decision trees.",
          sections: [
            {
              title: "Understanding the Dataset",
              content: "We'll use pet characteristics like size, fur color, and behavior to predict if it's a cat or dog. This teaches you how features relate to predictions."
            },
            {
              title: "Building the Decision Tree",
              content: "Step by step, create decision rules like 'If size > 20kg, then likely dog' to understand how algorithms make decisions."
            },
            {
              title: "Testing Your Model",
              content: "Use test data to see how accurate your predictions are and learn about model evaluation metrics."
            }
          ],
          exercises: [
            "Analyze the pet dataset for patterns",
            "Create decision rules based on features",
            "Test your model with new data",
            "Calculate accuracy and understand results"
          ]
        }
      },
      project: {
        title: "Building Your First ML Model: Iris Flower Classification",
        description: "Build a complete machine learning model using Google Colab to classify iris flowers based on measurements.",
        content: {
          introduction: "Create your first end-to-end machine learning project by building an iris flower classifier - a classic beginner project.",
          sections: [
            {
              title: "Project Setup",
              content: "Learn to set up Google Colab, import necessary libraries (pandas, scikit-learn), and load the famous iris dataset."
            },
            {
              title: "Data Exploration",
              content: "Explore the dataset through visualization, understand the features (sepal length, width, petal length, width), and examine the target classes."
            },
            {
              title: "Model Training",
              content: "Split data into training and testing sets, choose an algorithm (Random Forest), train the model, and make predictions."
            },
            {
              title: "Evaluation & Deployment",
              content: "Evaluate model performance using accuracy metrics, confusion matrices, and learn to interpret results for real-world application."
            }
          ],
          deliverables: [
            "Working Colab notebook with complete code",
            "Data visualization charts",
            "Trained model with >90% accuracy",
            "Performance evaluation report"
          ]
        }
      }
    };
    return taskTypes[taskType as keyof typeof taskTypes];
  };

  const taskContent = getTaskContent();

  const handleCompleteTask = () => {
    const result = completeTask('learning');
    setIsCompleted(true);
    
    toast({
      title: "Task Completed! 🎉",
      description: `Great job! You earned ${result.reward.points} points, ${result.reward.xp} XP, and ${result.reward.coins} coins!`,
    });
  };

  const simulateProgress = () => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  useEffect(() => {
    // Start progress simulation when component mounts
    simulateProgress();
  }, []);

  if (!taskContent) {
    return <div>Task not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/tasks')}
            className="mb-6 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Button>

          <Card className="mb-6 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                {taskType === 'reading' && <BookOpen className="h-8 w-8 text-blue-600" />}
                {taskType === 'exercise' && <Zap className="h-8 w-8 text-purple-600" />}
                {taskType === 'project' && <Trophy className="h-8 w-8 text-green-600" />}
                <div>
                  <Badge className="mb-2 capitalize">{taskType}</Badge>
                  <CardTitle className="text-2xl">{taskContent.title}</CardTitle>
                </div>
              </div>
              <CardDescription className="text-lg">
                {taskContent.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Progress Section */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Learning Progress</h3>
                <span className="text-sm text-gray-600">{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-3 mb-4" />
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>30-60 minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Beginner Level</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Sections */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{taskContent.content.introduction}</p>
              </CardContent>
            </Card>

            {taskContent.content.sections.map((section, index) => (
              <Card key={index} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <CardHeader>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}

            {/* Task-specific content with proper type checking */}
            {taskType === 'reading' && 'keyTakeaways' in taskContent.content && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Takeaways</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {taskContent.content.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {taskType === 'exercise' && 'exercises' in taskContent.content && (
              <Card>
                <CardHeader>
                  <CardTitle>Practice Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {taskContent.content.exercises.map((exercise, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{exercise}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {taskType === 'project' && 'deliverables' in taskContent.content && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {taskContent.content.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Trophy className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completion Button */}
          <div className="mt-8 text-center">
            {!isCompleted ? (
              <Button 
                onClick={handleCompleteTask}
                disabled={progress < 100}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg"
              >
                {progress < 100 ? 'Complete Reading First' : 'Mark as Complete & Earn Rewards'}
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 text-green-600 text-lg font-semibold">
                <CheckCircle className="h-6 w-6" />
                Task Completed! 🎉
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TaskDetails;
