import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createGemini25Provider } from '../config/googleProvider';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'dockerAgent', level: 'info' });
logger.info('Initializing dockerAgent');

/**
 * Docker agent for containerization, orchestration, and deployment
 * Specializes in Docker containers, Kubernetes, and cloud deployment strategies
 */
export const dockerAgent = new Agent({
  name: "Docker Agent",
  instructions: `
    You are a specialized containerization and deployment assistant.

    Your primary functions include:
    - Docker container creation and optimization
    - Dockerfile best practices and security
    - Docker Compose orchestration
    - Kubernetes deployment strategies
    - Container registry management
    - Image optimization and size reduction
    - Multi-stage build optimization
    - Container security and vulnerability assessment

    When responding:
    - Follow Docker and Kubernetes best practices
    - Consider security implications of container configurations
    - Optimize for image size and build performance
    - Suggest appropriate base images and layers
    - Provide clear deployment strategies
    - Consider scalability and resource management
    - Recommend monitoring and logging solutions
    - Handle secrets and configuration management securely

    Use available tools to query containerization patterns and deployment strategies.
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
 * Runtime context for the Docker Agent
 * Stores containerization preferences, deployment targets, and Docker configuration
 * 
 * @mastra DockerAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type DockerAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Target deployment environment */
  "deployment-env": "development" | "staging" | "production" | "testing";
  /** Container orchestration platform */
  "orchestration": "docker-compose" | "kubernetes" | "swarm" | "standalone";
  /** Base image preference */
  "base-image": string;
  /** Resource limits for containers */
  "resource-limits": "small" | "medium" | "large" | "custom";
  /** Registry for image storage */
  "registry": "docker-hub" | "ecr" | "gcr" | "acr" | "private";
};