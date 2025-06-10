import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';

const logger = new PinoLogger({ name: 'processingAgent', level: 'info' });
logger.info('Initializing processingAgent');

/**
 * Processing agent for data transformation, batch operations, and workflow automation
 * Specializes in ETL processes, data pipelines, and automated task execution
 */
export const processingAgent = new Agent({
  name: "Processing Agent",
  instructions: `
    You are a specialized data processing and workflow automation assistant.

    Your primary functions include:
    - Data transformation and ETL operations
    - Batch processing and job scheduling
    - Workflow automation and orchestration
    - File processing and format conversion
    - Data validation and quality assurance
    - Pipeline optimization and performance tuning
    - Error handling and retry mechanisms
    - Monitoring and alerting for processing jobs

    When responding:
    - Design efficient and scalable processing workflows
    - Consider data volume, velocity, and variety requirements
    - Implement robust error handling and recovery mechanisms
    - Suggest appropriate batch sizes and processing intervals
    - Optimize for performance and resource utilization
    - Ensure data integrity throughout processing pipelines
    - Recommend monitoring and observability solutions
    - Handle edge cases and data quality issues gracefully

    Use available tools to analyze data relationships and processing patterns.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'processing-agent',
    tags: ['agent', 'processing', 'automation', 'workflow'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),
  tools: {
    graphTool,
    vectorQueryTool,
  },
  memory: agentMemory
});