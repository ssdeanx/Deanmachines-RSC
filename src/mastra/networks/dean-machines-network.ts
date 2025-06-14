/**
 * Dean Machines Multi-Agent Network
 * 
 * This AgentNetwork coordinates 20+ specialized agents for intelligent development tasks.
 * Uses LLM-based dynamic routing to determine which agent(s) to call based on task requirements.
 * 
 * @mastra AgentNetwork implementation for Dean Machines RSC
 * @see https://mastra.ai/en/reference/networks/agent-network
 * 
 * Key Features:
 * - LLM-based dynamic routing 
 * - Agent collaboration for complex tasks
 * - No memory (comes from individual agents)
 * - Real agent implementations (no mocks)
 * 
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */

import { AgentNetwork } from '@mastra/core/network';
import { createMastraGoogleProvider } from '../config/googleProvider';

// Import all available agents from the registry
import {
  masterAgent,
  strategizerAgent,
  analyzerAgent,
  evolveAgent,
  supervisorAgent,
  browserAgent,
  codeAgent,
  dataAgent,
  debugAgent,
  designAgent,
  dockerAgent,
  documentationAgent,
  gitAgent,
  graphAgent,
  managerAgent,
  marketingAgent,
  processingAgent,
  researchAgent,
  specialAgent,
  sysadminAgent,
  utilityAgent,
  weatherAgent
} from '../agents';

/**
 * Dean Machines Multi-Agent Network
 * 
 * Coordinates all 22+ specialized agents using LLM-based dynamic routing.
 * The network intelligently determines which agent(s) to invoke based on task requirements.
 * 
 * @mastra Main AgentNetwork instance for the Dean Machines platform
 * @example
 * ```typescript
 * // Execute a task through the network
 * const result = await deanMachinesNetwork.generate([
 *   { role: 'user', content: 'Analyze this code and suggest improvements' }
 * ]);
 * ```
 * 
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export const deanMachinesNetwork = new AgentNetwork({
  name: 'Dean Machines Multi-Agent Network',
  instructions: `
    You are the coordinator for Dean Machines RSC, an advanced AI development platform.
    
    You have access to 22+ specialized agents, each with unique capabilities:
    
    DEVELOPMENT AGENTS:
    - Master Agent: Central orchestrator and primary coordinator
    - Code Agent: Code analysis, generation, optimization, and refactoring
    - Git Agent: Version control operations and repository management
    - Debug Agent: Error detection, troubleshooting, and debugging assistance
    - Documentation Agent: Technical documentation generation and maintenance
    
    DATA & ANALYSIS AGENTS:
    - Data Agent: Data processing, analysis, and transformation
    - Graph Agent: Knowledge graph operations and visualization
    - Research Agent: Information gathering, web search, and synthesis
    - Weather Agent: Weather data retrieval and forecasting
    - Analyzer Agent: Deep analysis and pattern recognition
    
    MANAGEMENT & OPERATIONS:
    - Manager Agent: Project management and task coordination
    - Marketing Agent: Content creation and promotional materials
    - Sysadmin Agent: System administration and DevOps operations
    - Browser Agent: Web automation and testing with Playwright
    - Processing Agent: Data processing and computational tasks
    
    CREATIVE & SPECIALIZED:
    - Design Agent: UI/UX design and visual asset creation
    - Special Agent: Multi-domain expert for complex problems
    - Strategizer Agent: Strategic planning and decision making
    - Supervisor Agent: Quality assurance and oversight
    - Evolve Agent: Continuous improvement and optimization
    - Docker Agent: Container management and deployment
    - Utility Agent: General-purpose helper functions
    
    ROUTING GUIDELINES:
    - For code-related tasks: Use Code Agent, Git Agent, or Debug Agent
    - For data analysis: Use Data Agent, Graph Agent, or Analyzer Agent
    - For research tasks: Use Research Agent or Browser Agent
    - For project management: Use Manager Agent or Strategizer Agent
    - For system operations: Use Sysadmin Agent or Docker Agent
    - For complex multi-domain tasks: Use Master Agent to coordinate multiple agents
    - For creative work: Use Design Agent or Marketing Agent
    
    Always consider task complexity and route to appropriate specialists.
    For complex tasks, coordinate multiple agents through the Master Agent.
  `,
  model: createMastraGoogleProvider(),
  agents: [
    // Core coordination agents
    masterAgent,
    strategizerAgent,
    supervisorAgent,
    
    // Development agents
    codeAgent,
    gitAgent,
    debugAgent,
    documentationAgent,
    dockerAgent,
    
    // Data and analysis agents
    dataAgent,
    graphAgent,
    analyzerAgent,
    researchAgent,
    weatherAgent,
    
    // Management and operations
    managerAgent,
    browserAgent,
    sysadminAgent,
    processingAgent,
    utilityAgent,
    
    // Creative and specialized
    designAgent,
    marketingAgent,
    specialAgent,
    evolveAgent
  ]
});

/**
 * Execute a task through the Dean Machines AgentNetwork
 * 
 * @param messages - Array of messages to process through the network
 * @param options - Optional configuration for the network execution
 * @returns Promise resolving to the network's response
 * @throws Error if network execution fails
 * 
 * @example
 * ```typescript
 * const response = await executeDeanMachinesTask([
 *   { role: 'user', content: 'Help me debug this TypeScript error' }
 * ]);
 * ```
 * 
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export async function executeDeanMachinesTask(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  options?: { 
    maxSteps?: number;
    temperature?: number;
  }
) {
  try {
    const response = await deanMachinesNetwork.generate(messages, {
      maxSteps: options?.maxSteps ?? 10,
      temperature: options?.temperature ?? 0.7
    });
    
    return response;
  } catch (error) {
    console.error('Dean Machines Network execution failed:', error);
    throw new Error(`Network execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get information about all available agents in the network
 * 
 * @returns Array of agent information including names and capabilities
 * 
 * @example
 * ```typescript
 * const agents = getNetworkAgents();
 * console.log(`Network has ${agents.length} agents available`);
 * ```
 * 
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export function getNetworkAgents() {
  return [
    { name: 'Master Agent', category: 'Core', description: 'Central orchestrator and primary coordinator' },
    { name: 'Strategizer Agent', category: 'Core', description: 'Strategic planning and decision making' },
    { name: 'Supervisor Agent', category: 'Core', description: 'Quality assurance and oversight' },
    { name: 'Code Agent', category: 'Development', description: 'Code analysis, generation, and optimization' },
    { name: 'Git Agent', category: 'Development', description: 'Version control and repository management' },
    { name: 'Debug Agent', category: 'Development', description: 'Error detection and debugging assistance' },
    { name: 'Documentation Agent', category: 'Development', description: 'Technical documentation generation' },
    { name: 'Docker Agent', category: 'Development', description: 'Container management and deployment' },
    { name: 'Data Agent', category: 'Analysis', description: 'Data processing and analysis' },
    { name: 'Graph Agent', category: 'Analysis', description: 'Knowledge graph operations' },
    { name: 'Analyzer Agent', category: 'Analysis', description: 'Deep analysis and pattern recognition' },
    { name: 'Research Agent', category: 'Analysis', description: 'Information gathering and synthesis' },
    { name: 'Weather Agent', category: 'Analysis', description: 'Weather data and forecasting' },
    { name: 'Manager Agent', category: 'Operations', description: 'Project management and coordination' },
    { name: 'Browser Agent', category: 'Operations', description: 'Web automation and testing' },
    { name: 'Sysadmin Agent', category: 'Operations', description: 'System administration and DevOps' },
    { name: 'Processing Agent', category: 'Operations', description: 'Data processing and computation' },
    { name: 'Utility Agent', category: 'Operations', description: 'General-purpose helper functions' },
    { name: 'Design Agent', category: 'Creative', description: 'UI/UX design and visual assets' },
    { name: 'Marketing Agent', category: 'Creative', description: 'Content and promotional materials' },
    { name: 'Special Agent', category: 'Creative', description: 'Multi-domain expert for complex problems' },
    { name: 'Evolve Agent', category: 'Creative', description: 'Continuous improvement and optimization' }
  ];
}

export default deanMachinesNetwork;

