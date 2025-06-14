import { Agent } from '@mastra/core/agent';
import { createTracedGoogleModel } from '../config';
import { weatherTool } from '../tools/weather-tool';
import { agentMemory } from '../agentMemory';
import { mcp } from '../tools/mcp';

/**
 * Runtime context type for the Weather Agent
 * Stores weather-specific preferences and location context
 * 
 * @mastra WeatherAgent runtime context interface
 * [EDIT: 2025-06-14] [BY: GitHub Copilot]
 */
export type WeatherAgentRuntimeContext = {
  /** Unique identifier for the user */
  "user-id": string;
  /** Unique identifier for the session */
  "session-id": string;
  /** Temperature unit preference */
  "temperature-unit": "celsius" | "fahrenheit";
  /** Default location for weather queries */
  "default-location": string;
  /** Include extended forecast */
  "extended-forecast": boolean;
  /** Include weather alerts */
  "include-alerts": boolean;
  /** Timezone preference */
  "timezone": string;
};

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isnt in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: createTracedGoogleModel('gemini-2.5-flash-preview-05-20', {
          name: 'weather-agent',
          tags: ['agent', 'weather', 'debug'],
          thinkingConfig: {
              thinkingBudget: 0,
              includeThoughts: false,
          },
    }),
  tools: { 
    weatherTool,
    ...await mcp.getTools(),
  },
  memory: agentMemory
});
