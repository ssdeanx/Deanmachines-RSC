'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Settings, 
  Search, 
  GitBranch, 
  Users, 
  Activity,
  Zap,
  Code2
} from 'lucide-react';

const navItems = [
  {
    href: '/playground',
    label: 'Home',
    icon: Home,
    description: 'Main playground with agent chat'
  },
  {
    href: '/playground/settings',
    label: 'Settings',
    icon: Settings,
    description: 'Configure agents and preferences'
  },
  {
    href: '/playground/research',
    label: 'Research',
    icon: Search,
    description: 'CopilotKit examples and patterns'
  },
  {
    href: '/playground/codegraph',
    label: 'Code Graph',
    icon: GitBranch,
    description: 'Repository analysis and visualization'
  },
  {
    href: '/playground/multi-agent',
    label: 'Multi-Agent',
    icon: Users,
    description: 'Agent coordination workflows'
  },
  {
    href: '/playground/actions',
    label: 'Actions',
    icon: Zap,
    description: 'Advanced CopilotKit actions'
  },
  {
    href: '/playground/generative-ui',
    label: 'Generative UI',
    icon: Code2,
    description: 'Dynamic UI generation'
  }
];

export function PlaygroundNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg mb-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center gap-2 transition-all",
                isActive && "shadow-sm"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export function PlaygroundNavDetailed() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer",
                isActive 
                  ? "bg-primary/10 border-primary shadow-sm" 
                  : "bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <h3 className={cn(
                  "font-medium",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {item.label}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
