This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```mermaid
%%{init: {'theme': 'default', 'themeVariables': {'primaryColor': '#4A90E2', 'edgeLabelBackground':'#f0f0f0', 'tertiaryColor': '#000000'}}}%%
%%{flowchart: {curve: 'linear'}}%%
%%{flowchart: {nodeSpacing: 50, rankSpacing: 50}}%%
%%{flowchart: {defaultRenderer: 'dagre', htmlLabels: true, nodeSpacing: 50, rankSpacing: 50, useMaxWidth: false, padding: 10, fontSize: 14, fontFamily: 'Arial'}}%%
graph TD

    1123["User<br>External Actor"]
    1138["User<br>External Actor"]
    subgraph 1108["External Systems"]
        1117["Cloud LLM APIs<br>Google AI, etc."]
        1118["Vector Databases<br>LibSQL, Pinecone, etc."]
        1119["Data Stores<br>LibSQL, etc."]
        1120["MCP Service<br>Proprietary MCP API"]
        1121["Weather APIs<br>OpenWeatherMap, etc."]
        1122["Finance APIs<br>Alpha Vantage, etc."]
    end
    subgraph 1109["Dean Machines RSC Application<br>Next.js"]
        1110["Frontend UI<br>Next.js/React"]
        1111["Mastra Core<br>TypeScript"]
        1112["Agent Orchestration<br>TypeScript"]
        1113["Weather Workflow<br>TypeScript"]
        1114["Agent Tools<br>TypeScript"]
        1115["Agent Memory<br>TypeScript"]
        1116["Configuration<br>TypeScript"]
        %% Edges at this level (grouped by source)
        1110["Frontend UI<br>Next.js/React"] -->|initiates tasks via| 1111["Mastra Core<br>TypeScript"]
        1111["Mastra Core<br>TypeScript"] -->|orchestrates| 1112["Agent Orchestration<br>TypeScript"]
        1111["Mastra Core<br>TypeScript"] -->|executes| 1113["Weather Workflow<br>TypeScript"]
        1111["Mastra Core<br>TypeScript"] -->|utilizes| 1115["Agent Memory<br>TypeScript"]
        1111["Mastra Core<br>TypeScript"] -->|loads| 1116["Configuration<br>TypeScript"]
        1113["Weather Workflow<br>TypeScript"] -->|employs| 1112["Agent Orchestration<br>TypeScript"]
        1113["Weather Workflow<br>TypeScript"] -->|utilizes| 1114["Agent Tools<br>TypeScript"]
        1112["Agent Orchestration<br>TypeScript"] -->|uses| 1115["Agent Memory<br>TypeScript"]
    end
    subgraph 1124["External Systems"]
        1135["AI APIs<br>Google AI, FastEmbed, etc."]
        1136["Database APIs<br>LibSQL, etc."]
        1137["External Data APIs<br>Stock/Weather Providers, etc."]
    end
    subgraph 1125["Mastra Agent Service<br>TypeScript/Node.js"]
        1129["Mastra Service Entry<br>TypeScript"]
        1130["Master Agent<br>TypeScript"]
        1131["Agent Tools<br>TypeScript"]
        1132["Agent Workflows<br>TypeScript"]
        1133["Agent Memory<br>TypeScript"]
        1134["Environment Config<br>TypeScript"]
        %% Edges at this level (grouped by source)
        1129["Mastra Service Entry<br>TypeScript"] -->|Initializes & Uses| 1130["Master Agent<br>TypeScript"]
        1129["Mastra Service Entry<br>TypeScript"] -->|Loads| 1134["Environment Config<br>TypeScript"]
        1130["Master Agent<br>TypeScript"] -->|Utilizes| 1131["Agent Tools<br>TypeScript"]
        1130["Master Agent<br>TypeScript"] -->|Orchestrates| 1132["Agent Workflows<br>TypeScript"]
        1130["Master Agent<br>TypeScript"] -->|Manages State with| 1133["Agent Memory<br>TypeScript"]
        1132["Agent Workflows<br>TypeScript"] -->|Uses| 1131["Agent Tools<br>TypeScript"]
    end
    subgraph 1126["Web Application<br>Next.js/React"]
        1127["UI Components<br>Next.js/React"]
        1128["Static Assets<br>Files"]
        %% Edges at this level (grouped by source)
        1127["UI Components<br>Next.js/React"] -->|Loads| 1128["Static Assets<br>Files"]
    end
    %% Edges at this level (grouped by source)
    1123["User<br>External Actor"] -->|interacts with| 1110["Frontend UI<br>Next.js/React"]
    1113["Weather Workflow<br>TypeScript"] -->|calls| 1117["Cloud LLM APIs<br>Google AI, etc."]
    1112["Agent Orchestration<br>TypeScript"] -->|calls| 1117["Cloud LLM APIs<br>Google AI, etc."]
    1112["Agent Orchestration<br>TypeScript"] -->|persists to| 1119["Data Stores<br>LibSQL, etc."]
    1115["Agent Memory<br>TypeScript"] -->|processes with| 1117["Cloud LLM APIs<br>Google AI, etc."]
    1115["Agent Memory<br>TypeScript"] -->|stores/retrieves embeddings in| 1118["Vector Databases<br>LibSQL, Pinecone, etc."]
    1115["Agent Memory<br>TypeScript"] -->|persists state to| 1119["Data Stores<br>LibSQL, etc."]
    1114["Agent Tools<br>TypeScript"] -->|accesses| 1118["Vector Databases<br>LibSQL, Pinecone, etc."]
    1114["Agent Tools<br>TypeScript"] -->|communicates with| 1120["MCP Service<br>Proprietary MCP API"]
    1114["Agent Tools<br>TypeScript"] -->|fetches data from| 1121["Weather APIs<br>OpenWeatherMap, etc."]
    1114["Agent Tools<br>TypeScript"] -->|fetches data from| 1122["Finance APIs<br>Alpha Vantage, etc."]
    1138["User<br>External Actor"] -->|Interacts with| 1127["UI Components<br>Next.js/React"]
    1127["UI Components<br>Next.js/React"] -->|Makes API calls to| 1129["Mastra Service Entry<br>TypeScript"]
    1130["Master Agent<br>TypeScript"] -->|Uses AI for decisions| 1135["AI APIs<br>Google AI, FastEmbed, etc."]
    1132["Agent Workflows<br>TypeScript"] -->|Calls LLM| 1135["AI APIs<br>Google AI, FastEmbed, etc."]
    1131["Agent Tools<br>TypeScript"] -->|Uses AI models/embeddings| 1135["AI APIs<br>Google AI, FastEmbed, etc."]
    1131["Agent Tools<br>TypeScript"] -->|Fetches data from| 1137["External Data APIs<br>Stock/Weather Providers, etc."]
    1133["Agent Memory<br>TypeScript"] -->|Uses for embeddings/summaries| 1135["AI APIs<br>Google AI, FastEmbed, etc."]
    1133["Agent Memory<br>TypeScript"] -->|Stores/Retrieves from| 1136["Database APIs<br>LibSQL, etc."]
```
