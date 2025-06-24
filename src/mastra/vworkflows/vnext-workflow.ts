// vNext Agent Network Workflow - Powered by Mastra
import { NewAgentNetwork } from '@mastra/core/network/vNext';
import { Agent } from '@mastra/core/agent';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { upstashMemory } from '../upstashMemory';
import { google } from '../config/googleProvider';
import { z } from 'zod';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { PinoLogger } from "@mastra/loggers";
import { generateId } from 'ai';

// Logger setup for workflow tracking
const logger = new PinoLogger({ 
  name: 'vNextWorkflow', 
  level: 'info' 
});

logger.info('Initializing vNext Agent Network Workflow');

import { masterAgent } from '../agents/master-agent';
import { supervisorAgent } from '../agents/supervisor-agent';
import { researchAgent as customResearchAgent } from '../agents/research-agent';
import { analyzerAgent } from '../agents/analyzer-agent';
import { graphAgent } from '../agents/graph-agent';
import { codeAgent } from '../agents/code-agent';
import { gitAgent } from '../agents/git-agent';
import { dockerAgent } from '../agents/docker-agent';
import { specialAgent } from '../agents/special-agent';
import { documentationAgent } from '../agents/documentation-agent';

// Define agents for the network
const researchAgent = customResearchAgent;

const synthesisAgent = new Agent({
  name: 'synthesis-agent',
  description: 'This agent synthesizes researched material into full reports. It writes detailed paragraphs, not bullet points.',
  instructions: 'This agent synthesizes researched material into comprehensive reports. Write full paragraphs without bullet points.',
  model: google('gemini-2.5-flash-lite-preview-06-17'),
});

// Define a sub-workflow for specific city research as an example
const cityResearchStep1 = createStep({
  id: 'city-research-step1',
  description: 'Research specific city details.',
  inputSchema: z.object({
    city: z.string().describe('The city to research'),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await researchAgent.generate(inputData.city, {
      output: z.object({
        text: z.string(),
      }),
    });
    return { text: resp.object.text };
  },
});

const cityResearchStep2 = createStep({
  id: 'city-research-step2',
  description: 'Synthesize research data for a city into a report.',
  inputSchema: z.object({
    text: z.string().describe('The research data to synthesize'),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await synthesisAgent.generate(inputData.text, {
      output: z.object({
        text: z.string(),
      }),
    });
    return { text: resp.object.text };
  },
});

const cityResearchWorkflow = createWorkflow({
  id: 'city-research-workflow',
  description: 'This workflow is ideal for researching a specific city and creating a detailed report.',
  steps: [],
  inputSchema: z.object({
    city: z.string(),
  }),
  outputSchema: z.object({
    text: z.string(),
  }),
})
.then(cityResearchStep1)
.then(cityResearchStep2)
.commit();

// Define a sub-workflow for project solution tasks
const projectSolutionStep1 = createStep({
  id: 'project-solution-step1',
  description: 'Coordinate and delegate project tasks using master and supervisor agents.',
  inputSchema: z.object({
    task: z.string().describe('The project task to solve'),
    domain: z.string().optional().describe('The domain of the task, if applicable'),
  }),
  outputSchema: z.object({
    plan: z.string(),
  }),
  execute: async ({ inputData }) => {
    const instruction = inputData.domain 
      ? `Coordinate and delegate the task in the ${inputData.domain} domain: "${inputData.task}". Create a plan for solving this task.`
      : `Coordinate and delegate the task: "${inputData.task}". Create a plan for solving this task.`;
    const resp = await masterAgent.generate(instruction, {
      output: z.object({
        plan: z.string(),
      }),
    });
    return { plan: resp.object.plan };
  },
});

const projectSolutionStep2 = createStep({
  id: 'project-solution-step2',
  description: 'Execute the project plan with appropriate agents.',
  inputSchema: z.object({
    plan: z.string().describe('The plan to execute'),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await supervisorAgent.generate(`Execute the plan: "${inputData.plan}". Delegate tasks to appropriate agents as needed.`, {
      output: z.object({
        result: z.string(),
      }),
    });
    return { result: resp.object.result };
  },
});

const projectSolutionWorkflow = createWorkflow({
  id: 'project-solution-workflow',
  description: 'This workflow is designed for solving a wide range of project-related tasks using multiple specialized agents.',
  steps: [],
  inputSchema: z.object({
    task: z.string(),
    domain: z.string().optional(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
})
.then(projectSolutionStep1)
.then(projectSolutionStep2)
.commit();

// Define a sub-workflow for code graph analysis
const codeGraphStep1 = createStep({
  id: 'code-graph-step1',
  description: 'Analyze code structure and dependencies using code agent.',
  inputSchema: z.object({
    codeContext: z.string().describe('The code context or repository to analyze'),
  }),
  outputSchema: z.object({
    analysis: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await codeAgent.generate(`Analyze the code structure and dependencies in: "${inputData.codeContext}". Provide a detailed analysis.`, {
      output: z.object({
        analysis: z.string(),
      }),
    });
    return { analysis: resp.object.analysis };
  },
});

const codeGraphStep2 = createStep({
  id: 'code-graph-step2',
  description: 'Generate a visual representation of code relationships using graph agent.',
  inputSchema: z.object({
    analysis: z.string().describe('The code analysis to visualize'),
  }),
  outputSchema: z.object({
    graph: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await graphAgent.generate(`Generate a visual representation of code relationships based on: "${inputData.analysis}".`, {
      output: z.object({
        graph: z.string(),
      }),
    });
    return { graph: resp.object.graph };
  },
});

const codeGraphWorkflow = createWorkflow({
  id: 'code-graph-workflow',
  description: 'This workflow is designed for analyzing code structure and generating visual representations of code relationships.',
  steps: [],
  inputSchema: z.object({
    codeContext: z.string(),
  }),
  outputSchema: z.object({
    graph: z.string(),
  }),
})
.then(codeGraphStep1)
.then(codeGraphStep2)
.commit();

// Define a sub-workflow for data analysis tasks
const dataAnalysisStep1 = createStep({
  id: 'data-analysis-step1',
  description: 'Gather data for analysis using research agent.',
  inputSchema: z.object({
    dataTopic: z.string().describe('The data topic or dataset to analyze'),
  }),
  outputSchema: z.object({
    data: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await researchAgent.generate(`Gather data for analysis on: "${inputData.dataTopic}".`, {
      output: z.object({
        data: z.string(),
      }),
    });
    return { data: resp.object.data };
  },
});

const dataAnalysisStep2 = createStep({
  id: 'data-analysis-step2',
  description: 'Analyze the gathered data using analyzer agent.',
  inputSchema: z.object({
    data: z.string().describe('The data to analyze'),
  }),
  outputSchema: z.object({
    insights: z.string(),
  }),
  execute: async ({ inputData }) => {
    const resp = await analyzerAgent.generate(`Analyze the data: "${inputData.data}". Provide detailed insights.`, {
      output: z.object({
        insights: z.string(),
      }),
    });
    return { insights: resp.object.insights };
  },
});

const dataAnalysisWorkflow = createWorkflow({
  id: 'data-analysis-workflow',
  description: 'This workflow is designed for gathering and analyzing data to provide actionable insights.',
  steps: [],
  inputSchema: z.object({
    dataTopic: z.string(),
  }),
  outputSchema: z.object({
    insights: z.string(),
  }),
})
.then(dataAnalysisStep1)
.then(dataAnalysisStep2)
.commit();

// Define a sub-workflow for git operations
const gitOperationStep1 = createStep({
  id: 'git-operation-step1',
  description: 'Perform git operations using git agent.',
  inputSchema: z.object({
    gitCommand: z.string().describe('The git command or operation to perform'),
    repoPath: z.string().optional().describe('The repository path for git operations'),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ inputData }) => {
    const instruction = inputData.repoPath 
      ? `Perform the git operation: "${inputData.gitCommand}" in repository: "${inputData.repoPath}".`
      : `Perform the git operation: "${inputData.gitCommand}".`;
    const resp = await gitAgent.generate(instruction, {
      output: z.object({
        result: z.string(),
      }),
    });
    return { result: resp.object.result };
  },
});

const gitOperationWorkflow = createWorkflow({
  id: 'git-operation-workflow',
  description: 'This workflow is designed for performing git operations like commit, branch, and merge using the git agent.',
  steps: [],
  inputSchema: z.object({
    gitCommand: z.string(),
    repoPath: z.string().optional(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
})
.then(gitOperationStep1)
.commit();

// Define a sub-workflow for docker containerization
const dockerContainerStep1 = createStep({
  id: 'docker-container-step1',
  description: 'Create or manage Docker containers using docker agent.',
  inputSchema: z.object({
    dockerTask: z.string().describe('The Docker task or operation to perform'),
    environment: z.string().optional().describe('The deployment environment for Docker operations'),
  }),
  outputSchema: z.object({
    configuration: z.string(),
  }),
  execute: async ({ inputData }) => {
    const instruction = inputData.environment 
      ? `Perform the Docker task: "${inputData.dockerTask}" for environment: "${inputData.environment}".`
      : `Perform the Docker task: "${inputData.dockerTask}".`;
    const resp = await dockerAgent.generate(instruction, {
      output: z.object({
        configuration: z.string(),
      }),
    });
    return { configuration: resp.object.configuration };
  },
});

const dockerContainerWorkflow = createWorkflow({
  id: 'docker-container-workflow',
  description: 'This workflow is designed for creating and managing Docker containers and configurations using the docker agent.',
  steps: [],
  inputSchema: z.object({
    dockerTask: z.string(),
    environment: z.string().optional(),
  }),
  outputSchema: z.object({
    configuration: z.string(),
  }),
})
.then(dockerContainerStep1)
.commit();

// Define a sub-workflow for documentation tasks
const documentationStep1 = createStep({
  id: 'documentation-step1',
  description: 'Generate or update documentation using documentation agent.',
  inputSchema: z.object({
    docRequest: z.string().describe('The documentation request or topic to document'),
    docType: z.string().optional().describe('The type of documentation to create'),
  }),
  outputSchema: z.object({
    documentation: z.string(),
  }),
  execute: async ({ inputData }) => {
    const instruction = inputData.docType 
      ? `Generate or update ${inputData.docType} documentation for: "${inputData.docRequest}".`
      : `Generate or update documentation for: "${inputData.docRequest}".`;
    const resp = await documentationAgent.generate(instruction, {
      output: z.object({
        documentation: z.string(),
      }),
    });
    return { documentation: resp.object.documentation };
  },
});

const documentationWorkflow = createWorkflow({
  id: 'documentation-workflow',
  description: 'This workflow is designed for generating and updating technical documentation using the documentation agent.',
  steps: [],
  inputSchema: z.object({
    docRequest: z.string(),
    docType: z.string().optional(),
  }),
  outputSchema: z.object({
    documentation: z.string(),
  }),
})
.then(documentationStep1)
.commit();

// Memory setup for task history in complex executions
const memory = upstashMemory;

// Define the vNext Agent Network
const vNextNetwork = new NewAgentNetwork({
  id: 'vnext-research-network',
  name: 'vNext Research Network',
  instructions: 'You are a network of researchers, writers, and specialized agents. Handle both simple queries and complex research tasks. For complex tasks requiring multiple steps, ensure a full report is generated with detailed paragraphs. Utilize the master agent for overall coordination, supervisor agent for task delegation, research agent for information gathering, analyzer agent for data insights, code agent for code analysis, graph agent for knowledge graph analysis, git agent for version control, docker agent for containerization, special agent for unique tasks, and documentation agent for technical writing.',
  model: google('gemini-2.5-flash-lite-preview-06-17'),
  agents: {
    'master-agent': masterAgent,
    'supervisor-agent': supervisorAgent,
    'research-agent': researchAgent,
    'synthesis-agent': synthesisAgent,
    'analyzer-agent': analyzerAgent,
    'code-agent': codeAgent,
    'graph-agent': graphAgent,
    'git-agent': gitAgent,
    'docker-agent': dockerAgent,
    'special-agent': specialAgent,
    'documentation-agent': documentationAgent
  },
  workflows: {
    'city-research-workflow': cityResearchWorkflow,
    'project-solution-workflow': projectSolutionWorkflow,
    'code-graph-workflow': codeGraphWorkflow,
    'data-analysis-workflow': dataAnalysisWorkflow,
    'git-operation-workflow': gitOperationWorkflow,
    'docker-container-workflow': dockerContainerWorkflow,
    'documentation-workflow': documentationWorkflow
  },
  memory: memory
});

/**
 * vNext Research Workflow
 * 
 * This workflow leverages the vNext Agent Network for dynamic orchestration of research tasks.
 * It supports both single task execution with 'generate' for quick queries and complex task
 * execution with 'loop' for multi-step research requiring multiple agents.
 * 
 * @param topic - The research topic or query to process
 * @param options - Configuration options for the research task
 * @returns Promise resolving to the research results
 */
export async function vNextResearchWorkflow(topic: string, options: { isComplex?: boolean } = {}) {
  const workflowId = generateId();
  const runtimeContext = new RuntimeContext();
  logger.info('vNext Research Workflow started', {
    workflowId,
    topic,
    isComplex: options.isComplex || false,
    event: 'vnext_workflow_started'
  });

  try {
    let result;
    if (options.isComplex) {
      // Use 'loop' for complex, multi-step tasks requiring multiple agents
      logger.info('Executing complex task with loop method', {
        workflowId,
        event: 'complex_task_started'
      });
      result = await vNextNetwork.loop(
        `Conduct comprehensive research on: "${topic}". Break down the task into multiple steps if necessary, research thoroughly, and provide a final synthesized report. Ensure the synthesis agent is used for the final report.`,
        { runtimeContext }
      );
    } else {
      // Use 'generate' for single task execution
      logger.info('Executing single task with generate method', {
        workflowId,
        event: 'single_task_started'
      });
      result = await vNextNetwork.generate(topic, { runtimeContext });
    }

    logger.info('vNext Research Workflow completed', {
      workflowId,
      resultContent: result ? 'Content received' : 'No content',
      event: 'vnext_workflow_completed'
    });

    return {
      workflowId,
      result,
      status: 'success' as const,
    };
  } catch (error) {
    logger.error('vNext Research Workflow failed', {
      workflowId,
      error: error instanceof Error ? error.message : String(error),
      event: 'vnext_workflow_failed'
    });
    return {
      workflowId,
      result: null,
      status: 'failed' as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * vNext Project Solution Workflow
 * 
 * This workflow leverages the vNext Agent Network for orchestrating comprehensive solutions to project-related tasks.
 * It is designed to handle a wide range of tasks including technical problem-solving, project management, data analysis,
 * and knowledge graph analysis by utilizing specialized agents like Master, Supervisor, Research, Analyzer, and Graph agents.
 * 
 * @param task - The project task or problem to solve
 * @param options - Configuration options for the task execution
 * @returns Promise resolving to the solution results
 */
export async function vNextProjectSolutionWorkflow(task: string, options: { isComplex?: boolean; domain?: string } = {}) {
  const workflowId = generateId();
  const runtimeContext = new RuntimeContext();
  logger.info('vNext Project Solution Workflow started', {
    workflowId,
    task,
    isComplex: options.isComplex || false,
    domain: options.domain || 'general',
    event: 'project_solution_workflow_started'
  });

  try {
    let result;
    const instruction = options.domain 
      ? `Solve the following task in the ${options.domain} domain: "${task}". Utilize the appropriate agents based on the task requirements. For coordination, use the master agent; for task delegation, use the supervisor agent; for research, use the research agent; for data analysis, use the analyzer agent; and for knowledge graph analysis, use the graph agent. Break down complex tasks into manageable steps if necessary.`
      : `Solve the following task: "${task}". Utilize the appropriate agents based on the task requirements. For coordination, use the master agent; for task delegation, use the supervisor agent; for research, use the research agent; for data analysis, use the analyzer agent; and for knowledge graph analysis, use the graph agent. Break down complex tasks into manageable steps if necessary.`;

    if (options.isComplex) {
      // Use 'loop' for complex, multi-step tasks requiring multiple agents
      logger.info('Executing complex project task with loop method', {
        workflowId,
        event: 'complex_project_task_started'
      });
      result = await vNextNetwork.loop(instruction, { runtimeContext });
    } else {
      // Use 'generate' for simpler task execution
      logger.info('Executing single project task with generate method', {
        workflowId,
        event: 'single_project_task_started'
      });
      result = await vNextNetwork.generate(instruction, { runtimeContext });
    }

    logger.info('vNext Project Solution Workflow completed', {
      workflowId,
      resultContent: result ? 'Content received' : 'No content',
      event: 'project_solution_workflow_completed'
    });

    return {
      workflowId,
      result,
      status: 'success' as const,
    };
  } catch (error) {
    logger.error('vNext Project Solution Workflow failed', {
      workflowId,
      error: error instanceof Error ? error.message : String(error),
      event: 'project_solution_workflow_failed'
    });
    return {
      workflowId,
      result: null,
      status: 'failed' as const,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Export the network for direct usage if needed
export { vNextNetwork };

logger.info('vNext Agent Network Workflow registered successfully', {
  workflowId: 'vnext-research-network',
  agentsCount: 11,
  workflowsCount: 7,
  event: 'vnext_network_registered'
});
