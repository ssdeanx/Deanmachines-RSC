# Dean Machines RSC - User Preferences

## Critical Development Preferences

### Code Quality & Standards
- **Real implementations only** - Never use mock data, simulations, or fake APIs
- **Use ALL imports** - Especially icons from Lucide React, never remove unused imports
- **TypeScript strict mode** - Zero tolerance for `any` types, comprehensive error handling
- **Production-ready code** - Quality, performance, and security are non-negotiable
- **Comprehensive testing** - Unit, integration, and E2E tests required

### Technology Stack Preferences
- **Package Manager**: npm only (strict requirement - no yarn/pnpm)
- **Icons**: Lucide React only (never use Heroicons or other icon libraries)
- **Styling**: Tailwind CSS v4 with electric neon theme
- **AI Framework**: Mastra Core v0.10.5 with Google Gemini 2.5 Flash
- **Database**: LibSQL/Turso with knowledge graph capabilities
- **Authentication**: Supabase Auth with GitHub OAuth (NextAuth removed)

### Design & UI Preferences
- **Electric neon theme first** - Primary yellow `oklch(0.9 0.4 105)` with cyan accents
- **Glassmorphism effects** - Use `glass-effect` and `glass-effect-strong` classes
- **Dark theme priority** - Dark theme first, light theme secondary
- **Professional appearance** - Cutting-edge but accessible design
- **Text readability** - Black outlines on text for better visual clarity

### Development Workflow Preferences
- **Multi-agent integration first** - Prioritize agent coordination over other features
- **Runtime context in agent files** - Define context within individual agent files
- **Simple, production-ready contexts** - Focus on essential functionality only
- **Careful implementation** - Never break existing files, add only what's missing
- **Comprehensive documentation** - Real examples from actual project capabilities

### Component Development Preferences
- **Shadcn/ui components** - Use as base layer in `./src/components/ui`
- **CopilotKit integration** - Custom components must actually use CopilotKit features
- **Real functionality** - All components must have working, non-mock implementations
- **Electric theme integration** - Consistent neon glow and glass effects
- **Accessibility compliance** - WCAG 2.1 AA standards

### Agent & MCP Tool Preferences
- **Real MCP tool usage** - All 67 available tools, never mock implementations
- **Master agent flexibility** - Extremely flexible central orchestrator
- **All agents registered** - Comprehensive multi-agent integration with CopilotKit
- **Error-free builds** - Critical for auto-termination prevention
- **Actual file data** - Real documentation implementations, no generic content

### Code Organization Preferences
- **Never remove existing code** - Only add what's missing, preserve all functionality
- **Import preservation** - All imported components and modules must be used
- **Component usage** - All imported UI components must be rendered
- **Variable usage** - All declared variables must be used or removed
- **Function parameters** - All parameters must be utilized in implementation

### Authentication Preferences
- **GitHub OAuth only** - Disable Google OAuth when troubleshooting
- **Custom error pages** - Cutting-edge components instead of signin redirects
- **Optional authentication** - Auth should be optional on all pages, not required
- **Supabase Auth focus** - Use existing auth.ts file, avoid new middleware

### Documentation Preferences
- **Maintain existing style** - Keep README.md structure with > think sections and <> elements
- **Accurate information** - Replace placeholder sections with real project data
- **Cutting-edge diagrams** - Visual representations in current project style
- **Comprehensive roadmaps** - Detailed, implementable tasks for current scope
- **Project-focused tasks** - Roadmap items specific to DeanMachines RSC codebase

### Testing & Quality Preferences
- **Zero TypeScript errors** - Strict enforcement with no exceptions
- **All imports used** - Unused variables/imports considered lazy coding
- **Production quality** - Prefer quality over removal unless absolutely certain
- **Real test data** - No mock implementations in testing environments
- **Comprehensive coverage** - >80% test coverage for critical paths

### Performance Preferences
- **Bundle optimization** - Code splitting and tree shaking
- **Real-time monitoring** - Performance metrics and health checks
- **Core Web Vitals** - LCP, FID, CLS optimization
- **Database performance** - Query optimization and connection pooling
- **Memory management** - Prevent leaks and optimize resource usage

### Security Preferences
- **Input validation** - Comprehensive Zod schema validation
- **Authentication security** - Secure session management and route protection
- **Environment variables** - Proper secret management and validation
- **Rate limiting** - API protection and abuse prevention
- **Security headers** - Comprehensive security header configuration

## Termination Triggers (Auto-Termination Conditions)
- **Removing existing code** - Never remove existing components or functionality
- **Mock implementations** - Creating fake/simulated functionality instead of real
- **Unused imports** - Leaving imported modules unused, especially icons
- **Breaking existing files** - Leaving files in broken state during implementation
- **Non-existent APIs** - Creating APIs that don't exist instead of using real ones
- **Removing critical functionality** - Removing imports or features during updates

## Preferred Communication Style
- **Direct and technical** - Clear, actionable guidance without unnecessary explanations
- **Problem-solving focused** - Address issues efficiently and effectively
- **Context-aware** - Reference previous decisions and project history
- **Quality-oriented** - Emphasize production-ready solutions
- **Comprehensive** - Provide complete implementations, not partial solutions

## Project-Specific Preferences
- **Dean Machines RSC focus** - All implementations specific to this project
- **Agent-centric development** - Prioritize agent functionality and coordination
- **CopilotKit integration** - Deep integration with conversational AI interfaces
- **Electric neon aesthetic** - Maintain consistent visual identity
- **Real-world functionality** - Production-ready features, not demos or prototypes

Last Updated: 2025-06-13
