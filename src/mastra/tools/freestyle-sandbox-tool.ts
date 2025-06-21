import { executeTool } from "freestyle-sandboxes/mastra";

export const codeExecutor = executeTool({
  apiKey: process.env.FREESTYLE_API_KEY!,
  nodeModules: {
    resend: "4.0.1",
    octokit: "4.1.0",
  },
  envVars: {
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN!,
  },
});
