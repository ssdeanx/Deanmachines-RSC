---
applyTo: "src/mastra/**/*.ts"
---
# Mastra AI Backend Guidelines

- Ensure all Mastra-related code is placed in the `src/mastra` directory.
- Use TypeScript for all Mastra-related files.
- Follow the Mastra API structure and conventions.
- Use the `mastra` prefix for all Mastra-related functions, classes, and variables.
- Document all Mastra-related code with TSDoc comments.
- Use the `@mastra` tag for all Mastra-related TSDoc comments.

# structure

```txt
📂mastra
┣ 📂agents
┃ ┣ 📜analyzer-agent.ts
┃ ┣ 📜browser-agent.ts
┃ ┣ 📜code-agent.ts
┃ ┣ 📜data-agent.ts
┃ ┣ 📜debug-agent.ts
┃ ┣ 📜design-agent.ts
┃ ┣ 📜docker-agent.ts
┃ ┣ 📜documentation-agent.ts
┃ ┣ 📜evolve-agent.ts
┃ ┣ 📜git-agent.ts
┃ ┣ 📜graph-agent.ts
┃ ┣ 📜index.test.ts
┃ ┣ 📜index.ts
┃ ┣ 📜manager-agent.ts
┃ ┣ 📜marketing-agent.ts
┃ ┣ 📜master-agent.ts
┃ ┣ 📜processing-agent.ts
┃ ┣ 📜research-agent.ts
┃ ┣ 📜special-agent.ts
┃ ┣ 📜strategizer-agent.ts
┃ ┣ 📜supervisor-agent.ts
┃ ┣ 📜sysadmin-agent.ts
┃ ┣ 📜utility-agent.ts
┃ ┗ 📜weather-agent.ts
┣ 📂config
┃ ┣ 📜environment.ts
┃ ┣ 📜googleProvider.ts
┃ ┗ 📜index.ts
┣ 📂tools
┃ ┣ 📜graphRAG.ts
┃ ┣ 📜mcp.ts
┃ ┣ 📜stock-tools.ts
┃ ┣ 📜vectorQueryTool.ts
┃ ┗ 📜weather-tool.ts
┣ 📂workflows
┃ ┗ 📜weather-workflow.ts
┣ 📜agentMemory.ts
┗ 📜index.ts
```