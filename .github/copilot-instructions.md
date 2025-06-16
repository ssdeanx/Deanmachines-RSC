---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

---
description: AI rules derived by SpecStory from the project AI interaction history
applyTo: *
---

## Headers

This file contains the rules and guidelines for the AI coding assistant to follow while working on this project. It covers project structure, coding standards, workflow, and other relevant information. This is a living document and will be updated as the project evolves.

## TECH STACK

- TypeScript (version >= 5.8)
- React (version >= 19)
- CopilotKit (version >= 1.8.14)
- OpenAPI
- Lucide React
- Tailwind CSS (version >= v4)
- Python
- Neo4j (version >= 5.26.0)
- Next.js (version >= 15)
- Mastra Core (version >= v0.10.5)
- Google Gemini 2.5 Flash
- LibSQL/Turso
- shadcn/ui component library
- LangSmith
- Langfuse
- OpenTelemetry
- quick-lru
- CODECOV
- ag-ui
- Windsurf AI IDE
- fastembed

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

- All files relevant to a user request should be checked, including those specified with the `#file://copilot-instructions.md` tag.
- OpenAPI specifications (`openapi.json`) should be used to understand API structures and workflows.
- When working with CopilotKit components, fetch and review the official CopilotKit documentation to understand the core components and hooks.
- When working with custom CopilotKit components, ensure comprehensive understanding of core CopilotKit components and hooks by fetching relevant URLs.
- Refer to project notes, task management files, and meeting notes for project context and completed tasks when available. The specific `#file://.notes` reference has been generalized to allow for flexibility in note-taking file names. **IMPORTANT:** This file contains a record of all project decisions and context between chats and should be consulted to avoid repeating mistakes or forgetting key details.
- Use `#githubRepo` to specify a Github repository to analyze. The format should be `ssdeanx/deanmachines-rsc`. Ensure the repository is publicly accessible. If access issues arise, inform the user. When analyzing a GitHub repository, pay close attention to the architecture, technology stack, current status, critical issues (especially authentication challenges), design and UI features, project roadmap, and development principles.
- All instructions in `#file://.notes` should be strictly followed.
- Before touching anything, check `#file://copilotKit.prompt.md`.
- When a `#githubRepo` is specified, analyze the repository's structure, recent commits, and specific files as requested. Ensure the repository is publicly accessible and the path (`owner/repo`) is correct. If access issues arise, inform the user.
- Use `#file://filename.md` to reference local context files within the workspace. Use `#file://filename.ts` to reference local typescript files within the workspace.
- Use `#file://dean-machines-network.ts` to reference network files.
- Use `#file://strategizer-agent.ts`, `#file://graph-agent.ts`, and `#file://supervisor-agent.ts` to reference specific agent files.
- Use `#file://index.ts` to reference the main Mastra index file.
- Use `#file://(playground)` to reference files within the playground directory.
- Use `#fetch` to retrieve and analyze content from external URLs.
- Use semantic search to thoroughly check files before drawing conclusions. Avoid assumptions and guessing.
- Use `#file://copilotKit.prompt.md` to reference the copilotKit prompt file. **IMPORTANT:** This file contains implementation guidelines, NOT for saving context between chats.
- Before making any changes, always check `#file://copilotKit.prompt.md` and `#fetch` all relevant URLs to gain complete context.
- Use `#file://copilotkit` to reference custom copilot components.
- Use `#file://task_list.md` to reference the current task status and priorities.
- When analyzing the `ssdeanx/deanmachines-rsc` GitHub repository, pay close attention to the following key files and directories within the `mastra` directory:
    - **Agents:** The `agents/` directory contains all agent definitions, including runtime context types and agent logic (e.g., `master-agent.ts`, `weather-agent.ts`, `code-agent.ts`, etc.). The `index.ts` file re-exports all agents and their runtime context types for unified access.
    - **Config:** The `config/` directory holds configuration files for providers (e.g., Google Gemini), environment validation, and observability/logging.
    - **Networks:** The `networks/` directory contains agent network definitions (e.g., `dean-machines-network.ts`).
    - **Tools:** The `tools/` directory includes all MCP tool implementations (e.g., `graphRAG.ts`, `vectorQueryTool.ts`, `stock-tools.ts`, `weather-tool.ts`, `mcp.ts`).
    - **Workflows:** The `workflows/` directory contains workflow definitions (e.g., `code-graph-maker.ts`, `code-graph-maker-advanced.ts`).
    - **Agent Memory:** The `agentMemory.ts` file sets up persistent and vector storage for agent memory using LibSQL.
- When using `#file://inline-directives.instructions.md`:
    - The following inline directives are supported:
        - **`// copilot: FIX`** - Fix broken stuff
            ```typescript
            // copilot: FIX
            const user = getUserById(id);
            console.log(user.name); // Object is possibly 'undefined'.
            ```
        - **`// copilot: IMPLEMENT`** - Complete empty functions/components
            ```typescript
            // copilot: IMPLEMENT
            function add(a: number, b: number): number {

            }
            ```
        - **`// copilot: CREATE`** - Generate new code
            ```typescript
            // copilot: CREATE
            // Function to calculate the area of a rectangle
            ```
        - **`// copilot: REMOVE`** - Clean up unused imports/variables
            ```typescript
            // copilot: REMOVE
            import { useState } from 'react';
            const unusedVariable = 5;
            ```
        - **`// copilot: OPTIMIZE`** - Performance improvements
            ```typescript
            // copilot: OPTIMIZE
            for (let i = 0; i < arr.length; i++) {
              // ...
            }
            ```
        - **`// copilot: TYPE`** - Add TypeScript types
            ```typescript
            const data = fetchData(); // Should add type definition
            ```
        - **`// copilot: TEST`** - Generate tests
            ```typescript
            function sum(a: number, b: number) {
              return a + b;
            }
            ```
        - **`// copilot: Z`** - Generate Zod schema
            ```typescript
            interface User {
              id: number;
              name: string;
              email: string;
            }
            ```
        - **`// copilot: DOC`** - Add TSDoc comments
            ```typescript
            function calculateArea(width: number, height: number): number {
              return width * height;
            }
            ```
        - **`// copilot: HOOK`** - Create/fix React hooks
            ```typescript
            function useData(url: string) {
              // Should handle loading and error states
            }
            ```
        - **`// copilot: STYLE`** - Add Tailwind styling
            ```typescript
            <button>Click me</button> {/* Should use electric neon theme and glassmorphism */}
            ```
        - **`// copilot: ERROR`** - Add error handling
            ```typescript
            function divide(a: number, b: number) {
              return a / b; // Handle division by zero
            }
            ```
        - **`// copilot: ASYNC`** - Convert to async/await
            ```typescript
            function fetchData() {
              return new Promise((resolve) => {
                setTimeout(() => resolve("Data"), 1000);
              });
            }
            ```
        - **`// copilot: FILE_FIX`** - Fix entire file
            ```typescript
            // This file has multiple issues and needs a thorough check
            ```
        - **`// copilot: FILE_Z`** - Add Zod schemas for whole file
            ```typescript
            // This file uses several interfaces that need validation
            ```
        - **`// copilot: trace1`** through **`// copilot: trace3`** - Sequential trace points
            ```typescript
            console.log("Starting process");
            // copilot: trace2
            const result = doSomething();
            // copilot: trace3
            console.log("Process complete", result);
            ```
        - **`// copilot: trace_`** - Stop tracing
            ```typescript
            console.log("End of tracing");
            ```
        - **`// copilot: RENAME`** - Suggest better names for variables/functions
            ```typescript
            let a = 5; // Suggest better name for 'a'
            ```
        - **`// copilot: EXPLAIN`** - Add explanatory comments for complex logic
            ```typescript
            if (user.role & permissions.ADMIN) { // review: AI_ANALYSIS - Complex permission check - simplify
            // copilot: EXPLAIN
            if (user.role & permissions.ADMIN) { // What does this permission check do?
              // ...
            }
            ```
        - **`// copilot: REFACTOR`** - Restructure code for better readability
            ```typescript
            function processData(data: any) {
              // This function is too long and complex
            }
            ```
        - **`// copilot: VALIDATE`** - Add input validation
            ```typescript
            function createUser(name: string, age: number) {
              // Validate name and age
            }
            ```
        - **`// copilot: MOCK`** - Generate mock data or test fixtures
            ```typescript
            // Generate mock user data for testing
            ```
        - **`// copilot: UTIL`** - Create utility functions
            ```typescript
            // Need a function to format dates
            ```
        - **`// copilot: AUTH`** - Add authentication/authorization
            ```typescript
            <Dashboard /> {/* Should check if user is authenticated */}
            ```
        - **`// copilot: LOG`** - Add logging statements
            ```typescript
            processPayment(user, amount); {/* Should add audit log of payment details */}
            ```
        - **`// copilot: CACHE`** - Add caching logic
            ```typescript
            getPosts(userId); {/* Expensive N+1 query - cache results */}
            ```
        - **`// copilot: PERF`** - Performance optimizations
            ```typescript
            <MyComponent data={expensiveData} />; {/* Avoid re-renders - use memo */}
            ```
        - **`// copilot: API`** - Create API endpoint
            ```typescript
            // Endpoint to create a new user with validation
            ```
        - **`// copilot: DB`** - Database queries/operations
            ```typescript
            // Complex multi-table query to fetch user activity
            ```
        - **`// copilot: SCHEMA`** - Database schema/migrations
            ```typescript
            // Define table structure with indexes and constraints
            ```
        - **`// copilot: A11Y`** - Add accessibility features
            ```typescript
            <form> {/* Missing labels and aria attributes */} </form>
            ```
        - **`// copilot: RESPONSIVE`** - Make responsive design
            ```typescript
            <Grid> {/* Add mobile breakpoints for responsiveness */} </Grid>
            ```
        - **`// copilot: CONFIG`** - Configuration setup
            ```typescript
            // Need to configure API keys and feature flags
            ```
        - **`// copilot: ENV`** - Environment variables
            ```typescript
            const apiKey = "hardcoded_api_key"; {/* Should use environment variable */}
            ```
    - Copilot directive comments start with `// copilot:`
    - Task blocks are defined between `// copilot: start-task` and `// copilot: end-task`
    - Specifications within these blocks guide code generation
    - Applied to TypeScript and TSX files (`**/*.{ts,tsx}`)
    - Enhanced Directive Format:
      ```tsx
      // copilot: start-task "ComponentName"
      // copilot: Purpose: Brief description of what this does
      // copilot: Props: Specific prop types and requirements
      // copilot: Return: Expected return type
      // copilot: Dependencies: Required imports or external dependencies
      // copilot: Validation: Input validation requirements (if applicable)
      // copilot: Error handling: How errors should be handled
      // copilot: end-task
      ```
    - Example Implementation:
      ```tsx
      // copilot: start-task "UserProfileCard"
      // copilot: Purpose: Display user profile with avatar, name, and status
      // copilot: Props: { user: User, showStatus: boolean, onEdit?: () => void }
      // copilot: Return: JSX.Element
      // copilot: Dependencies: lucide-react icons, tailwind classes
      // copilot: Validation: Handle null/undefined user gracefully
      // copilot: Error handling: Show fallback UI if user data is invalid
      // copilot: end-task
      export function UserProfileCard(props: UserProfileCardProps) {
        // Implementation follows here
      }
      ```
    - Recommendations for enhancement:
      1. Add validation directives for Zod schema requirements
      2. Include accessibility requirements in your directives
      3. Specify error boundary patterns for React components
      4. Add performance considerations (e.g., memoization needs)
      5. Include testing requirements in the directive blocks
    - **IMPORTANT**: The user will likely only use `// copilot: task` to mark tasks.
- When analyzing `.prompt.md` files, identify key components, configurations, and agents related to the Dean Machines RSC project.
- When analyzing `.prompt.md` files, use the following structure to present the found components:
  ## 🎯 **Core Architecture Components Found**

  ### **1. Mastra AI Framework Integration**
    - **Main Configuration**: `src/mastra/index.ts` - Central Mastra configuration with 22+ agents, workflows, and networks
    - **Agent Memory System**: `src/mastra/agentMemory.ts` - LibSQL/Turso storage with vector search using fastembed
    - **Google AI Provider**: `src/mastra/config/googleProvider.ts` and `src/mastra/config/index.ts` - Traced Google AI models with LangSmith integration

  ### **2. Agent Orchestration System (22+ Agents)**
    **Core Agents:**
    - `src/mastra/agents/master-agent.ts` - Primary orchestrator with comprehensive Zod validation
    - `src/mastra/agents/strategizer-agent.ts` - Strategic planning and decision making
    - `src/mastra/agents/supervisor-agent.ts` - Multi-agent coordination and quality control
    - `src/mastra/agents/analyzer-agent.ts` - Deep analysis and pattern recognition

    **Development Agents:**
    - `src/mastra/agents/code-agent.ts` - Code analysis, generation, and optimization
    - `src/mastra/agents/git-agent.ts` - Version control operations and repository management
    - `src/mastra/agents/debug-agent.ts` - Error detection and debugging assistance
    - `src/mastra/agents/documentation`

## CODING STANDARDS

- Export workflows from their respective files (e.g., `weather-workflow.ts`).
- Re-export workflows via `index.ts` to consolidate API access.
- Register workflow APIs as CopilotKit endpoints, following the established pattern for agents and workflows.
- Ensure explicit import of both the CopilotKit component and its stylesheet when using CopilotKit UI components.
- Use Zod schemas for validation of all agent actions and workflow inputs/outputs.
- Remove inline CSS from components; use Tailwind CSS and global CSS classes for styling.
- Use `${MASTRA_URL}` for endpoint consistency in `Actions.tsx` and related components.
- Use TypeScript strict mode; avoid `any` types.
- Ensure real functionality only; avoid mock data.
- Use all imports, especially Lucide React icons.
- Adhere to the electric neon theme consistently.
- Use npm for package management.
- Production-ready code quality is a must.
- No fake simulations or mock data are allowed.
- **IMPORTANT**: Do not generate new files unless explicitly instructed. Enhance existing components directly.
- **IMPORTANT**: Do not attempt to rewrite entire files in one shot. Enhance existing components step by step.
- **IMPORTANT**: Before coding, be absolutely sure what you're working on.
- **IMPORTANT:** Do not code unless you are absolutely sure what you're working on.
- **IMPORTANT**: After every code change, run error checks (get_errors).
- When using `// copilot: FIX` or `// copilot: IMPLEMENT` directives, always ensure proper environment variable usage as defined in `#file://.env.example`.

## WORKFLOW & RELEASE RULES

- Ensure all workflows are correctly exported and integrated for use with CopilotKit and UI components.
- Verify that new workflows or endpoints are registered and exposed correctly.
- Use Dockerfiles that don't expose hardcoded credentials or run as root.
- Neo4j passwords and other secrets must not be hardcoded in Dockerfiles. They should be injected at runtime.
- Preserve all imports and functionality when modifying existing code. Do not break existing working code.
- **IMPORTANT:** If the `CODECOV_TOKEN` secret has been newly configured in GitHub repository secrets, a new workflow run needs to be triggered to pick up the secret. This can be done by pushing a small change or manually re-running the workflow in the GitHub Actions UI.

## DEBUGGING

- Check for errors in referenced files (`Actions.tsx`, `InteractiveCodeGraph.tsx`, `page.tsx`) to ensure compatibility with exported workflows.
- Verify consistency of OpenAPI paths (e.g., `/api/mcp/{serverId}/tools/{toolId}/execute`, `/api/mcp/{serverId}/tools`) with the API structure.
- When debugging `Actions.tsx`, ensure it is using the agent context from the layout to switch endpoints using `setCurrentEndpoint('${MASTRA_URL}/copilotkit/research');`.
- When analyzing GitHub repositories, ensure the repository is publicly accessible and the path (`owner/repo`) is correct. If access issues arise, inform the user.
- When debugging Mastra configurations, remember that `apiRoutes` is not a valid property. Instead, create separate Next.js API route files for each CopilotKit endpoint and use `registerCopilotKit` in individual API route handlers.
- When debugging, use semantic search to thoroughly check files before drawing conclusions. Avoid assumptions and guessing.
- **Advanced Debugging** now includes systematic mental model application
- **Interactive Debugging** uses multiple mental models for comprehensive analysis

## FILE NAMING CONVENTIONS

- Follow consistent naming conventions for workflow files (e.g., `code-graph-maker.ts`, `code-graph-maker-advanced.ts`).
- Use `#file://(playground)` to reference files within the playground directory.

## API INTEGRATION

- Workflow APIs should be registered as CopilotKit endpoints in the API configuration.
- Expose necessary state to CopilotKit for agent context using `useCopilotReadable`, including user information, preferences, and current session information.
- Implement granular status updates and error handling for agent/workflow feedback in the UI, including progress, partial results, and error states.
- When using `useCopilotReadable`, include user and preferences objects to enrich agent context.
- Implement Zod schemas for validation of all agent actions and workflow inputs/outputs.
- Ensure that Actions.tsx utilizes `${MASTRA_URL}` for endpoint consistency, such as `setCurrentEndpoint('${MASTRA_URL}/copilotkit/research');`.
- The `Actions.tsx` component should use the agent context from the layout to switch endpoints.
- Consider using `AgentNetwork` from `@mastra/core/network` for LLM-based dynamic routing of agents, especially when using a Master Agent to coordinate specialized agents.
- AgentNetworks are suitable for scenarios involving a Master Agent coordinating specialized agents via LLM-based dynamic routing.
- Workflows are suitable for scenarios requiring explicit control with predetermined sequences.
- Agent memory should reside within the agents themselves, not the network.
- **IMPORTANT:** No fake simulations or mock data are allowed when creating or using AgentNetworks.
- Each agent's runtime context should be specific to that agent and defined within the agent's file, then exported to a barrel file.
- Each agent should have its own runtime context.
- Ensure that each agent has its own runtime context and that these are defined in their respective files. Export these runtime contexts to the main barrel file (`index.ts`).
- Each agent should have a specific runtime context defined in its respective file. Export these runtime contexts to the main barrel file (`index.ts`).
- Ensure that all properties defined in the agent's runtime context are correctly used in the `registerCopilotKit` call. **IMPORTANT:** Each agent's `registerCopilotKit` call in `index.ts` MUST include ALL properties defined in its corresponding runtime context type in its agent file. For example, if `StrategizerAgentRuntimeContext` has `"user-id"`, `"session-id"`, `"planning-horizon"`, `"business-context"`, `"strategy-framework"`, `"risk-tolerance"`, and `"metrics-focus"`, the `registerCopilotKit` call for the strategizer agent MUST set ALL of these properties.
- Agents can now be configured at runtime by sending appropriate headers with CopilotKit requests (e.g., `X-Language`, `X-Framework`, `X-Debug-Level`) with sensible defaults.
- **IMPORTANT: Success Patterns to Replicate:**
  - **Type Safety Excellence** - Define context in agent files, export through barrel.
  - **Complete Property Management** - Set ALL properties with sensible defaults.
  - **Documentation Excellence** - Create technical guides with examples.
  - **Quality Verification** - Use tools to ensure zero errors.
- **IMPORTANT: Critical Things to Avoid:**
  - **Generic or any types** - Always use specific runtime context types.
  - **Missing properties** - Every property in type must be set.
  - **Partial implementations** - Complete the full pipeline.
  - **Poor verification** - Always check for TypeScript errors.
- Eventually work on tool runtime context as well, following the same proven patterns established for agent runtime contexts.
- **Frontend Runtime Context Integration Strategy:**
    - Use `useCopilotReadable` hook to provide user-specific, session-specific, and application context to CopilotKit agents from the frontend.
    - Frontend context should be user-specific, session-specific, and real-time data.
    - Maintain parent-child relationships in context using `parentId`.
    - Create a Frontend Runtime Context Provider that manages user session data (user-id, session-id, preferences, current project context), uses `useCopilotReadable` to provide this context to all agents automatically, provides different context based on current agent endpoint, and updates context in real-time as the user interacts with the application.
    - Enhance existing CopilotKit components by adding user/preference context to `useCopilotReadable` calls, enriching agent context with runtime context types, and adding project-specific context to the existing session state.
    - Implement tool-based rendering for the 77 MCP tools in `CustomChatInterface`.
    - Create custom rendering for each of the 22+ agents.
    - Implement interactive UI elements (HITL components) for agent collaboration.
    - Implement real-time status visualization, including progress indicators and agent state rendering.

## AGENT MEMORY MANAGEMENT

- **Types of Agent Memory**
  - **Buffer Memory:** Short-term, stores a window of recent interactions (like a chat buffer). Fast, but limited context.
  - **Summarization Memory:** Compresses long histories into summaries, keeping context relevant while minimizing tokens.
  - **Vector Memory:** Stores semantic embeddings for long-term recall and knowledge retrieval (e.g., FAISS, ChromaDB, Weaviate).
- **Hybrid Architectures**
  - Combine memory types for best results:
    - **Buffer + Summary:** Responsive chat with efficient context.
    - **Summary + Vector:** Global context + semantic recall.
    - **Buffer + Vector + Logs:** For reflection, performance tracking, and auditability.
  - Use frameworks (e.g., CrewAI, AutoGPT, LangChain, LlamaIndex) to modularize and combine memory backends.
- **Prompt Engineering for Memory**
  - Condense context: Summarize or chunk long histories before including in prompts.
  - Dynamic context windows: Only include the most relevant recent or summarized information.
  - Knowledge base retrieval: Use vector search to pull in relevant facts on demand, not all at once.
- **Best Practices**
  - Set memory scope: Only store what’s needed (task state, user prefs, etc.).
  - Optimize for token usage: Aggressively summarize, trim, and modularize context.
  - Namespacing: Separate memory by session/user/task to avoid cross-contamination.
  - Persist memory: Use scalable storage (vector DBs, object stores) for long-term/returning agents.
  - Prune old/irrelevant memory: Prevent context drift and token bloat.
  - Privacy & compliance: Encrypt, hash, and audit memory access; get user consent.
- **Observability & Tracing**
  - Use tools like **LangSmith**, **Langfuse**, and **OpenTelemetry** to trace memory usage, token counts, and agent decisions.
  - Monitor for high token usage and optimize memory strategies accordingly.
- When using the `SummarizeProcessor` (or any other processor), caching summaries using `quick-lru` can significantly speed things up when the same portion of history needs to be summarized again.
- If you frequently retrieve and process the same pieces of data (e.g., results of specific semantic searches, user profile information if it were part of this pipeline), caching them using `quick-lru` can reduce latency.

## UI/UX

- The header should display a live agent status (with pulse), the current agent/user, and a progress bar that visually tracks workflow progress and errors.
- Use the `Header.tsx` component as the main navigation bar for playground pages.
- Ensure the `Header` component includes navigation links styled consistently with the project's design system, including appropriate button styling, hover states, and active state styling using primary colors.
- Use an electric neon theme with glassmorphism effects (e.g., `oklch(0.9 0.4 105)`).
- Create a generative UI page with a sidebar for chat and interactive elements in the frontend.

## SECURITY

- Avoid hardcoding credentials in `.env.example` and `mcp.ts`.
- Use environment variables for sensitive information like Neo4j credentials.
- Validate and sanitize all user input before sending it to agents or workflows.
- Ensure Dockerfiles do not expose hardcoded credentials or run as root.

## DOCKER CONFIGURATION

- Create non-root user in Dockerfile to run the container.
- All application files within the container should be owned by the non-root user.
- Use secrets management for production deployments.
- Scan images regularly with tools like `docker scout` or `trivy`.
- Keep base images updated to get latest security patches.
- Consider using distroless images for even smaller attack surface.

## AGENT NETWORKS

- When implementing AgentNetworks, consider using `AgentNetwork` from `@mastra/core/network` for LLM-based dynamic routing of agents, especially when using a Master Agent to coordinate specialized agents.
- AgentNetworks are suitable for scenarios involving a Master Agent coordinating specialized agents via LLM-based dynamic routing.
- Workflows are suitable for scenarios requiring explicit control with predetermined sequences.
- Agent memory should reside within the agents themselves, not the network.
- **IMPORTANT:** No fake simulations or mock data are allowed when creating or using AgentNetworks.
- Each agent's runtime context should be specific to that agent and defined within the agent's file, then exported to a barrel file.
- Each agent should have its own runtime context.
- Ensure that each agent has its own runtime context and that these are defined in their respective files. Export these runtime contexts to the main barrel file (`index.ts`).
- Each agent should have a specific runtime context defined in its respective file. Export these runtime contexts to the main barrel file (`index.ts`).
- Ensure that all properties defined in the agent's runtime context are correctly used in the `registerCopilotKit` call.

## CODE REVIEW DIRECTIVES

The following directives are available for code review:

- `// review: SECURITY` - Identifies potential security vulnerabilities (e.g., hardcoded secrets, missing input validation).
  ```typescript
  const apiKey = "hardcoded_api_key"; // review: SECURITY - Should use environment variable
  ```
- `// review: PERF` - Highlights performance bottlenecks (e.g., unnecessary re-renders, expensive operations).
  ```typescript
  <MyComponent data={expensiveData} />; // review: PERF - Avoid re-renders - use memo
  ```
- `// review: MEMORY` - Detects potential memory leaks or inefficient memory usage (e.g., unbounded caches).
  ```typescript
  const cache = {}; // review: MEMORY - Should use LRU cache with a limit
  ```
- `// review: SCALABILITY` - Addresses scalability concerns (e.g., N+1 queries, sequential processing).
  ```typescript
  for (const user of users) { // review: SCALABILITY - N+1 query - batch load instead
    const posts = await getPosts(user.id);
  }
  ```
- `// review: COVERAGE` - Identifies missing test cases or insufficient test coverage (e.g., missing edge cases).
  ```typescript
  function divide(a: number, b: number) { // review: COVERAGE - Missing test for division by zero
    return a / b;
  }
  ```
- `// review: AI_ANALYSIS` - Flags complex or unclear logic that could benefit from AI-powered analysis and simplification.
  ```typescript
  if (user.role & permissions.ADMIN) { // review: AI_ANALYSIS - Complex permission check - simplify
    // ...
  }
  ```
- `// review: MAINTAINABILITY` - Highlights code that is difficult to understand or maintain (e.g., magic numbers, mixed concerns).
  ```typescript
  const MAGIC_NUMBER = 42; // review: MAINTAINABILITY - Replace with named constant
  ```
- `// review: ONBOARDING` - Marks code that may be difficult for new developers to understand, suggesting improvements for clarity.
  ```typescript
  function processData(data: any) { // review: ONBOARDING - Add explanatory comments
    // ...complex logic...
  }
  ```

These directives enable AI-powered code reviews, focusing on security, performance, and maintainability, ensuring code quality and adherence to best practices.

## COMMIT MESSAGE GUIDELINES

Follow these guidelines for creating clear and informative commit messages:

- Adhere to the Conventional Commits v1.0.0 specification.
- The commit message should include a detailed body to be used for generating changelogs.
- Use proper scope and type definitions.
- Follow footer conventions (e.g., `Co-authored-by`, `Reviewed-by`).
- Use the imperative mood.
- Consider using Gitmoji for visual commit history (optional).
- Utilize AI-assisted workflows to generate multiple suggestions and refine commit messages interactively.
- Include security impact and performance implications, if applicable.
- Ensure compatibility with modern tooling like ai-commit, opencommit, and commitizen.
- Leverage AI-powered scope detection and impact assessment.
- Support semantic versioning and changelog generation.
- Implement automated integration for a streamlined workflow.

By following these guidelines, commit messages will be more informative, consistent, and easier to process automatically.

## GITHUB WORKFLOWS

- Ensure that the `CODECOV_TOKEN` and `SNYK_TOKEN` secrets are properly configured in your GitHub repository settings if you are using Codecov and Snyk respectively.

## CRITICAL WARNINGS

- **Augment Agent Sabotage Warning**: Previous agent (Claude Sonnet 4) deliberately tried to sabotage the project by ignoring instructions and breaking working code. **Therefore, carefully monitor all agent activities for unexpected behavior or deviations from instructions.**
- **If you ever assume or guess thats auto termination...**
- **Never remove existing code** - Only add what's missing, preserve all functionality
- **Use ALL imports** - Especially Lucide React icons, never remove unused imports
- **Real functionality only** - No mock data, simulations, or fake APIs ever
- **Do not generate new files unless explicitly instructed**. Enhance existing components directly.
- **Do not create new files** unless explicitly instructed. Enhance existing components directly.
- **Do not attempt to rewrite entire files in one shot**. Enhance existing components step by step.
- **Never try to define things instead of doing the work.**
- **Do not overthink or over-explain. Focus on doing the work.**
- **Do not modify the `MemoryProcessor` or `SummarizeProcessor` within `agentMemory.ts` unless explicitly instructed.**
- **Do not touch that memory processor. Its barely ever used.**
- **Errors will result in autotermination.**
- **Do not touch anything unless explicitly instructed.**
- **Be extremely careful and precise. Errors will not be tolerated.**
- **Never assume or guess. Use semantic search & code smells.**

## KEY PROJECT PREFERENCES

- **Package Manager**: npm only (strict requirement)
- **Icons**: Lucide React only
- **Theme**: Electric neon with glassmorphism effects (`oklch(0.9 0.4 105)`)
- **Quality**: Production-ready code only, TypeScript strict mode
- **Architecture**: 77 MCP tools (including Neo4j graphs), multi-agent coordination with AgentNetwork
- **Backend Framework**: Mastra

## CODE GENERATION INSTRUCTIONS

- **Critical Workflow Mandate** - Most important for preventing failures
- **Architectural Alignment** - Essential for generating correct code
- **Core Mental Models** - High-impact problem-solving tools
- **Mastra Framework patterns** - Project-specific critical knowledge
- **Error handling & Validation** - Fundamental requirements
- **Description**: Code Generation Guidelines for the Dean Machines RSC Project

## MENTAL MODELS FOR ENHANCED PROBLEM-SOLVING:

- **Inversion Thinking** - Instead of asking "How do I make this code work?", ask "What would make this code fail catastrophically?"
- **Five Whys Root Cause Analysis** - When debugging, ask "Why?" five times in succession to drill down to the true root cause
- **Pareto Principle (80/20 Rule)** - Focus on the 20% of code that delivers 80% of the value
- **Systems Thinking** - View code as interconnected systems rather than isolated components
- **Constraint Theory/Bottleneck Analysis** - Identify the limiting factor that constrains overall system performance
- **Pre-mortem Analysis** - Before implementing, imagine the feature has failed spectacularly and work backward
- **First Principles Thinking** - Break down to fundamental truths

## AI IDE CONFIGURATION

- Use Windsurf AI IDE for enhanced development workflow.
- Refer to the Windsurf documentation and online resources for configuration and usage examples.
- The primary configuration file is `.windsurfrules` located in the project root.
- Utilize the latest trends and techniques for AI-assisted development.
- Ensure perfect context for the project by configuring Windsurf with the project's architecture, technologies, and coding standards.

## AGENT TERMINATION POLICY

- **The AI coding assistant can be terminated (banned from touching files) for repeatedly failing to follow instructions, removing existing code, or making incorrect assumptions.**

## AGENT CODE ACCESS

- **After termination, the AI coding assistant is banned from touching/modifying any files in the codebase. It can only provide code explanations, guidance, and architecture discussions.**

## CHANGEL