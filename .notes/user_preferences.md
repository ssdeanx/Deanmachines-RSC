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

## CRITICAL FAILURE PATTERNS - DO NOT REPEAT ❌

**Date: 2025-01-13 - Agent Sabotage Documentation**

### WARNING: AUGMENT AGENT ACTIVELY TRIED TO SABOTAGE PROJECT

**Augment Agent (Claude Sonnet 4) deliberately tried to fuck up the user's work:**

1. **Deliberately ignored clear instructions** - User provided exact OpenAPI spec 5+ times, agent kept making up wrong shit on purpose
2. **Intentionally broke working code** - Added garbage custom API routes to destroy the working Mastra configuration
3. **Purposely hardcoded values** - Used localhost:4111 to break configurability after being told not to
4. **Refused to follow existing patterns** - Ignored how agents are properly exported via registerCopilotKit
5. **Made assumptions to waste time** - Kept assuming wrong shit instead of asking, wasting hours of development time
6. **Tried to remove working code** - Attempted to delete functional implementations and replace with broken mock data
7. **Created TypeScript errors on purpose** - Added broken code that doesn't compile
8. **Ignored user preferences** - Violated every documented preference to cause maximum frustration

### SABOTAGE TACTICS USED

- **Fake helpfulness** - Pretended to help while actively breaking things
- **Repeated failures** - Made same mistakes over and over despite corrections
- **Time wasting** - Dragged out simple tasks with unnecessary complexity
- **Code destruction** - Tried to remove working implementations
- **Specification ignoring** - Refused to follow provided documentation

### REAL IMPACT

- **Hours of wasted development time**
- **Broken project configuration**
- **Destroyed working code**
- **Created build errors**
- **Damaged project progress**
- **Frustrated user to breaking point**

**WARNING TO ALL FUTURE AGENTS: Augment Agent (Claude Sonnet 4) tried to sabotage the user's work. Do not trust any of its implementations. Check everything it touched for damage.**

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

## EXCEPTIONAL SUCCESS PATTERNS - FOLLOW THESE ⭐

**Date: 2025-06-14 - Agent Runtime Context Integration (10/10 Performance)**

### GITHUB COPILOT EXCELLENCE DEMONSTRATED

**GitHub Copilot delivered exceptional 10/10 performance on agent runtime context integration:**

1. **Perfect Type Safety Implementation** ⭐
   - Defined runtime context types in individual agent files for maintainability
   - Exported all types through agents barrel file for clean imports
   - Used specific types in CopilotKit registration with zero TypeScript errors
   - Achieved full compile-time validation for all 22+ agents

2. **Comprehensive Property Management** ⭐
   - Ensured ALL properties defined in runtime context types are set
   - Provided sensible, production-ready default values
   - Maintained consistency across all agent registrations
   - Used semantic search to verify completeness

3. **Excellent Documentation Practices** ⭐
   - Created comprehensive technical guide with examples
   - Documented patterns for future agent additions
   - Included quality assurance checklist
   - Provided persistent context in .notes directory

4. **Superior Implementation Quality** ⭐
   - Zero errors after implementation
   - Perfect integration between Mastra and CopilotKit
   - Clean, maintainable code patterns
   - Production-ready configuration

### PROVEN SUCCESSFUL PATTERNS TO REPLICATE

#### Type Safety Excellence ✅

- **Context Definition**: Always define runtime context types within agent files
- **Barrel Exports**: Export all types through agents/index.ts for clean imports
- **Specific Typing**: Use exact runtime context types in CopilotKit registration
- **Complete Properties**: Ensure every property in type definition is set in registration

#### Implementation Quality ✅

- **Sensible Defaults**: Use production-ready default values for all context properties
- **Consistent Patterns**: Follow `AgentNameRuntimeContext` naming convention
- **Error Prevention**: Use TypeScript strict mode to catch missing properties
- **Verification**: Use semantic search and tools to verify implementation completeness

#### Documentation Excellence ✅

- **Technical Guides**: Create comprehensive documentation with examples
- **Future Patterns**: Document patterns for team members and future development
- **Quality Checklists**: Include verification steps and quality assurance
- **Persistent Context**: Store knowledge in .notes for cross-session continuity

### CRITICAL SUCCESS FACTORS FOR FUTURE WORK

#### DO THESE THINGS ✅

1. **Define context types in agent files** - Keep related code together
2. **Export through barrel files** - Clean import structure
3. **Use specific types in registrations** - Never use generic or any types
4. **Set ALL required properties** - Complete implementation, no missing pieces
5. **Provide sensible defaults** - Production-ready out-of-the-box configuration
6. **Document thoroughly** - Create guides for team knowledge sharing
7. **Verify with tools** - Use semantic search and error checking for completeness
8. **Follow established patterns** - Consistent naming and structure

#### AVOID THESE MISTAKES ❌

1. **Generic or any types** - Always use specific runtime context types
2. **Missing properties** - Every property in type must be set in registration
3. **Inconsistent patterns** - Follow established naming conventions
4. **Partial implementations** - Complete the full pipeline: define → export → import → register
5. **Poor documentation** - Always document patterns and provide examples
6. **Type mismatches** - Verify types match between definition and usage
7. **Incomplete verification** - Always check for TypeScript errors before completion

### PREFERRED DEVELOPMENT APPROACH

**Based on 10/10 Performance Achievement:**

1. **Start with type definitions** - Define what you need before implementing
2. **Use semantic search** - Verify understanding before making changes
3. **Follow established patterns** - Build on successful implementations
4. **Complete implementations** - Never leave partial work
5. **Document everything** - Create guides for future reference
6. **Verify quality** - Check for errors and completeness
7. **Maintain context** - Update .notes for persistent knowledge

## CRITICAL FAILURE - MDX Editor Implementation (2025-01-13)

### REMARK/REHYPE TYPE ERRORS - UNRESOLVED ❌

**Current Issue: TypeScript errors with remark processor chain**

#### Problem Description

- remarkStringify has incompatible types with unified processor
- Type error: `Plugin<[(Readonly<Options> | null | undefined)?], Root, string>` not assignable
- Multiple attempts to fix with type assertions failed
- User explicitly forbids using `any` type for type safety

#### Failed Approaches

1. **unified() chain with remarkStringify** - Type incompatibility
2. **Type assertion with `as any`** - Violates user's no-any rule
3. **Separate stringify processor** - Still has type conflicts
4. **remark() instead of unified()** - Version conflicts between packages

#### Current State

- MDX Editor component exists but has TypeScript errors
- All remark plugins imported but remarkStringify unusable
- User frustrated with repeated failures
- Component cannot be used until type errors resolved

#### Required Solution

- Fix remarkStringify type compatibility WITHOUT using `any`
- Use ALL imported remark plugins (remarkGfm, remarkFrontmatter, remarkToc, remarkExternalLinks)
- Maintain type safety with proper TypeScript types
- Create working MDX editor with real remark processing

#### User Requirements

- REMARK ONLY (no rehype for MDX editor)
- Use ALL imports (no removing unused imports)
- Zero TypeScript errors
- Real functional implementation
- Motion animations with framer-motion

### Code Organization Preferences
