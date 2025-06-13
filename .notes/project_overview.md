# Dean Machines RSC - Project Overview

## Project Goal
Dean Machines RSC is a cutting-edge AI platform combining 22+ specialized Mastra agents with a modern React/Next.js frontend, creating an unparalleled AI-powered development experience.

## Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript 5.8, Tailwind CSS v4
- **AI Framework**: Mastra Core v0.10.5, Google Gemini 2.5 Flash
- **UI Integration**: CopilotKit v1.8.14, AG-UI Protocol
- **Database**: LibSQL/Turso with Knowledge Graph capabilities
- **Authentication**: Supabase Auth with GitHub OAuth integration
- **MCP Tools**: 67 available tools across multiple servers (filesystem, git, github, ddgsearch, memoryGraph, puppeteer)
- **Package Manager**: npm (strict requirement - no yarn/pnpm)

## Key Architecture Principles
1. **Real functionality only** - No mock data or simulations ever
2. **Electric neon theme** with glassmorphism effects (`oklch(0.9 0.4 105)`)
3. **TypeScript strict mode** with comprehensive error handling
4. **Production-ready code quality** and performance optimization
5. **Comprehensive testing** and monitoring with observability
6. **All imports must be used** - Especially icons from Lucide React

## Current Agent Architecture (22+ Agents)

### Development Agents
- **Master Agent**: Central orchestrator managing all specialized agents
- **Code Agent**: Code analysis, generation, and optimization
- **Git Agent**: Version control operations and repository management
- **Debug Agent**: Error detection and debugging assistance
- **Documentation Agent**: Technical documentation generation

### Data & Analysis Agents
- **Data Agent**: Data processing and analysis
- **Graph Agent**: Knowledge graph operations and visualization
- **Research Agent**: Information gathering and synthesis
- **Weather Agent**: Weather data and forecasting

### Management & Operations
- **Manager Agent**: Project management and coordination
- **Marketing Agent**: Content and marketing assistance
- **Sysadmin Agent**: System administration and DevOps
- **Browser Agent**: Web automation and testing
- **Quality Agent**: Code quality and testing

### Creative & AI/ML
- **Design Agent**: UI/UX design and visual assets
- **Content Agent**: Content creation and editing
- **Animation Agent**: Motion graphics and animations
- **ML Agent**: Machine learning and model operations
- **Prompt Engineering Agent**: AI prompt optimization
- **AI Research Agent**: AI/ML research and development

## Sample User Journeys

### 1. Developer Workflow
1. **Login** → Supabase Auth with GitHub OAuth
2. **Navigate to Playground** → Protected route with CopilotKit integration
3. **Select Agent** → Choose from 22+ specialized agents
4. **Execute Task** → Real MCP tool integration, no mock data
5. **Review Results** → Interactive UI with electric neon theme

### 2. Code Analysis Workflow
1. **Upload Repository** → GitHub integration with real repository data
2. **Generate Code Graph** → Interactive visualization with xy/flow
3. **Analyze Dependencies** → Real filesystem and git tool analysis
4. **Ask Questions** → CopilotKit chat interface with agent responses

### 3. Multi-Agent Coordination
1. **Define Complex Task** → Break down into agent-specific subtasks
2. **Orchestrate Agents** → Master agent coordinates specialized agents
3. **Monitor Progress** → Real-time status updates and progress tracking
4. **Integrate Results** → Combine outputs into cohesive solution

## Current Focus Areas
- **CopilotKit Integration**: Custom Actions, Messages, Suggestions components
- **Multi-Agent Workflows**: Coordination between specialized agents
- **Code Graph Generation**: Interactive repository analysis and visualization
- **Real MCP Tool Usage**: All 67 tools integrated, no mock implementations
- **Electric Neon Theme**: Consistent glassmorphism and neon effects
- **Production Deployment**: Security, performance, and monitoring

## Critical Development Rules
- **Never use mock data** - Always integrate with real MCP tools
- **Use all imports** - Especially icons, never remove unused imports
- **TypeScript strict** - Zero tolerance for `any` types
- **Electric neon theme** - Consistent styling with `glass-effect` and `neon-glow`
- **Error handling** - Comprehensive try/catch blocks for all operations
- **Performance first** - Optimize for production use cases

## Environment Configuration
```bash
# Required Environment Variables
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
DATABASE_URL=your_libsql_url
DATABASE_AUTH_TOKEN=your_auth_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
LANGSMITH_API_KEY=your_langsmith_key
GITHUB_TOKEN=your_github_token
NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL=http://localhost:4111/copilotkit
MASTRA_PORT=4111
```

## File Structure Highlights
```
src/
├── app/(playground)/           # Protected AI features with CopilotKit
├── components/copilotkit/      # Custom CopilotKit components
├── mastra/agents/             # 22+ specialized AI agents
├── mastra/tools/              # MCP tool integrations
├── utility/supabase/          # Authentication utilities
└── hooks/                     # Custom React hooks
```

## Quality Standards
- **Test Coverage**: >80% for critical paths
- **Performance**: Core Web Vitals optimization
- **Security**: Comprehensive input validation and auth protection
- **Accessibility**: WCAG 2.1 AA compliance
- **Documentation**: TSDoc comments for all public functions

Last Updated: 2025-06-13
