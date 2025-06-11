// Generated on 2025-01-27
'use client';

import { motion } from 'framer-motion';
import { TopNavbar } from '@/components/landing/TopNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Github, 
  Mail, 
  Lock, 
  User,
  ArrowRight,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Sign In page with modern authentication options
 * 
 * Features social login and secure authentication
 * Dark theme with yellow neon accents for consistent branding
 * 
 * @returns {JSX.Element} The rendered sign in page
 */
export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Features & Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.h1 
                className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(241, 196, 15, 0.3)",
                    "0 0 20px rgba(241, 196, 15, 0.5)",
                    "0 0 10px rgba(241, 196, 15, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Welcome back to <span className="text-primary neon-text">DeanMachines</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Sign in to access your AI-powered development workspace and continue building intelligent applications.
              </motion.p>
            </div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="flex items-start gap-4 p-4 rounded-lg glass-effect border border-primary/10"
                whileHover={{ scale: 1.02, borderColor: "rgba(241, 196, 15, 0.3)" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="text-primary bg-primary/10 p-2 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">Bank-grade encryption and security protocols</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:text-primary/80 neon-text font-medium">
                Sign up for free
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Sign In Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="glass-effect border-primary/20 neon-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary neon-text">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Login Options */}
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full glass-effect border-primary/30 hover:border-primary/60"
                      disabled={isLoading}
                    >
                      <Github className="w-5 h-5 mr-2" />
                      Continue with GitHub
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full glass-effect border-primary/30 hover:border-primary/60"
                      disabled={isLoading}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Continue with Google
                    </Button>
                  </motion.div>
                </div>

                <div className="relative">
                  <Separator className="bg-primary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge variant="secondary" className="glass-effect px-3">
                      or continue with email
                    </Badge>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 glass-effect border-primary/30 focus:border-primary/60"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="password" className="text-foreground">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 glass-effect border-primary/30 focus:border-primary/60"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </motion.div>

                  <div className="flex items-center justify-between text-sm">
                    <Label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-primary/30 text-primary focus:ring-primary/20"
                        aria-label="Remember me for future sign-ins"
                      />
                      <span className="text-muted-foreground">Remember me</span>
                    </Label>
                    <Link 
                      href="/forgot-password" 
                      className="text-primary hover:text-primary/80 neon-text"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Footer */}
                <div className="text-center text-xs text-muted-foreground">
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:text-primary/80 neon-text">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 neon-text">
                    Privacy Policy
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}