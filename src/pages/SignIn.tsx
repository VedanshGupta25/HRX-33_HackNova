
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, Facebook, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      console.log('User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting to sign in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        let errorMessage = "An error occurred during sign in.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and click the confirmation link.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many sign in attempts. Please wait a moment and try again.";
        } else {
          errorMessage = error.message;
        }
        
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else if (data.user) {
        console.log('Sign in successful:', data.user.id);
        toast({
          title: "Welcome back! 🎉",
          description: "You have successfully signed in.",
        });
        // Navigation will be handled by the auth context
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github' | 'facebook') => {
    setSocialLoading(provider);
    
    try {
      console.log('Attempting social sign in with:', provider);
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
          description: error.message || `Failed to authenticate with ${provider}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Social auth unexpected error:', error);
      toast({
        title: "Authentication Error",
        description: `Failed to authenticate with ${provider}.`,
        variant: "destructive",
      });
    } finally {
      setSocialLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-black/30 backdrop-blur-md border-purple-500/30 shadow-xl">
            <CardHeader className="text-center pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-white/90">
                Sign in to continue your learning journey
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 p-8">
              {/* Social Sign In Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => handleSocialSignIn('google')}
                  variant="outline" 
                  className="w-full flex items-center gap-3 hover:bg-red-50 hover:border-red-300 border-purple-500/50 text-white hover:text-red-600"
                  disabled={socialLoading === 'google'}
                >
                  {socialLoading === 'google' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Chrome className="h-5 w-5 text-red-500" />
                  )}
                  Continue with Google
                </Button>
                
                <Button 
                  onClick={() => handleSocialSignIn('github')}
                  variant="outline" 
                  className="w-full flex items-center gap-3 hover:bg-gray-50 hover:border-gray-400 border-purple-500/50 text-white hover:text-gray-800"
                  disabled={socialLoading === 'github'}
                >
                  {socialLoading === 'github' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Github className="h-5 w-5" />
                  )}
                  Continue with GitHub
                </Button>
                
                <Button 
                  onClick={() => handleSocialSignIn('facebook')}
                  variant="outline" 
                  className="w-full flex items-center gap-3 hover:bg-blue-50 hover:border-blue-300 border-purple-500/50 text-white hover:text-blue-600"
                  disabled={socialLoading === 'facebook'}
                >
                  {socialLoading === 'facebook' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Facebook className="h-5 w-5 text-blue-600" />
                  )}
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <Separator className="bg-purple-500/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black px-2 text-gray-300 text-sm">or</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-purple-500/50 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-purple-500/50 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-white" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-300">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-purple-400 hover:text-purple-300">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-300">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
