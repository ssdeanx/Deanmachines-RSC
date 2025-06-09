
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { masterAgent } from './agents/master-agent';
import { AISDKExporter } from "langsmith/vercel";
import { Client } from "langsmith";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, masterAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
        serviceName: process.env.LANGSMITH_PROJECT || "pr-warmhearted-jewellery-74",
        enabled: process.env.LANGSMITH_TRACING === "true",
        export: {
            type: "custom",
            exporter: new AISDKExporter({
                client: new Client({
                    apiKey: process.env.LANGSMITH_API_KEY!,
                    apiUrl: process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com",
                }),
                projectName: process.env.LANGSMITH_PROJECT || "pr-warmhearted-jewellery-74",
            }),
        },
    },
});

