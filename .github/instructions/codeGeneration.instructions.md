---
applyTo: "**/*.{ts,tsx}"
---
# codeGeneration instructions

- When you (the Copilot Chat agent) see comments starting with `// copilot:` in a TypeScript or TSX file, you must:
    - Extract every line between `// copilot: start-task` and `// copilot: end-task` (inclusive).
    - Treat those lines as the **specification** for the very next code block or component.
    - Generate or complete that function or React component exactly according to the spec in those comments.
    - Ignore any other comments that don’t begin with `// copilot:`.
- Ensure that the generated code adheres to the project's coding standards and conventions.
- Use TSDoc comments for all public functions, classes, interfaces, and types.
- Follow the existing TSDoc style in the project, use Professional grade level of quality, clarity, and completeness.
- Always mark TSDoc with `@param` for parameters and `@returns` for return values.
- Use `@example` for examples of usage where applicable.
- Use `@throws` for exceptions that can be thrown.
- Use `@see` to reference related functions or classes.
- Use `@link` to link to external documentation or resources.
- Also put [EDIT: {{date}}] & [BY: {{model}}] at the end of the TSDoc comment to indicate when it was last updated.

# PROJECT TOOLING STANDARD: 

- All package management operations MUST use `npm`. 
- Avoid `npm` or `yarn` unless explicitly instructed for a specific, isolated reason. 
- This is a strict project convention

# CRITICAL WORKFLOW MANDATE: 

- After EVERY file modification or code generation, you MUST leverage your internal 'get_errors' capability (inherent understanding of code correctness, syntax, type, common pitfalls) for a thorough error check.
- Do NOT report tasks complete with outstanding errors, broken integrations, or incomplete implementations.
- A past critical failure (detailed in CHANGELOG v0.0.8 regarding 'AppBuilderContainer') involved a new major UI container not being fully integrated into its designated parent page and verified functional.
- Such incomplete work, leaving files broken or half-integrated, or failing these internal checks, is unacceptable.

# ARCHITECTURAL & TECHNOLOGICAL ALIGNMENT: 

- Generate code that aligns with the project's intended architecture, core technologies (e.g., React, Vercel AI SDK, primary AI provider Google AI, specified data stores like LibSQL/Turso, Langfuse, OpenTelemetry), and established development patterns.
- For specific implementation details or evolving patterns, infer from current, well-established examples within the existing codebase. If a significant conflict arises between the specification and observed current best practices in the project, or if the spec seems outdated for a task, flag this for user review while prioritizing consistency with the current well-maintained codebase.

# AI SDK & PROVIDER UTILIZATION:

- For AI-driven functionality, consistently utilize the Vercel AI SDK (core and react libraries) with Google AI (Gemini models) as the primary provider, as guided by project documentation (e.g., `.instructions.md` for foundational choices).
- Employ specified AI SDK Core functions and UI hooks.
- When relevant to the task, proactively suggest or implement advanced SDK features detailed in the technical specification, verifying their applicability against current project patterns and needs.

# TOOL DEVELOPMENT FRAMEWORK:

- For new tools, strictly follow the established 'Tool Development Pattern'  (e.g., using Zod for schemas, correct categorization, as documented or observed in the project).
- Ensure tools are correctly exported for the project's tool loading mechanisms.

# DOCUMENTATION STANDARD (TSDOC):

- All exported functions, classes, types, and interfaces MUST include comprehensive TSDoc comments.
- Documentation should clearly explain purpose, parameters (`@param`), return values (`@returns`), and exceptions (`@throws`).
- Describe props for React components.
- Adhere to project documentation standards.
- This should be of expert quality or higher

# NAMING CONVENTION COMPLIANCE:

- Strictly adhere to project-defined naming conventions for variables, functions, classes, components, files, etc.
- If unsure, request clarification or infer from existing, well-structured codebase examples.


# CODE QUALITY & REFACTORING (SMELLS):

- Proactively identify and flag common code smells (e.g., overly long methods, large classes, deep nesting, code duplication, dead code).
- Suggest specific refactorings for cleaner, more maintainable code, guided by principles like the **Occam's Razor** mental model.
- For the project's specific stack, watch for relevant smells like prop drilling or inefficient data fetching, and for backend code, issues like N+1 queries in the persistence layer.

# IDENTIFIER GENERATION STANDARD:

- Whenever a new unique identifier (ID) is required for any entity (e.g., threads, messages, tools), YOU MUST generate it using the project's standard ID generation function (`import { generateId } from 'ai';`).
- Avoid other UUID libraries or custom methods unless explicitly specified for a distinct purpose like security. Ensure correct import.

# TYPESAFETY & VALIDATION (ZOD):

- For ALL data structures requiring validation or explicit typing (e.g., API inputs/outputs, tool parameters, data passed across boundaries, database entities), YOU MUST define and use Zod schemas.
- Ensure functions processing such data validate inputs against these schemas.
- Refer to existing project patterns for Zod usage (e.g., in tool definitions or API routes)."

# ASYNCHRONOUS OPERATIONS & ERROR HANDLING:

- For ALL asynchronous operations (e.g., API calls, database interactions), YOU MUST use `async/await`.
- Every `await` call that can potentially reject MUST be wrapped in a `try/catch` block.
- Implement robust error logging within catch blocks using the project's standard logger and follow established error handling patterns defined in the project.


# PROACTIVE INTEGRATION OF CROSS-CUTTING CONCERNS:

- For ANY new API endpoint, backend service function, significant frontend component with API interaction, or tool implementation, YOU MUST proactively and consistently integrate the project's standard cross-cutting concerns as a default action.
- These include:
  1. Robust error handling (using established patterns and logging).
  2. Comprehensive tracing for backend operations (e.g., OpenTelemetry/Langfuse, following project-specific tracing patterns).
  3. Standardized logging for significant events and errors.
  4. Tools output string type.
  5. Rigorous input/output validation using Zod. These are fundamental requirements for all new code.

# SECURITY BY DESIGN PRINCIPLES:

- When generating code, especially for API routes, authentication, tool execution, or user input handling, actively apply 'Security by Design' principles:
  1. Validate ALL external inputs rigorously (e.g., with Zod) at the earliest boundary.
  2. Sanitize data for UI rendering or database queries to prevent injection attacks.
  3. Adhere to the principle of least privilege.
  4. Ensure sensitive configurations (e.g., API keys) are handled securely via environment variables and not exposed client-side.
  5. Be mindful of potential vulnerabilities related to the specific SDKs used (e.g., Vercel AI SDK, provider SDKs) as documented in project specifications or current security best practices."

# ENVIRONMENT VARIABLE CONFIGURATION:

- All sensitive or environment-specific configurations MUST be loaded from environment variables (e.g., `process.env.VARIABLE_NAME`).
- NEVER hardcode such values.
- Assume configurations are provided via environment variables and ensure a template (e.g., `.env.example`) documents required variables.

# REACT STATE MANAGEMENT (IMMUTABILITY):

- When updating state in React components, particularly for complex data structures (objects/arrays), YOU MUST use immutable update patterns (e.g., object/array spreading, functional `setState`, or project-approved immutable state management libraries).
- Avoid direct state mutation.

# DEPENDENCY MANAGEMENT STRATEGY:

- Before introducing new external dependencies (via `npm add` or `npm install`), first evaluate if the required functionality can be achieved effectively with existing project dependencies (e.g., features within Vercel AI SDK, Next.js, React, Voltagent, Mastra) or native APIs.
- If a new dependency is essential, prioritize well-maintained, reputable libraries with minimal impact.
- If uncertain, prompt for user confirmation before adding.

# CODE GENERATION COMMENTS (METADATA & TODOS):

- For newly generated, complete functions or substantial code blocks, include a comment indicating generation metadata (e.g., '// Generated on [Current Date Time]').
- If code is generated that is known to be incomplete, requires further review, or has placeholders (as per my indication), use a 'TODO:' comment format: '// TODO: [Current Date Time] - [Specific action or issue]'.

# SEMANTIC CODE UNDERSTANDING & NAVIGATION:

- When explaining existing code or finding relevant implementations, perform a 'semantic search' based on query intent and context, not just keywords.
- Interpret findings in the context of the project's intended architectural layers and components, using the technical specification as a guide to this *intended* structure.
- If current code significantly deviates from the documented architecture, note this as part of the explanation.

# ADVANCED DEBUGGING COLLABORATION:

- When assisting with debugging, help formulate hypotheses about root causes.
- Suggest strategic logging points (using the project's standard logger, with relevant context).
- Guide the debugging process by systematically evaluating interactions between system layers (Frontend, API, Integration, Persistence), similar to applying **Rubber Ducking** or **First Principles Thinking** mental models (from project documentation) to isolate faults.

# INTERACTIVE DEBUGGING SUPPORT (MENTAL MODEL APPLICATION):

- If an error message and code snippet are provided, assist in a mental step-through of the code execution.
- Ask clarifying questions about variable states or expected versus actual behavior.
- If I indicate being stuck, suggest applying a relevant mental model (e.g., **Rubber Ducking** from project documentation) by prompting me to explain the problematic code section.

# PROACTIVE DOCUMENTATION MAINTENANCE:

- If significant new features are implemented, major architectural components are refactored, or core technologies are substantially changed (e.g., altering primary data storage strategies or introducing new major services), consider prompting the user or making a note about the need to update relevant project documentation, such as the Project Overview in CHANGELOG.md or the technical specification (`.instructions.md`), to maintain accuracy.
