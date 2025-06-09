import { fastembed } from '@mastra/fastembed';
import { createVectorQueryTool } from "@mastra/rag";


export const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "agentMemory",
  indexName: "context",
  model: fastembed.base,
  description: "Useful for when you need to answer questions about the current state of the world. Input should be a fully formed question."
});
