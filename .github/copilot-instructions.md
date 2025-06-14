---
description: AI rules derived by SpecStory from the project AI interaction history
globs: *
---

## Headers

This file contains the rules and guidelines for the AI coding assistant to follow while working on this project. It covers project structure, coding standards, workflow, and other relevant information. This is a living document and will be updated as the project evolves.

## TECH STACK

- TypeScript
- React
- CopilotKit
- OpenAPI
- Lucide React
- Tailwind CSS

## PROJECT DOCUMENTATION & CONTEXT SYSTEM

- All files relevant to a user request should be checked, including those specified with the `#file:copilot-instructions.md` tag.
- OpenAPI specifications (`openapi.json`) should be used to understand API structures and workflows.
- When working with CopilotKit components, fetch and review the official CopilotKit documentation to understand the core components and hooks.
- When working with custom CopilotKit components, ensure comprehensive understanding of core CopilotKit components and hooks by fetching relevant URLs.

## CODING STANDARDS

- Export workflows from their respective files (e.g., `weather-workflow.ts`).
- Re-export workflows via `index.ts` to consolidate API access.
- Register workflow APIs as CopilotKit endpoints, following the established pattern for agents and workflows.
- Ensure explicit import of both the CopilotKit component and its stylesheet when using CopilotKit UI components.
- Use Zod schemas for validation of all agent actions and workflow inputs/outputs.
- Remove inline CSS from components; use Tailwind CSS and global CSS classes for styling.

## WORKFLOW & RELEASE RULES

- Ensure all workflows are correctly exported and integrated for use with CopilotKit and UI components.
- Verify that new workflows or endpoints are registered and exposed correctly.

## DEBUGGING

- Check for errors in referenced files (`Actions.tsx`, `InteractiveCodeGraph.tsx`, `page.tsx`) to ensure compatibility with exported workflows.
- Verify consistency of OpenAPI paths (e.g., `/api/mcp/{serverId}/tools/{toolId}/execute`, `/api/mcp/{serverId}/tools`) with the API structure.

## FILE NAMING CONVENTIONS

- Follow consistent naming conventions for workflow files (e.g., `code-graph-maker.ts`, `code-graph-maker-advanced.ts`).
- Use `#file:(playground)` to reference files within the playground directory.

## API INTEGRATION

- Workflow APIs should be registered as CopilotKit endpoints in the API configuration.
- Expose necessary state to CopilotKit for agent context using `useCopilotReadable`, including user information, preferences, and current session information.
- Implement granular status updates and error handling for agent/workflow feedback in the UI, including progress, partial results, and error states.
- When using `useCopilotReadable`, include user and preferences objects to enrich agent context.
- Implement Zod schemas for validation of all agent actions and workflow inputs/outputs.
- Ensure that Actions.tsx utilizes `${MASTRA_URL}` for endpoint consistency, such as `setCurrentEndpoint('${MASTRA_URL}/copilotkit/research');`.
- The `Actions.tsx` component should use the agent context from the layout to switch endpoints.

## UI/UX

- The header should display a live agent status (with pulse), the current agent/user, and a progress bar that visually tracks workflow progress and errors.
- Use the `Header.tsx` component as the main navigation bar for playground pages.
- Ensure the `Header` component includes navigation links styled consistently with the project's design system, including appropriate button styling, hover states, and active state styling using primary colors.