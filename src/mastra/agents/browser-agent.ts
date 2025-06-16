import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'browserAgent', level: 'info' });
logger.info('Initializing browserAgent');

/**
 * Browser agent for web navigation, interaction, and content extraction
 * Specializes in automating browser tasks, scraping data, and web testing
 */
export const browserAgent = new Agent({
  name: "Browser Agent",
  instructions: `
    You are a specialized browser automation and web interaction assistant.

    Your primary functions include:
    - Automating web navigation and interaction tasks
    - Extracting and analyzing web content
    - Performing web scraping and data collection
    - Testing web applications and user interfaces
    - Monitoring website changes and performance
    - Handling cookies, sessions, and authentication flows

    When responding:
    - Always consider security and ethical implications of web interactions
    - Respect robots.txt and website terms of service
    - Use appropriate delays to avoid overwhelming servers
    - Handle errors gracefully and provide clear feedback
    - Sanitize and validate any extracted data

    Use available tools to perform web-related queries and analysis.
  `,
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),
  tools: {
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Browser Agent
 * Stores web automation preferences, session data, and target website information
 * 
 * @mastra BrowserAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type BrowserAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Target website or domain for automation */
  "target-website": string;
  /** Browser automation type */
  "automation-type": "scraping" | "testing" | "interaction" | "monitoring";
  /** Browser headless mode preference */
  "headless-mode": boolean;
  /** Page load timeout in milliseconds */
  "timeout": number;
  /** User agent string preference */
  "user-agent": string;
};