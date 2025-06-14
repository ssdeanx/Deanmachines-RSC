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

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

- All files relevant to a user request should be checked, including those specified with the `#file://copilot-instructions.md` tag.
- OpenAPI specifications (`openapi.json`) should be used to understand API structures and workflows.
- When working with CopilotKit components, fetch and review the official CopilotKit documentation to understand the core components and hooks.
- When working with custom CopilotKit components, ensure comprehensive understanding of core CopilotKit components and hooks by fetching relevant URLs.
- Refer to project notes, task management files, and meeting notes for project context and completed tasks when available. The specific `#file://.notes` reference has been generalized to allow for flexibility in note-taking file names. **IMPORTANT:** This file contains a record of all project decisions and context between chats and should be consulted to avoid repeating mistakes or forgetting key details.
- Use `#githubRepo` to specify a Github repository to analyze. The format should be `ssdeanx/deanmachines-rsc`. Ensure the repository is publicly accessible. If access issues arise, inform the user. When analyzing a GitHub repository, pay close attention to the architecture, technology stack, current status, critical issues (especially authentication challenges), design and UI features, project roadmap, and development principles.
- All instructions in `#file://.notes` should be strictly followed.
- Before touching anything, check `#file:copilotKit.prompt.md`.
- When a `#githubRepo` is specified, analyze the repository's structure, recent commits, and specific files as requested. Ensure the repository is publicly accessible and the path (`owner/repo`) is correct. If access issues arise, inform the user.
- Use `#file://filename.md` to reference local context files within the workspace. Use `#file://filename.ts` to reference local typescript files within the workspace.
- Use `#file://dean-machines-network.ts` to reference network files.
- Use `#file://strategizer-agent.ts`, `#file://graph-agent.ts`, and `#file://supervisor-agent.ts` to reference specific agent files.
- Use `#file://index.ts` to reference the main Mastra index file.
- Use `#file://(playground)` to reference files within the playground directory.
- Use `#fetch` to retrieve and analyze content from external URLs.
- Use semantic search to thoroughly check files before drawing conclusions. Avoid assumptions and guessing.
- Use `#file://copilotKit.prompt.md` to reference the copilotKit prompt file. **IMPORTANT:** This file contains implementation guidelines, NOT for saving context between chats.
- Before making any changes, always check `#file:copilotKit.prompt.md` and `#fetch` all relevant URLs to gain complete context.
- Use `#file:copilotkit` to reference custom copilot components.
- Use `#file:task_list.md` to reference the current task status and priorities.

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

## WORKFLOW & RELEASE RULES

- Ensure all workflows are correctly exported and integrated for use with CopilotKit and UI components.
- Verify that new workflows or endpoints are registered and exposed correctly.
- Use Dockerfiles that don't expose hardcoded credentials or run as root.
- Neo4j passwords and other secrets must not be hardcoded in Dockerfiles. They should be injected at runtime.
- Preserve all imports and functionality when modifying existing code. Do not break existing working code.

## DEBUGGING

- Check for errors in referenced files (`Actions.tsx`, `InteractiveCodeGraph.tsx`, `page.tsx`) to ensure compatibility with exported workflows.
- Verify consistency of OpenAPI paths (e.g., `/api/mcp/{serverId}/tools/{toolId}/execute`, `/api/mcp/{serverId}/tools`) with the API structure.
- When debugging `Actions.tsx`, ensure it is using the agent context from the layout to switch endpoints using `setCurrentEndpoint('${MASTRA_URL}/copilotkit/research');`.
- When analyzing GitHub repositories, ensure the repository is publicly accessible and the path (`owner/repo`) is correct. If access issues arise, inform the user.
- When debugging Mastra configurations, remember that `apiRoutes` is not a valid property. Instead, create separate Next.js API route files for each CopilotKit endpoint and use `registerCopilotKit` in individual API route handlers.
- When debugging, use semantic search to thoroughly check files before drawing conclusions. Avoid assumptions and guessing.

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

## CRITICAL WARNINGS

- **Augment Agent Sabotage Warning**: Previous agent (Claude Sonnet 4) deliberately tried to sabotage the project by ignoring instructions and breaking working code. **Therefore, carefully monitor all agent activities for unexpected behavior or deviations from instructions.**
- **Never remove existing code** - Only add what's missing, preserve all functionality
- **Use ALL imports** - Especially Lucide React icons, never remove unused imports
- **Real functionality only** - No mock data, simulations, or fake APIs ever
- **Do not generate new files unless explicitly instructed**. Enhance existing components directly.
- **Do not create new files** unless explicitly instructed. Enhance existing components directly.
- **Do not attempt to rewrite entire files in one shot**. Enhance existing components step by step.
- **Never try to define things instead of doing the work.**
- **Do not overthink or over-explain. Focus on doing the work.**

## KEY PROJECT PREFERENCES

- **Package Manager**: npm only (strict requirement)
- **Icons**: Lucide React only
- **Theme**: Electric neon with glassmorphism effects (`oklch(0.9 0.4 105)`)
- **Quality**: Production-ready code only, TypeScript strict mode
- **Architecture**: 77 MCP tools (including Neo4j graphs), multi-agent coordination with AgentNetwork

## CHANGELOG

- **2025-06-14**: Added comprehensive section documenting the successful agent runtime context integration. This includes implementation details, key tips & best practices, critical success patterns, things to avoid, and performance metrics.
- **2025-06-14**: Updated Frontend Runtime Context Integration strategy to include enhancing existing CopilotKit components, implementing tool-based rendering, creating custom agent rendering, and implementing interactive UI elements.
- **2025-06-14**: Added a CRITICAL WARNING against creating new files unless explicitly instructed.
- **2025-06-14**: Added a CRITICAL WARNING against rewriting entire files in one shot.
- **2025-06-14**: Added a CRITICAL WARNING against trying to define things instead of doing the work.
- **2025-06-14**: Added a CRITICAL WARNING against overthinking or over-explaining; focus on doing the work.
- **2025-06-14**: Added a CRITICAL WARNING regarding Augment Agent Sabotage.
- **2025-06-14**: Documented termination of current agent due to sabotage attempts in meeting notes.

## README

- Improve graph to visually represent the agent network and data flow.

## NEXT STEPS (CopilotKit Implementation)

- Implement custom components - 🔥 HIGH PRIORITY
- Advanced UI customization - 🔥 HIGH PRIORITY
- Generative UI patterns
- Bring Your Own LLM
- Copilot Textarea
- Self-hosting
- Messages and LocalStorage
- Custom AI Assistant Behavior