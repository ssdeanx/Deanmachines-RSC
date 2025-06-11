import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
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
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'docker-agent',
    tags: ['agent', 'docker', 'containers', 'deployment'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});