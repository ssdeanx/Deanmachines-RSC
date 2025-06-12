// Generated on June 10, 2025
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import { useState } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';
// import { useSession, signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

interface TopNavbarProps {
  className?: string;
}

/**
 * TopNavbar component with cutting-edge 2025 animations
 *
 * Features neon glow effects, glassmorphism, and smooth transitions
 * Dark theme with yellow neon accents
 */
export function TopNavbar({ className }: TopNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  // Auth is completely disabled for now
  const session = null;
  const status = 'unauthenticated';

  // Add scroll listener for navbar glow effect
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    console.log('Sign out disabled');
  };

  return (
    <motion.nav
      className={cn(
        "glass-effect backdrop-blur-xl sticky top-0 z-50 border-b border-primary/20",
        "bg-background/80 supports-[backdrop-filter]:bg-background/60",
        isScrolled && "neon-glow",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link href="/" className="text-2xl font-bold text-primary neon-text floating">
              Dean<span className="text-foreground">Machines</span>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {['Features', 'Solutions', 'About', 'Docs'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="relative text-foreground hover:text-primary transition-all duration-300 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 neon-glow"></span>
                </Link>
              </motion.div>
            ))}

            {/* Playground Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="default"
                size="sm"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow"
              >
                <Link href="/playground">🚀 Playground</Link>
              </Button>
            </motion.div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Switch */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <ThemeSwitch />
            </motion.div>

            {/* Authentication Buttons */}
            {status === 'loading' ? (
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : session ? (
              // Authenticated state
              <div className="hidden sm:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass-effect border-primary/30 hover:border-primary/60"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {session.user?.name || session.user?.email || 'User'}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="glass-effect border-primary/30 hover:border-primary/60"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            ) : (
              // Unauthenticated state
              <div className="hidden sm:flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="glass-effect border-primary/30 hover:border-primary/60"
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow pulse-glow"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </motion.div>
              </div>
            )}

            <div className="md:hidden ml-2">
              <Button variant="outline" size="icon" className="glass-effect border-primary/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
