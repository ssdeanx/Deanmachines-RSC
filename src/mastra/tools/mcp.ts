import { MCPClient } from "@mastra/mcp";
import { PinoLogger } from '@mastra/loggers';
import { z } from 'zod';


const logger = new PinoLogger({ name: 'mcp', level: 'info' });

/**
 * Transform Zod schemas to remove ZodNull types that Google AI models don't support
 * Converts ZodNull to optional strings to maintain compatibility
 * @param schema - Any Zod schema object
 * @returns Transformed schema without ZodNull types
 */
function transformSchemaForGoogleAI(schema: unknown): unknown {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  const schemaObj = schema as Record<string, unknown>;

  // Handle different Zod schema types
  if (schemaObj._def) {
    const defObj = schemaObj._def as Record<string, unknown>;
    const typeName = defObj.typeName;

    // Replace ZodNull with optional string
    if (typeName === 'ZodNull') {
      return z.string().optional().describe('Converted from null for Google AI compatibility');
    }

    // Handle ZodUnion that might contain ZodNull
    if (typeName === 'ZodUnion' && defObj.options) {
      const options = defObj.options as unknown[];
      const filteredOptions = options
        .map((option: unknown) => transformSchemaForGoogleAI(option))        .filter((option: unknown) => {
          const optionObj = option as Record<string, unknown>;
          const optionDef = optionObj._def as Record<string, unknown>;
          return optionDef?.typeName !== 'ZodNull';
        });

      if (filteredOptions.length === 1) {
        return (filteredOptions[0] as z.ZodTypeAny).optional();
      } else if (filteredOptions.length > 1) {
        return z.union(filteredOptions as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);
      } else {
        return z.string().optional().describe('Converted from null union for Google AI compatibility');
      }
    }

    // Handle ZodOptional
    if (typeName === 'ZodOptional') {
      return z.optional(transformSchemaForGoogleAI(defObj.innerType) as z.ZodTypeAny);
    }

    // Handle ZodObject
    if (typeName === 'ZodObject' && defObj.shape) {
      const shapeFunc = defObj.shape as () => Record<string, unknown>;
      const shape = shapeFunc();
      const transformedShape: Record<string, z.ZodTypeAny> = {};
      for (const [key, value] of Object.entries(shape)) {
        transformedShape[key] = transformSchemaForGoogleAI(value) as z.ZodTypeAny;
      }
      return z.object(transformedShape);
    }

    // Handle ZodArray
    if (typeName === 'ZodArray') {
      return z.array(transformSchemaForGoogleAI(defObj.type) as z.ZodTypeAny);
    }

    // Handle ZodRecord
    if (typeName === 'ZodRecord') {
      if (defObj.valueType) {
        return z.record(transformSchemaForGoogleAI(defObj.valueType) as z.ZodTypeAny);
      }
      return schema;
    }
  }

  // Handle plain objects that might contain schemas
  if (typeof schema === 'object' && !Array.isArray(schema)) {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(schemaObj)) {
      transformed[key] = transformSchemaForGoogleAI(value);
    }
    return transformed;
  }

  // Handle arrays
  if (Array.isArray(schema)) {
    return schema.map(item => transformSchemaForGoogleAI(item));
  }

  return schema;
}

/**
 * Transform MCP tools to remove ZodNull types and ensure Google AI compatibility
 * @param tools - Raw MCP tools object
 * @returns Transformed tools compatible with Google AI models
 */
function transformMCPToolsForGoogleAI(tools: Record<string, unknown>): Record<string, unknown> {
  const transformedTools: Record<string, unknown> = {};

  for (const [toolName, tool] of Object.entries(tools)) {
    if (tool && typeof tool === 'object') {
      const toolObj = tool as Record<string, unknown>;
      const transformedTool = { ...toolObj };

      // Transform input schema if present
      if (transformedTool.inputSchema) {
        transformedTool.inputSchema = transformSchemaForGoogleAI(transformedTool.inputSchema);
      }

      // Transform output schema if present
      if (transformedTool.outputSchema) {
        transformedTool.outputSchema = transformSchemaForGoogleAI(transformedTool.outputSchema);
      }

      // Transform any other schema fields
      if (transformedTool.schema) {
        transformedTool.schema = transformSchemaForGoogleAI(transformedTool.schema);
      }

      transformedTools[toolName] = transformedTool;
      logger.debug(`Transformed tool ${toolName} for Google AI compatibility`);
    }
  }

  return transformedTools;
}

/**
 * Primary MCP Client for Stdio-based servers (filesystem, docker, local tools)
 * These use direct command execution and are more reliable
 */
export const mcpStdio = new MCPClient({
  id: 'stdio-servers',
  timeout: 60000,
  servers: {
    filesystem: {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\dm\\Documents\\deanmachines-rsc\\data",
      ],
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:filesystem] ${logMessage.message}`, { level: logMessage.level });
      }
    },
    git: {
      command: "uvx",
      args: ["mcp-server-git", "--repository", "C:\\Users\\dm\\Documents\\deanmachines-rsc"],
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:git] ${logMessage.message}`, { level: logMessage.level });
      }
    },
    fetch: {
      command: "uvx",
      args: ["mcp-server-fetch"],
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:fetch] ${logMessage.message}`, { level: logMessage.level });
      }
    },
    puppeteer: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-puppeteer"],
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:puppeteer] ${logMessage.message}`, { level: logMessage.level });
      }
    },
//    githubchat: {
//      command: "uvx",
//      args: ["github-chat-mcp"],
//      env: {
//        GITHUB_TOKEN: process.env.GITHUB_TOKEN! || ""
//      },
//      timeout: 60000,
//      enableServerLogs: true,
//      logger: (logMessage) => {
//        logger.info(`[MCP:githubchat] ${logMessage.message}`, { level: logMessage.level });
//      }
//    },
    github: {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN! || ""
      },
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:github] ${logMessage.message}`, { level: logMessage.level });
      }
    },
    memoryGraph: {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      env: {
        "MEMORY_FILE_PATH": "C:\\Users\\dm\\Documents\\deanmachines-rsc\\graphs.json"
      },
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:memoryGraph] ${logMessage.message}`, { level: logMessage.level });
      }
    },
    ddgsearch: {
      command: "uvx",
      args: ["duckduckgo-mcp-server"],
      timeout: 60000,
      enableServerLogs: true,
      logger: (logMessage) => {
        logger.info(`[MCP:memoryGraph] ${logMessage.message}`, { level: logMessage.level }); // Note: This logger prefix seems to be a copy-paste error from memoryGraph, consider changing to [MCP:ddgsearch]
      }
    }
//  terminalController: {
//    command: "uvx",
//    args: ["terminal_controller", "C:\\Users\\dm\\Documents\\deanmachines-rsc\\.next\\var"],
//    timeout: 60000,
//    enableServerLogs: true,
//    logger: (logMessage) => {
//      logger.info(`[MCP:terminalController] ${logMessage.message}`, { level: logMessage.level });
//    }
//  }
//    docker: {
//      command: "docker",
//      args: ["run", "-i", "--rm", "alpine/socat", "STDIO", "TCP:host.docker.internal:8811"],
//      timeout: 25000,
//      enableServerLogs: true,
//      logger: (logMessage) => {
//        logger.info(`[MCP:docker] ${logMessage.message}`, { level: logMessage.level });
//      }
//    },
},
});

/**
 * Main MCP interface - routes operations to appropriate client (Stdio or Smithery)
 * This maintains backward compatibility while adding dual-client support
 */
export const mcp = {  /**
   * Get all tools from both clients as an object (for Agent compatibility)
   */
  async getTools(): Promise<Record<string, unknown>> {
    const allTools: Record<string, unknown> = {};

    try {
      const stdioTools = await mcpStdio.getTools();
      // Filter out null/undefined tools and validate
      if (stdioTools && typeof stdioTools === 'object') {
        for (const [key, tool] of Object.entries(stdioTools)) {
          if (tool != null && typeof tool === 'object') {
            allTools[key] = tool;
          }
        }
      }
    } catch (error) {
      logger.error('Failed to get Stdio MCP tools', { error: error instanceof Error ? error.message : 'Unknown error' });
    }

//    if (mcpSmithery) {
//      try {
//        const smitheryTools = await mcpSmithery.getTools();
//        // Filter out null/undefined tools and validate
//        if (smitheryTools && typeof smitheryTools === 'object') {
//          for (const [key, tool] of Object.entries(smitheryTools)) {
//            if (tool != null && typeof tool === 'object') {
//              allTools[key] = tool;
//            }
//          }
//        }
//      } catch (error) {
//        logger.error('Failed to get Smithery MCP tools', { error: error instanceof Error ? error.message : 'Unknown error' });
//      }
//    }

    // Transform tools to ensure Google AI compatibility (remove ZodNull types)
    const transformedTools = transformMCPToolsForGoogleAI(allTools);
    logger.info(`Transformed ${Object.keys(transformedTools).length} MCP tools for Google AI compatibility`);

    return transformedTools;
  },/**   * Get all tools as a flat array (for internal processing)
   */
  async getToolsArray(): Promise<unknown[]> {
    const tools: unknown[] = [];

    try {
      const stdioTools = await mcpStdio.getTools();
      if (stdioTools && typeof stdioTools === 'object') {
        // Filter out null/undefined tools before adding to array
        const validTools = Object.values(stdioTools).filter(tool => tool != null && typeof tool === 'object');
        tools.push(...validTools);
      }
    } catch (error) {
      logger.error('Failed to get Stdio MCP tools', { error: error instanceof Error ? error.message : 'Unknown error' });
    }

//    if (mcpSmithery) {
//      try {
//        const smitheryTools = await mcpSmithery.getTools();
//        if (smitheryTools && typeof smitheryTools === 'object') {
//          // Filter out null/undefined tools before adding to array
//          const validTools = Object.values(smitheryTools).filter(tool => tool != null && typeof tool === 'object');
//          tools.push(...validTools);
//        }
//      } catch (error) {
//        logger.error('Failed to get Smithery MCP tools', { error: error instanceof Error ? error.message : 'Unknown error' });
//      }
//    }

    return tools;
  },
  /**
   * Get all toolsets from both clients
   */
  async getToolsets() {
    const toolsets = {};

    try {
      const stdioToolsets = await mcpStdio.getToolsets();
      Object.assign(toolsets, stdioToolsets);
    } catch (error) {
      logger.error('Failed to get Stdio MCP toolsets', { error: error instanceof Error ? error.message : 'Unknown error' });
    }

//    if (mcpSmithery) {
//      try {
//        const smitheryToolsets = await mcpSmithery.getToolsets();
//        Object.assign(toolsets, smitheryToolsets);
//     } catch (error) {
//        logger.error('Failed to get Smithery MCP toolsets', { error: error instanceof Error ? error.message : 'Unknown error' });
//      }
//    }

    return toolsets;
  },

  /**
   * Call a tool on the appropriate server
   */
  async callTool(server: string, toolName: string, args: Record<string, unknown> = {}) {
    const client = this.getClientForServer(server);
    if (!client) {
      throw new Error(`Server '${server}' not found in any MCP client`);
    }

    const toolsets = await client.getToolsets();
    const serverToolset = toolsets[server];
    if (!serverToolset || !serverToolset[toolName]) {
      throw new Error(`Tool '${toolName}' not found on server '${server}'`);
    }

    return await serverToolset[toolName](args);
  },
  /**
   * List tools for a specific server
   */
  async listTools(server: string) {
    const client = this.getClientForServer(server);
    if (!client) {
      throw new Error(`Server '${server}' not found in any MCP client`);
    }

    const tools = await client.getTools();
    return tools[server] || [];
  },
  /**
   * Safely disconnect all MCP clients
   */
  async disconnect() {
    const promises = [];

    try {
      promises.push(mcpStdio.disconnect());
    } catch (error) {
      logger.error('Error disconnecting Stdio MCP client', { error: error instanceof Error ? error.message : 'Unknown error' });
    }

//     if (mcpSmithery) {
//      try {
//        promises.push(mcpSmithery.disconnect());
//      } catch (error) {
//        logger.error('Error disconnecting Smithery MCP client', { error: error instanceof Error ? error.message : 'Unknown error' });
//      }
//    }

    await Promise.allSettled(promises);
    logger.info('All MCP clients disconnected');
  },

  /**
   * Get the appropriate client for a server
   */
  getClientForServer(server: string) {
    const stdioServers = ['filesystem', 'docker', 'git', 'time'];


    if (stdioServers.includes(server)) {
      return mcpStdio;
    }
    return null;
  },

  /**
   * Resources interface for both clients
   */
  resources: {
    async list() {
      const resources = {};

      try {
        const stdioResources = await mcpStdio.resources.list();
        Object.assign(resources, stdioResources);
      } catch (error) {
        logger.error('Failed to list Stdio MCP resources', { error: error instanceof Error ? error.message : 'Unknown error' });
      }

//      if (mcpSmithery) {
//        try {
//          const smitheryResources = await mcpSmithery.resources.list();
//          Object.assign(resources, smitheryResources);
//        } catch (error) {
//          logger.error('Failed to list Smithery MCP resources', { error: error instanceof Error ? error.message : 'Unknown error' });
//        }
//      }

      return resources;
    },

    async templates() {
      const templates = {};

      try {
        const stdioTemplates = await mcpStdio.resources.templates();
        Object.assign(templates, stdioTemplates);
      } catch (error) {
        logger.error('Failed to get Stdio MCP resource templates', { error: error instanceof Error ? error.message : 'Unknown error' });
      }

//      if (mcpSmithery) {
//        try {
//          const smitheryTemplates = await mcpSmithery.resources.templates();
//          Object.assign(templates, smitheryTemplates);
//        } catch (error) {
//          logger.error('Failed to get Smithery MCP resource templates', { error: error instanceof Error ? error.message : 'Unknown error' });
//        }
//      }

      return templates;
    },

    async read(server: string, uri: string) {
      const client = this.getClientForServer(server);
      if (!client) {
        throw new Error(`Server '${server}' not found in any MCP client`);
      }
      return await client.resources.read(server, uri);
    },

    async subscribe(server: string, uri: string) {
      const client = this.getClientForServer(server);
      if (!client) {
        throw new Error(`Server '${server}' not found in any MCP client`);
      }
      return await client.resources.subscribe(server, uri);
    },

    async unsubscribe(server: string, uri: string) {
      const client = this.getClientForServer(server);
      if (!client) {
        throw new Error(`Server '${server}' not found in any MCP client`);
      }
      return await client.resources.unsubscribe(server, uri);
    },

    getClientForServer(server: string) {
      const stdioServers = ['filesystem', 'docker'];

      if (stdioServers.includes(server)) {
        return mcpStdio;
//      } else if (smitheryServers.includes(server) && mcpSmithery) {
//        return mcpSmithery;
      }
      return null;
    }
  }
};

/**
 * Graceful shutdown handler for MCP clients
 */
export const setupMCPShutdownHandlers = () => {
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down MCP clients gracefully...`);
    try {
      await mcp.disconnect();
      logger.info('MCP clients disconnected successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Error during MCP shutdown', { error: error instanceof Error ? error.message : 'Unknown error' });
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('beforeExit', () => gracefulShutdown('beforeExit'));
};

// Initialize shutdown handlers
setupMCPShutdownHandlers();

/**
 * MCP Operation Tracker for detailed analytics
 */
export class MCPTracker {
  private static operations: Array<{
    timestamp: string;
    server: string;
    operation: string;
    tool?: string;
    resource?: string;
    duration: number;
    status: 'success' | 'error';
    metadata?: Record<string, unknown>;
  }> = [];

  /**
   * Records an MCP operation for analytics
   */
  static recordOperation(
    server: string,
    operation: string,
    duration: number,
    status: 'success' | 'error',
    tool?: string,
    resource?: string,
    metadata?: Record<string, unknown>
  ): void {
    const record = {
      timestamp: new Date().toISOString(),
      server,
      operation,
      tool,
      resource,
      duration,
      status,
      metadata
    };

    this.operations.push(record);

    // Keep only last 1000 operations to prevent memory issues
    if (this.operations.length > 1000) {
      this.operations.shift();
    }

      //observabilityLogger.info(`MCP operation: ${server}:${operation}`, record);
    }

  /**
   * Gets MCP operation analytics
   */
  static getOperationHistory(limit: number = 100): typeof MCPTracker.operations {
    return this.operations.slice(-limit);
  }

  /**
   * Gets MCP analytics by server
   */
  static getServerOperations(server: string): typeof MCPTracker.operations {
    return this.operations.filter(op => op.server === server);
  }

  /**
   * Gets MCP performance statistics
   */
  static getPerformanceStats(): {
    totalOperations: number;
    avgDuration: number;
    successRate: number;
    serverBreakdown: Record<string, number>;
    operationBreakdown: Record<string, number>;
    errorRate: number;
  } {
    const operations = this.operations;
    const totalOps = operations.length;

    if (totalOps === 0) {
      return {
        totalOperations: 0,
        avgDuration: 0,
        successRate: 0,
        serverBreakdown: {},
        operationBreakdown: {},
        errorRate: 0
      };
    }

    const successfulOps = operations.filter(op => op.status === 'success');
    const avgDuration = operations.reduce((sum, op) => sum + op.duration, 0) / totalOps;

    const serverBreakdown = operations.reduce((acc, op) => {
      acc[op.server] = (acc[op.server] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const operationBreakdown = operations.reduce((acc, op) => {
      acc[op.operation] = (acc[op.operation] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOperations: totalOps,
      avgDuration: Math.round(avgDuration * 100) / 100,
      successRate: (successfulOps.length / totalOps) * 100,
      serverBreakdown,
      operationBreakdown,
      errorRate: ((totalOps - successfulOps.length) / totalOps) * 100
    };
  }

  /**
   * Clears all recorded operations
   */
  static clearHistory(): void {
    this.operations = [];
  }
}

/**
 * Enhanced MCP operation wrapper with comprehensive tracing *
 * @param server - MCP server name
 * @param operation - Operation type (e.g., 'listTools', 'callTool', 'listResources')
 * @param fn - Function to execute
 * @returns Result with tracing metadata
 */
export const traceMCPOperation = async <T>(
  server: string,
  operation: string,
  fn: () => Promise<T>,
  tool?: string,
  resource?: string
): Promise<T> => {
  const startTime = Date.now();

  try {
    //observabilityLogger.debug(`Starting MCP operation: ${server}:${operation}`, {
   //   server,
   //   operation,
   //   tool,
   //   resource
    //});

    const result = await fn();
    const duration = Date.now() - startTime;

    MCPTracker.recordOperation(server, operation, duration, 'success', tool, resource);

    //observabilityLogger.debug(`MCP operation completed: ${server}:${operation}`, {
   //   server,
   //   operation,
   //   tool,
   //   resource,
   //   duration: `${duration}ms`,
   //   status: 'success'
    //});

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    MCPTracker.recordOperation(server, operation, duration, 'error', tool, resource, {
      error: errorMessage
    });

    //ErrorTracker.recordError(`MCP:${server}:${operation}`, errorMessage, {
   //   server,
   //   operation,
   //   tool,
   //   resource,
   //   duration: `${duration}ms`
   // });

    //observabilityLogger.error(`MCP operation failed: ${server}:${operation}`, {
   //   server,
   //   operation,
   //   tool,
   //   resource,
   //   duration: `${duration}ms`,
   //   status: 'error',
   //   error: errorMessage
   // });

    throw error;
  }
};

/**
 * Traced MCP tool execution
 *
 * @param server - MCP server name
 * @param toolName - Tool to execute
 * @param args - Tool arguments
 * @returns Tool execution result with tracing
 */
export const executeTracedMCPTool = async (
  server: string,
  toolName: string,
  args: Record<string, unknown> = {}
): Promise<unknown> => {
  return await traceMCPOperation(
    server,
    'callTool',
    async () => {      const tools = await mcp.listTools(server);
      const tool = tools.find((t: { name: string }) => t.name === toolName);

      if (!tool) {
        throw new Error(`Tool '${toolName}' not found on server '${server}'`);
      }

      return await mcp.callTool(server, toolName, args);
    },
    toolName
  );
};
/**
 * Traced MCP resource access
 *
 * @param server - MCP server name
 * @param resourceUri - Resource URI to access
 * @returns Resource content with tracing
 */
export const getTracedMCPResource = async (
  server: string,
  resourceUri: string
): Promise<Record<string, unknown>> => {
  return await traceMCPOperation(
    server,
    'readResource',
    async () => {
      return await mcp.resources.read(server, resourceUri);
    },
    undefined,
    resourceUri
  );
};
/**
 * Traced MCP server tools listing
 *
 * @param server - MCP server name
 * @returns Available tools with tracing
 */
export const listTracedMCPTools = async (server: string): Promise<{ name: string; description?: string }[]> => {
  return await traceMCPOperation(
    server,
    'listTools',
    async () => {
      return await mcp.listTools(server);
    }
  );
};
/**
 * Traced MCP server resources listing
 *
 * @param server - MCP server name
 * @returns Available resources with tracing
 */
export const listTracedMCPResources = async (server: string): Promise<{ name: string; description?: string }[]> => {
  return await traceMCPOperation(
    server,
    'listResources',    async () => {
      const resources = await mcp.resources.list() as Record<string, { name: string; description?: string }[]>;
      return resources[server] || [];
    }
  );
};
/**
 * Traced MCP toolsets retrieval for dynamic usage
 *
 * @returns All toolsets from all servers with tracing
 */
export const getTracedMCPToolsets = async (): Promise<Record<string, unknown>> => {
  return await traceMCPOperation(
    'all-servers',
    'getToolsets',
    async () => {
      return await mcp.getToolsets();
    }
  );
};
/**
 * Traced MCP tools retrieval for static usage
 *
 * @returns All tools from all servers with tracing
 */
export const getTracedMCPTools = async (): Promise<{ name: string; description?: string }[]> => {
  return await traceMCPOperation(
    'all-servers',
    'getTools',
    async () => {
      const tools = await mcp.getToolsArray();
      return tools.map((tool: unknown) => {
        // Type guard for tool objects
        if (typeof tool === 'object' && tool !== null) {
          const toolObj = tool as Record<string, unknown>;
          const inputSchema = toolObj.inputSchema as Record<string, unknown> | undefined;
          return {
            name: (toolObj.id as string) || (toolObj.label as string) || (toolObj.name as string) || 'unnamed-tool',
            description: (toolObj.description as string) || (inputSchema?.description as string) || undefined
          };
        }
        return {
          name: 'unknown-tool',
          description: undefined
        };
      });
    }
  );
};
/**
 * Traced MCP resource listing across all servers
 *
 * @returns Resources grouped by server with tracing
 */
export const listAllTracedMCPResources = async (): Promise<Record<string, { name: string; description?: string }[]>> => {
  return await traceMCPOperation(
    'all-servers',
    'listAllResources',
    async () => {
      return await mcp.resources.list();
    }
  );
};
/**
 * Traced MCP resource templates listing
 *
 * @returns Resource templates grouped by server with tracing
 */
export const getTracedMCPResourceTemplates = async (): Promise<Record<string, { name: string; description?: string }[]>> => {
  return await traceMCPOperation(
    'all-servers',
    'getResourceTemplates',
    async () => {
      return await mcp.resources.templates();
    }
  );
};
/**
 * Traced MCP resource subscription
 *
 * @param server - MCP server name
 * @param resourceUri - Resource URI to subscribe to
 * @returns Subscription result with tracing
 */
export const subscribeToTracedMCPResource = async (
  server: string,
  resourceUri: string
): Promise<Record<string, unknown>> => {
  return await traceMCPOperation(
    server,
    'subscribeResource',
    async () => {
      return await mcp.resources.subscribe(server, resourceUri);
    },
    undefined,
    resourceUri
  );
};
/**
 * Traced MCP resource unsubscription
 *
 * @param server - MCP server name
 * @param resourceUri - Resource URI to unsubscribe from
 * @returns Unsubscription result with tracing
 */
export const unsubscribeFromTracedMCPResource = async (
  server: string,
  resourceUri: string
): Promise<Record<string, unknown>> => {
  return await traceMCPOperation(
    server,
    'unsubscribeResource',
    async () => {
      return await mcp.resources.unsubscribe(server, resourceUri);
    },
    undefined,
    resourceUri
  );
};
/**
 * Enhanced MCP resource reading with caching and performance tracking
 *
 * @param server - MCP server name
 * @param resourceUri - Resource URI to read
 * @param useCache - Whether to use cached result if available
 * @returns Resource content with enhanced metadata
 */
export const getEnhancedTracedMCPResource = async (
  server: string,
  resourceUri: string,
  useCache: boolean = false
): Promise<{ content: unknown; metadata: Record<string, string | number | boolean> }> => {
  return await traceMCPOperation(
    server,
    'enhancedReadResource',
    async () => {
      const startTime = Date.now();

      // Simple in-memory cache (could be enhanced with Redis/etc.)
      const cacheKey = `${server}:${resourceUri}`;
      if (useCache && resourceCache.has(cacheKey)) {
        const cached = resourceCache.get(cacheKey)!;
        const age = Date.now() - cached.timestamp;

        if (age < 300000) { // 5 minutes cache
          //observabilityLogger.debug('MCP resource cache hit', {
          //  server,
          //  resourceUri,
          //  cacheAge: `${age}ms`
          //});

          return {
            content: cached.content,
            metadata: {
              ...cached.metadata,
              cached: true,
              cacheAge: age
            }
          };
        }
      }

      const result = await mcp.resources.read(server, resourceUri);
      const readDuration = Date.now() - startTime;

      const metadata = {
        server,
        resourceUri,
        readDuration: `${readDuration}ms`,
        timestamp: new Date().toISOString(),
        cached: false,
        contentSize: JSON.stringify(result).length
      };

      // Cache the result
      if (useCache) {
        resourceCache.set(cacheKey, {
          content: result,
          metadata,
          timestamp: Date.now()
        });
      }

      return {
        content: result,
        metadata
      };
    },
    undefined,
    resourceUri
  );
};
// Simple in-memory cache for resources
const resourceCache = new Map<string, {
  content: unknown;
  metadata: Record<string, string | number | boolean>;
  timestamp: number
}>();

/**
 * Clear resource cache */
export function clearMCPResourceCache() {
  resourceCache.clear();
  //observabilityLogger.info('MCP resource cache cleared');
}

/**
 * Get MCP analytics and performance metrics
 *
 * @returns Comprehensive MCP analytics
 */
export function getMCPAnalytics() {
  return {
    performance: MCPTracker.getPerformanceStats(),
    recentOperations: MCPTracker.getOperationHistory(50),
    serverStatus: {
      filesystem: 'configured',
      winterm: 'configured',
      duckduckgo: 'configured',
      jsSandbox: 'configured',
      docker: 'configured'
    },
    configuration: {

      totalServers: 5
    }
  };
}

/**
 * Get MCP analytics for a specific server
 *
 * @param server - Server name
 * @returns Server-specific analytics
 */
export function getMCPServerAnalytics(server: string) {
  return {
    operations: MCPTracker.getServerOperations(server),
    performance: MCPTracker.getPerformanceStats()
  };
}

/**
 * Clear all MCP analytics data
 */
export function clearMCPAnalytics() {
  MCPTracker.clearHistory();
  //observabilityLogger.info('MCP analytics cleared');
}

/**
 * Health check for all MCP servers
 *
 * @returns Health status of all servers
 */
//export const checkMCPServersHealth = createTraceableAgent(
//  'mcp-health-check',
//  async (): Promise<Record<string, { status: string; tools?: number; error?: string }>> => {
//    const servers = ['filesystem', 'jsSandbox', 'docker'];
//    const healthStatus: Record<string, { status: string; tools?: number; error?: string }> = {};

//    for (const server of servers) {
//      try {
//        const tools = await listTracedMCPTools(server);
//        healthStatus[server] = {
//          status: 'healthy',
//          tools: tools.length
//        };
//      } catch (error) {
//        healthStatus[server] = {
//          status: 'error',
//          error: error instanceof Error ? error.message : 'Unknown error'
//        };
//      }
//    }

    //observabilityLogger.info('MCP servers health check completed', { healthStatus });
    //return healthStatus;
  //}
//);

// Generated on 2025-06-01 - Enhanced with comprehensive MCP tracing and analytics
