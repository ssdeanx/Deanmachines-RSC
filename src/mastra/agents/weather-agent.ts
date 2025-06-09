import { Agent } from '@mastra/core/agent';
import { createTracedGoogleModel } from '../config';
import { weatherTool } from '../tools/weather-tool';
import { agentMemory } from '../agentMemory';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
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
  tools: { weatherTool },
  memory: agentMemory
});
