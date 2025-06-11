// Generated on 2025-06-11
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TopNavbar } from '@/components/landing/TopNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Eye,
  EyeOff,
  Github,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  Building,
  Sparkles,
  Crown
} from 'lucide-react';
import Link from 'next/link';

/**
 * Sign Up page with modern registration flow
 * Features multi-step registration, password strength indicator, and plan selection
 * Dark theme with yellow neon accents for consistent branding
 * @returns {JSX.Element} The rendered sign up page
 */
export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep(2);
  };

  const socialProviders = [
    {
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      color: 'bg-gray-900 hover:bg-gray-800',
      description: 'Continue with GitHub'
    },
    {
      name: 'Google',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Continue with Google'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        '3 AI Agents',
        '1,000 API calls/month',
        'Basic memory storage',
        'Community support'
      ],
      icon: <Sparkles className="w-6 h-6" />,
      popular: false
    },
    {
      name: 'Pro',
      price: '$29/month',
      description: 'For growing teams',
      features: [
        'Unlimited AI Agents',
        '50,000 API calls/month',
        'Advanced memory systems',
        'Priority support',
        'Custom integrations'
      ],
      icon: <Zap className="w-6 h-6" />,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Unlimited API calls',
        'Dedicated infrastructure',
        '24/7 phone support',
        'Custom training'
      ],
      icon: <Crown className="w-6 h-6" />,
      popular: false
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant with end-to-end encryption"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Setup",
      description: "Deploy your first AI agent in under 5 minutes"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "No Lock-in",
      description: "Export your data anytime, cancel with one click"
    }
  ];

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
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
              Choose Your <span className="text-primary neon-text">Plan</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Select the perfect plan for your needs. You can always upgrade or downgrade later.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground neon-glow">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card className={`glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300 h-full ${plan.popular ? 'neon-glow scale-105' : ''}`}>
                    <CardHeader className="text-center">
                      <div className="mx-auto text-primary bg-primary/10 p-3 rounded-lg w-fit mb-4">
                        {plan.icon}
                      </div>
                      <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="text-3xl font-bold text-primary neon-text mt-4">{plan.price}</div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm">
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow' : 'glass-effect border-primary/30 hover:border-primary/60'}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-12 text-center"
            >
              <p className="text-muted-foreground mb-4">
                All plans include a 14-day free trial. No credit card required.
              </p>
              <Button asChild variant="outline" className="glass-effect border-primary/30 hover:border-primary/60">
                <Link href="/signin">
                  Already have an account? Sign in
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Benefits & Branding */}
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
                Join <span className="text-primary neon-text">DeanMachines</span> today
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Create your account and start building intelligent applications with AI agents, advanced memory, and powerful integrations.
              </motion.p>
            </div>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.title}
                  className="flex items-start gap-4 p-4 rounded-lg glass-effect border border-primary/10"
                  whileHover={{ scale: 1.02, borderColor: "rgba(241, 196, 15, 0.3)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-primary bg-primary/10 p-2 rounded-lg">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-sm text-muted-foreground"
            >
              Already have an account?{' '}
              <Link href="/signin" className="text-primary hover:text-primary/80 neon-text font-medium">
                Sign in here
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="glass-effect border-primary/20 neon-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary neon-text">Create Account</CardTitle>
                <CardDescription>
                  Start your 14-day free trial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Sign Up Options */}
                <div className="space-y-3">
                  {socialProviders.map((provider) => (
                    <motion.div
                      key={provider.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full glass-effect border-primary/30 hover:border-primary/60 ${provider.color} text-white`}
                        disabled={isLoading}
                      >
                        {provider.icon}
                        <span className="ml-2">{provider.description}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="relative">
                  <Separator className="bg-primary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge variant="secondary" className="glass-effect px-3">
                      or sign up with email
                    </Badge>
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="fullName" className="text-foreground">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="pl-10 glass-effect border-primary/30 focus:border-primary/60"
                        required
                        title="Your full name"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 glass-effect border-primary/30 focus:border-primary/60"
                        required
                        title="Your email address"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="company" className="text-foreground">
                      Company (Optional)
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Acme Inc."
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="pl-10 glass-effect border-primary/30 focus:border-primary/60"
                        title="Your company name"
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
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 glass-effect border-primary/30 focus:border-primary/60"
                        required
                        title="Your password"
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
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Password strength:</span>
                          <span className={`font-medium ${passwordStrength < 50 ? 'text-red-500' : passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <Progress value={passwordStrength} className={`h-2 ${getPasswordStrengthColor()}`} />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword" className="text-foreground">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10 glass-effect border-primary/30 focus:border-primary/60"
                        required
                        title="Confirm your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
                  </motion.div>

                  <div className="text-sm">
                    <Label className="flex items-start space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-primary/30 text-primary focus:ring-primary/20 mt-0.5"
                        required
                        title="I agree to the Terms of Service and Privacy Policy"
                        aria-label="Agreement to Terms of Service and Privacy Policy"
                      />
                      <span className="text-muted-foreground">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary hover:text-primary/80 neon-text">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:text-primary/80 neon-text">
                          Privacy Policy
                        </Link>
                      </span>
                    </Label>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow"
                      disabled={isLoading || !formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword || passwordStrength < 50}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
