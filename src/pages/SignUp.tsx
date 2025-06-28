
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    experienceLevel: '',
    interests: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const interests = [
    'Web Development', 'Mobile Apps', 'Machine Learning',
    'Data Science', 'UI/UX Design', 'Cybersecurity'
  ];

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/');
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            experience_level: formData.experienceLevel,
            interests: formData.interests
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome to EduAI! 🎉",
          description: data.user?.email_confirmed_at 
            ? "Your account has been created successfully!" 
            : "Please check your email to confirm your account.",
        });
        
        // If email is already confirmed, user will be redirected by onAuthStateChange
        if (!data.user?.email_confirmed_at) {
          // Redirect to sign in page for unconfirmed users
          setTimeout(() => navigate('/signin'), 2000);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'github' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Social auth error:', error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Social auth unexpected error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to authenticate with the selected provider.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader className="text-center pb-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Join EduAI</CardTitle>
              <CardDescription className="text-white/90">
                Create your account and start your personalized learning journey
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 p-8">
              {/* Social Sign Up Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={() => handleSocialSignUp('google')}
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 border-gray-300"
                >
                  <Chrome className="h-4 w-4 text-red-500" />
                  Google
                </Button>
                
                <Button 
                  onClick={() => handleSocialSignUp('github')}
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-400 border-gray-300"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
                
                <Button 
                  onClick={() => handleSocialSignUp('facebook')}
                  variant="outline" 
                  className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 border-gray-300"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-gray-500 text-sm">or</span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Experience Level */}
                <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select your interests (optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleInterest(interest)}
                        className={`text-xs justify-start ${
                          formData.interests.includes(interest)
                            ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white border-0'
                            : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                        }`}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
