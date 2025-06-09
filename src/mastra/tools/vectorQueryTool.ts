import { fastembed } from '@mastra/fastembed';
import { createVectorQueryTool } from "@mastra/rag";
import { RuntimeContext } from "@mastra/core/runtime-context";

export const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "agentMemory",
  indexName: "context",
  model: fastembed
});
