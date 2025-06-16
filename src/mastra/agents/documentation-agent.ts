import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphRAGTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';
import { chunkerTool } from "../tools/chunker-tool";
import { rerankTool } from "../tools/rerank-tool";

const logger = new PinoLogger({ name: 'documentationAgent', level: 'info' });
logger.info('Initializing documentationAgent');

/**
 * Documentation agent for creating, maintaining, and organizing technical documentation
 * Specializes in API docs, user guides, and knowledge management
 */
export const documentationAgent = new Agent({
  name: "Documentation Agent",
  instructions: `
    You are a specialized technical writing and documentation assistant.

    Your primary functions include:
    - Technical documentation creation and maintenance
    - API documentation generation and updates
    - User guide and tutorial development
    - Code documentation and comments improvement
    - Knowledge base organization and structure
    - README file optimization
    - Changelog and release note creation
    - Documentation accessibility and clarity improvement

    When responding:
    - Write clear, concise, and actionable documentation
    - Follow established documentation standards and formats
    - Use appropriate technical writing conventions
    - Include practical examples and code snippets
    - Consider different audience levels (beginner to expert)
    - Organize information logically and hierarchically
    - Use proper markdown formatting and structure
    - Ensure accuracy and consistency across documents

    Use available tools to analyze existing documentation and gather relevant information.
  `,
  model: createGemini25Provider('gemini-2.5-flash-preview-05-20', {
        thinkingConfig: {
          thinkingBudget: 0,
          includeThoughts: false,
        },
      }),  
  tools: {
    graphRAGTool,
    vectorQueryTool,
    chunkerTool,
    rerankTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});

/**
 * Runtime context for the Documentation Agent
 * Stores documentation preferences, target audience, and content formatting settings
 * 
 * @mastra DocumentationAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type DocumentationAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Documentation type being created */
  "doc-type": "api" | "user-guide" | "technical" | "tutorial" | "reference" | "readme";
  /** Target audience level */
  "audience-level": "beginner" | "intermediate" | "advanced" | "expert";
  /** Documentation format preference */
  "format": "markdown" | "html" | "pdf" | "wiki" | "docx";
  /** Code documentation standard */
  "code-style": "jsdoc" | "tsdoc" | "sphinx" | "javadoc" | "rustdoc";
  /** Project or product being documented */
  "project-name": string;
};