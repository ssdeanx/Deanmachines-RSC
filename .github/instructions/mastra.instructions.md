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

# Augment Guidelines for the Dean Machines RSC Project

## 1. Technology Stack
- This is a Next.js 15 project using TypeScript and the App Router.
- Styling is done with Tailwind CSS. Use utility classes for styling. Colors and fonts are defined in `src/app/globals.css`.
- We use PinoLogger for logging. Do not use `console.log`.

## 2. Mastra AI Framework
- New agents should be created in the `src/mastra/agents/` directory, following the structure of `master-agent.ts` and `weather-agent.ts`.
- Agents should use the shared `agentMemory` instance from `src/mastra/agentMemory.ts` for memory.
- New tools for agents should be created in the `src/mastra/tools/` directory. Use Zod for input and output schema validation, as seen in `stock-tools.ts`.

## 3. Code Style & Conventions
- Use single quotes for all imports and strings.
- Follow the existing ESLint and Prettier configurations. The ESLint configuration is in `eslint.config.mjs`.
- For new pages, follow the structure of `src/app/page.tsx`.

## 4. Testing
- Tests are written with Vitest.
- New test files should end with `.test.ts`.
- See `src/mastra/agents/index.test.ts` for an example of an existing test.

## 5. Dependency Management
- Use npm for package management.
- Add new dependencies to the `dependencies` or `devDependencies` section of the `package.json` file as appropriate.

## 6. TSDoc Comments
- Use TSDoc comments for all public functions, classes, interfaces, and types.
- Follow the existing TSDoc style in `src/mastra/agents/master-agent.ts` and `src/mastra/tools/stock-tools.ts`.
- Ensure that all parameters and return types are documented clearly.
- Use `@param` for parameters and `@returns` for return values.
- Use `@example` for examples of usage where applicable.
- Use `@throws` for exceptions that can be thrown.
- Use `@see` to reference related functions or classes.
- Use `@link` to link to external documentation or resources.

## 7. Environment Variables
- Environment variables should be defined in the `.env.example` file.
- Use `process.env` to access environment variables in the code.
- Ensure that sensitive information is not hardcoded in the codebase.

## 8. Documentation
- Update the project documentation in the `README.md` file for any new features or changes.
- Ensure that the documentation is clear and concise.
- `CHANGELOG.md` should be updated for any significant changes or releases.

## 9. Code Best Practices
- Always write clean, readable code.
- Use meaningful variable and function names.
- Avoid complex logic in a single function; break it down into smaller, reusable functions.
- Use async/await for asynchronous operations.
- Handle errors gracefully and log them using PinoLogger.
- Use TypeScript types and interfaces to define the shape of data clearly.
- Avoid using `any` type; prefer specific types or interfaces.
- Use enums for fixed sets of values where applicable.
- Use TODO comments for code that needs to be implemented later, [TODO: <your-name> <date> <description>].
- Use JSDoc comments for functions and classes.
- Use ESLint and Prettier for code formatting and linting.
- Use Git for version control and commit messages should be clear and descriptive.