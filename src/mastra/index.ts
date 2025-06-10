
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { agentRegistry } from './agents';

import { langsmithConfig, createTelemetryConfig, EnhancedAISDKExporter } from './config';
import { Client } from 'langsmith';

export const mastra = new Mastra({
    workflows: { weatherWorkflow },
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
        }
    })
});