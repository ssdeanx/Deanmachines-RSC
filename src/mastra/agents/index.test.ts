src/mastra/agents/index.test.ts

import { describe, it, expect } from "vitest";
import { evaluate } from "@mastra/evals";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";
import { myAgent } from "./index";
 
describe("My Agent", () => {
  it("should validate tone consistency", async () => {
    const metric = new ToneConsistencyMetric();
    const result = await evaluate(myAgent, "Hello, world!", metric);
 
    expect(result.score).toBe(1);
  });
});