"use server";

import { mastra } from "../../../mastra";

// this is a server action that can be called from a client component

// This is example replace it with xy flow graph agent & git agent usage in a client component: 
export async function getWeatherInfo(formData: FormData) {
  const city = formData.get("city")?.toString();
  const agent = mastra.getAgent("graph"); // Assuming 'graph' is the agent for handling graph-related tasks
 
  const result = await agent.generate(`What's the weather like in ${city}?`);
 
  return result.text;
}