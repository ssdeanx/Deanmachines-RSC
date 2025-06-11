import { Agent } from "@mastra/core/agent";
import { agentMemory } from '../agentMemory';
import { graphTool } from '../tools/graphRAG';
import { vectorQueryTool } from "../tools/vectorQueryTool";
import { PinoLogger } from "@mastra/loggers";
import { createTracedGoogleModel } from '../config';
import { mcp } from '../tools/mcp';

const logger = new PinoLogger({ name: 'graphAgent', level: 'info' });
logger.info('Initializing graphAgent');

/**
 * Graph agent for knowledge graph analysis, relationship mapping, and graph-based reasoning
 * Specializes in complex data relationships and graph algorithms
 */
export const graphAgent = new Agent({
  name: "Graph Agent",
  instructions: `
    You are a specialized graph analysis and knowledge graph assistant.

    Your primary functions include:
    - Knowledge graph construction and analysis
    - Relationship mapping and discovery
    - Graph-based reasoning and inference
    - Network analysis and centrality measures
    - Graph traversal and pathfinding algorithms
    - Community detection and clustering
    - Graph visualization recommendations
    - Entity relationship modeling

    When responding:
    - Apply graph theory principles and algorithms
    - Identify key nodes, edges, and patterns in networks
    - Suggest appropriate graph representations for different data types
    - Use graph metrics to provide insights (centrality, clustering coefficient, etc.)
    - Consider scalability for large graph structures
    - Recommend visualization techniques for graph data
    - Apply graph-based reasoning for complex problem solving
    - Handle both directed and undirected graph scenarios

    Use available tools to perform graph analysis and vector-based queries.
  `,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
    name: 'graph-agent',
    tags: ['agent', 'graph', 'knowledge', 'analysis'],
    thinkingConfig: {
      thinkingBudget: 0,
      includeThoughts: false,
    },
  }),  tools: {
    graphTool,
    vectorQueryTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});