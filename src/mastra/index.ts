import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { codeGraphMakerWorkflow } from './workflows/code-graph-maker';
import { advancedCodeGraphMakerWorkflow } from './workflows/code-graph-maker-advanced';
import { agentRegistry } from './agents';
import { registerCopilotKit } from "@mastra/agui";

import { langsmithConfig, createTelemetryConfig, EnhancedAISDKExporter } from './config';
import { Client } from 'langsmith';
import { MasterAgentRuntimeContext } from './agents/master-agent';

// Generated on [Current Date Time]
/**
 * Defines the runtime context for the weather agent.
 * This context can store information like user preferences or session data.
 */
interface WeatherRuntimeContext {
  /** The unique identifier for the user. */
  "user-id": string;

  /** The unique identifier for the session. */
  "session-id": string;

  /** The temperature scale preference ("celsius" or "fahrenheit"). */
  "temperature-scale": "celsius" | "fahrenheit";
}

export const mastra = new Mastra({
    workflows: {
        weatherWorkflow,
        codeGraphMakerWorkflow,
        advancedCodeGraphMakerWorkflow
    },
    agents: agentRegistry,
    logger: new PinoLogger({
        name: 'Mastra',
        level: 'info',
    }),
    telemetry: createTelemetryConfig({
        serviceName: "mastra-ai",
        serviceVersion: "0.0.1",
        enabled: langsmithConfig.tracingEnabled,
        sampling: {
            type: "ratio",
            probability: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
        },
        export: {
            type: "custom",
            exporter: new EnhancedAISDKExporter({
                projectName: langsmithConfig.project,
                client: new Client(langsmithConfig),
                debug: process.env.NODE_ENV !== 'production',
            }),
            overrides: {
                // Add any additional exporter options here
                // For example, you can set a custom export interval
                exportInterval: 5000, // Export every 5 seconds
                // Or set a custom export batch size
                exportBatchSize: 10, // Export in batches of 10
                // You can also set a custom export URL if needed
                // exportUrl: 'https://your-custom-export-url.com',
                // You can add any other custom options supported by EnhancedAISDKExporter
                // For example, you can enable or disable specific features
                enableDebug: process.env.NODE_ENV !== 'development', // Enable debug mode in non-production environments
                enableErrorTracking: true, // Enable error tracking
                enablePerformanceMetrics: true, // Enable performance metrics
                enableRequestResponseLogging: true, // Enable request/response logging
                // You can also set custom headers or authentication tokens if required
                // headers: {
                //     'Authorization': `Bearer ${process.env.MASTRA_API_KEY}`,
                //     'X-Custom-Header': 'CustomValue'
                // },
                // You can also set a custom retry strategy for failed exports
                // retryStrategy: {
                //     maxRetries: 3, // Maximum number of retries for failed exports
                //     retryDelay: 1000, // Delay between retries in milliseconds
                //     retryOnError: (error) => {
                //         // Custom logic to determine if the export should be retried based on the error
                //         return error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT';
                //     }
                // }
            }
        },
        server: {
            cors: {
                origin: "*",
                allowMethods: ["*"],
                allowHeaders: ["*"],
            }
        },
        apiRoutes: [
            // CORE AGENTS
            // Master Agent - Primary problem solver
            registerCopilotKit<MasterAgentRuntimeContext>({
                path: "/copilotkit/master",
                resourceId: "master",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                    runtimeContext.set("project-context", c.req.header("X-Project-Context") || "");
                    runtimeContext.set("debug-mode", c.req.header("X-Debug-Mode") === "true");
                }
            }),
            // Strategizer Agent - Strategic planning
            registerCopilotKit({
                path: "/copilotkit/strategizer",
                resourceId: "strategizer",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Analyzer Agent - Data analysis
            registerCopilotKit({
                path: "/copilotkit/analyzer",
                resourceId: "analyzer",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Evolve Agent - Agent improvement
            registerCopilotKit({
                path: "/copilotkit/evolve",
                resourceId: "evolve",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Supervisor Agent - Agent coordination
            registerCopilotKit({
                path: "/copilotkit/supervisor",
                resourceId: "supervisor",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),

            // DEVELOPMENT AGENTS
            // Code Agent - Code analysis and generation
            registerCopilotKit({
                path: "/copilotkit/code",
                resourceId: "code",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Git Agent - Version control
            registerCopilotKit({
                path: "/copilotkit/git",
                resourceId: "git",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Docker Agent - Containerization
            registerCopilotKit({
                path: "/copilotkit/docker",
                resourceId: "docker",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Debug Agent - Debugging and troubleshooting
            registerCopilotKit({
                path: "/copilotkit/debug",
                resourceId: "debug",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),

            // DATA AGENTS
            // Data Agent - Data analysis
            registerCopilotKit({
                path: "/copilotkit/data",
                resourceId: "data",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Graph Agent - Knowledge graph analysis
            registerCopilotKit({
                path: "/copilotkit/graph",
                resourceId: "graph",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Processing Agent - Data processing
            registerCopilotKit({
                path: "/copilotkit/processing",
                resourceId: "processing",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Research Agent - Research and analysis
            registerCopilotKit({
                path: "/copilotkit/research",
                resourceId: "research",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Weather Agent - Weather information
            registerCopilotKit<WeatherRuntimeContext>({
                path: "/copilotkit/weather",
                resourceId: "weather",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                    runtimeContext.set("temperature-scale", "celsius");
                }
            }),

            // MANAGEMENT AGENTS
            // Manager Agent - Project management
            registerCopilotKit({
                path: "/copilotkit/manager",
                resourceId: "manager",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Marketing Agent - Marketing and content
            registerCopilotKit({
                path: "/copilotkit/marketing",
                resourceId: "marketing",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),

            // OPERATIONS AGENTS
            // Sysadmin Agent - System administration
            registerCopilotKit({
                path: "/copilotkit/sysadmin",
                resourceId: "sysadmin",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Browser Agent - Web automation
            registerCopilotKit({
                path: "/copilotkit/browser",
                resourceId: "browser",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Utility Agent - General utilities
            registerCopilotKit({
                path: "/copilotkit/utility",
                resourceId: "utility",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),

            // CREATIVE AGENTS
            // Design Agent - UI/UX design
            registerCopilotKit({
                path: "/copilotkit/design",
                resourceId: "design",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),
            // Documentation Agent - Technical writing
            registerCopilotKit({
                path: "/copilotkit/documentation",
                resourceId: "documentation",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),

            // SPECIALIZED AGENTS
            // Special Agent - Multi-domain expert
            registerCopilotKit({
                path: "/copilotkit/special",
                resourceId: "special",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                }
            }),

            // WORKFLOW COPILOTKIT ENDPOINTS
            // Code Graph Maker Workflow - Basic
            registerCopilotKit({
                path: "/copilotkit/codeGraphMakerWorkflow",
                resourceId: "codeGraphMakerWorkflow",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                    runtimeContext.set("workflow-type", "code-graph-basic");
                }
            }),
            // Advanced Code Graph Maker Workflow
            registerCopilotKit({
                path: "/copilotkit/advancedCodeGraphMakerWorkflow",
                resourceId: "advancedCodeGraphMakerWorkflow",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                    runtimeContext.set("workflow-type", "code-graph-advanced");
                }
            }),
            // Weather Workflow
            registerCopilotKit({
                path: "/copilotkit/weatherWorkflow",
                resourceId: "weatherWorkflow",
                setContext: (c, runtimeContext) => {
                    runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
                    runtimeContext.set("session-id", c.req.header("X-Session-ID") || `session-${Date.now()}`);
                    runtimeContext.set("workflow-type", "weather");
                }
            })
        ]
    })
});
