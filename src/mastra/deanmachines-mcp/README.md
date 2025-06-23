# Dean Machines MCP Server

## Overview

The Dean Machines MCP Server is a comprehensive Model Context Protocol (MCP) server that exposes the complete Dean Machines AI ecosystem to external MCP clients like Cursor, Windsurf, Claude Desktop, and other AI development tools.

## Features

### 🤖 20+ Specialized Agents
- **Master Agent**: Primary orchestrator with comprehensive Zod validation
- **Research Agent**: Information gathering and synthesis
- **Code Agent**: Code analysis, generation, and optimization
- **Debug Agent**: Error detection and debugging assistance
- **Data Agent**: Data processing and statistical analysis
- **Graph Agent**: Knowledge graph operations and visualization
- **Design Agent**: UI/UX design and visual aesthetics
- **Documentation Agent**: Technical documentation generation
- **And 12+ more specialized agents**

### 🛠️ 50+ Advanced Tools
**Core Mastra Tools:**
- `chunkerTool`: Intelligent text chunking
- `graphRAGTool`: Graph-based retrieval augmented generation
- `vectorQueryTool`: Semantic search capabilities
- `weatherTool`: Weather data retrieval
- `webScraperTool`: Web content extraction

**Agentic External Integrations:**
- **Exa**: Neural search for high-quality results
- **ArXiv**: Academic paper repository access
- **Reddit**: Social discussion and community insights
- **Wikipedia/Wikidata**: Comprehensive knowledge bases
- **Brave Search**: Privacy-focused web search
- **Diffbot**: AI-powered content extraction
- **Hacker News**: Technology news and discussions

### 🔄 Intelligent Workflows
- `weatherWorkflow`: Weather analysis and forecasting
- `codeGraphMakerWorkflow`: Code relationship analysis
- `fullStackDevelopmentWorkflow`: Complete development lifecycle
- `researchAnalysisWorkflow`: Multi-source research synthesis

### 📚 Resources & Prompts
- Agent registry with capabilities and metadata
- Workflow catalog with execution guides
- Tool inventory with usage examples
- System status and health monitoring
- Comprehensive prompt templates for common operations

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- Environment variables configured (see `.env.example`)

### Required Environment Variables
```bash
# Core Configuration
NODE_ENV=development
LOG_LEVEL=info

# API Keys (optional, tools will be disabled if not provided)
EXA_API_KEY=your_exa_api_key
BRAVE_API_KEY=your_brave_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
DIFFBOT_API_KEY=your_diffbot_api_key

# Observability (optional)
LANGSMITH_TRACING=true
LANGFUSE_TRACING=true
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ssdeanx/deanmachines-rsc.git
   cd deanmachines-rsc
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## Usage

### Testing the Server
Run the test script to verify everything is working:
```bash
npx tsx test-mcp-server.ts
```

### Starting the MCP Server
The server can be started with different transport methods:

**Stdio Transport (recommended for MCP clients):**
```bash
npx tsx src/mastra/deanmachines-mcp/mcpServer.ts
```

**HTTP Transport:**
```bash
npx tsx src/mastra/deanmachines-mcp/mcpServer.ts --transport http --port 3001
```

**Server Sent Events (SSE):**
```bash
npx tsx src/mastra/deanmachines-mcp/mcpServer.ts --transport sse --port 3001
```

### MCP Client Configuration

#### Claude Desktop
Add to your Claude Desktop configuration:
```json
{
  "mcpServers": {
    "dean-machines": {
      "command": "npx",
      "args": ["tsx", "/path/to/deanmachines-rsc/src/mastra/deanmachines-mcp/mcpServer.ts"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### Cursor/Windsurf
Add to your MCP configuration:
```json
{
  "name": "dean-machines",
  "command": ["npx", "tsx", "./src/mastra/deanmachines-mcp/mcpServer.ts"],
  "transport": "stdio"
}
```

## Available MCP Operations

### Tools
Access agents, workflows, and tools via MCP tool calls:
```javascript
// Agent interaction
await callTool("ask_master", { message: "Plan a research project" });
await callTool("ask_research", { query: "AI trends 2025" });
await callTool("ask_code", { request: "Optimize this function" });

// Workflow execution
await callTool("run_researchAnalysisWorkflow", { topic: "quantum computing" });
await callTool("run_fullStackDevelopmentWorkflow", { project: "e-commerce app" });

// Direct tool access
await callTool("exaSearch", { query: "latest AI research", numResults: 10 });
await callTool("arxivSearch", { query: "machine learning", maxResults: 5 });
await callTool("graphRAGTool", { query: "system architecture", documents: [...] });
```

### Resources
Access system information and documentation:
- `deanmachines://agents/registry`: Complete agent list with capabilities
- `deanmachines://workflows/catalog`: Available workflows and their purposes
- `deanmachines://tools/inventory`: Tool catalog with usage examples
- `deanmachines://system/status`: Real-time system health and metrics
- `deanmachines://docs/readme`: Comprehensive documentation

### Prompts
Use predefined prompt templates:
- `agent_interaction`: Guide for effective agent communication
- `workflow_execution`: Strategy for optimal workflow selection
- `system_analysis`: Comprehensive system analysis template
- `debugging_assistance`: Systematic debugging guidance
- `research_workflow`: Multi-source research strategy
- `task_orchestration`: Multi-agent coordination template

## Architecture

### MCP Server Structure
```
Dean Machines MCP Server
├── Agent Registry (20+ agents)
│   ├── Core Agents (master, supervisor, strategizer)
│   ├── Development Agents (code, debug, git, docker)
│   ├── Research Agents (research, data, graph)
│   └── Specialized Agents (design, marketing, etc.)
├── Tool System (50+ tools)
│   ├── Core Mastra Tools
│   └── Agentic External Integrations
├── Workflow Engine (5+ workflows)
├── Resource Management
├── Prompt Templates
└── Health Monitoring
```

### Integration Flow
```
MCP Client → MCP Server → Mastra Framework → AI Models/External APIs
```

## Observability

The server includes comprehensive logging and observability:
- **PinoLogger**: Structured logging throughout the system
- **LangSmith**: AI model tracing and debugging
- **Langfuse**: Performance monitoring and analytics
- **Health Checks**: Real-time system health monitoring

## Development

### Adding New Tools
1. Create your tool in `src/mastra/tools/`
2. Export it from `src/mastra/tools/index.ts`
3. Add it to the MCP server in `mcpServer.ts`

### Adding New Agents
1. Create your agent in `src/mastra/agents/`
2. Export it from `src/mastra/agents/index.ts`
3. It will automatically be available via MCP

### Adding New Workflows
1. Create your workflow in `src/mastra/workflows/`
2. Export it from `src/mastra/workflows/index.ts`
3. Add it to the MCP server configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/ssdeanx/deanmachines-rsc/issues
- Documentation: https://github.com/ssdeanx/deanmachines-rsc/docs

---

**Built with ❤️ using the Mastra AI Framework**
