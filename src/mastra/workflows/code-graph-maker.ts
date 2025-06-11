// Generated on December 11, 2024
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import {
  gitAgent,
  graphAgent,
  dataAgent,
  analyzerAgent,
} from '../agents';
import { generateId } from 'ai'; // Project standard for ID generation

/**
 * @interface CodeGraphMakerInput
 * @description Input schema for the Code Graph Maker workflow.
 * @property {string} githubRepoUrl - The URL of the GitHub repository to analyze.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const codeGraphMakerInputSchema = z.object({
  githubRepoUrl: z.string().url({ message: "Invalid GitHub repository URL" }),
});

/**
 * @interface CodeGraphMakerOutput
 * @description Output schema for the Code Graph Maker workflow.
 * @property {string} workflowId - The unique ID for this workflow run.
 * @property {any} graphData - The generated graph data (e.g., SVG string, JSON, image URL). Null if an error occurred.
 * @property {string} status - The final status of the workflow.
 * @property {string} [errorMessage] - An error message if the workflow failed.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const codeGraphMakerOutputSchema = z.object({
  workflowId: z.string(),
  graphData: z.any().nullable(), // Consider a more specific type if the graph data structure is known
  status: z.string(),
  errorMessage: z.string().optional(),
});

/**
 * @step initializeWorkflowStep
 * @description Initializes the workflow by generating a unique ID and recording the start time.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const initializeWorkflowStep = createStep({
  id: 'initializeWorkflow',
  description: 'Initializes the workflow by generating a unique ID and recording the start time',
  inputSchema: codeGraphMakerInputSchema,
  outputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
  }),
  execute: async ({ inputData }) => {
    const workflowId = generateId();
    console.log(`[${workflowId}] Initializing workflow for ${inputData.githubRepoUrl}`);
    return {
      workflowId,
      githubRepoUrl: inputData.githubRepoUrl,
      status: 'initialized',
      startTime: Date.now(),
    };
  },
});

/**
 * @step cloneRepositoryStep
 * @description Clones the specified GitHub repository to a local temporary directory using the gitAgent.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const cloneRepositoryStep = createStep({
  id: 'cloneRepository',
  description: 'Clones the specified GitHub repository to a local temporary directory',
  inputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
  }),
  outputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    console.log(`[${inputData.workflowId}] Cloning repository: ${inputData.githubRepoUrl}`);
    try {
      const { text } = await gitAgent.generate([
        { 
          role: 'user', 
          content: `Clone this repository: ${inputData.githubRepoUrl}. Return only the local path where it was cloned.` 
        }
      ]);
      
      if (!text) {
        throw new Error('Repository cloning failed or localPath not returned by agent.');
      }
      
      console.log(`[${inputData.workflowId}] Repository cloned to: ${text}`);
      return {
        ...inputData,
        localRepoPath: text.trim(),
        status: 'repositoryCloned',
      };
    } catch (error: unknown) {
      console.error(`[${inputData.workflowId}] Error cloning repository:`, error);
      const message = error instanceof Error ? error.message : String(error);
      return { ...inputData, status: 'errorCloning', error: message };
    }
  },
});

/**
 * @step listFilesStep
 * @description Lists all files within the cloned repository using the dataAgent.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const listFilesStep = createStep({
  id: 'listFilesAndContent',
  description: 'Lists all files within the cloned repository',
  inputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    error: z.string().optional(),
  }),
  outputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.status !== 'repositoryCloned' || !inputData.localRepoPath) {
      return { ...inputData, status: 'skippedFileListing', error: inputData.error || 'Cloning failed or path missing.' };
    }
    
    console.log(`[${inputData.workflowId}] Listing files in: ${inputData.localRepoPath}`);
    try {
      const { text } = await dataAgent.generate([
        { 
          role: 'user', 
          content: `List all files recursively in this directory: ${inputData.localRepoPath}. Return only the file paths, one per line.` 
        }
      ]);
      
      if (!text) {
        throw new Error('Failed to list files or no files returned by agent.');
      }
      
      const filePaths = text.split('\n').filter(path => path.trim().length > 0);
      console.log(`[${inputData.workflowId}] Found ${filePaths.length} files.`);
      
      return {
        ...inputData,
        retrievedFilePaths: filePaths,
        status: 'filesListed',
      };
    } catch (error: unknown) {
      console.error(`[${inputData.workflowId}] Error listing files:`, error);
      const message = error instanceof Error ? error.message : String(error);
      return { ...inputData, status: 'errorListingFiles', error: message };
    }
  },
});

/**
 * @step analyzeDependenciesStep
 * @description Analyzes code dependencies from the retrieved file paths using the analyzerAgent.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const analyzeDependenciesStep = createStep({
  id: 'analyzeDependencies',
  description: 'Analyzes code dependencies from the retrieved file paths',
  inputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    error: z.string().optional(),
  }),
  outputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    dependencies: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.status !== 'filesListed' || !inputData.retrievedFilePaths || !inputData.localRepoPath) {
      return { ...inputData, status: 'skippedAnalysis', error: inputData.error || 'File listing failed or paths missing.' };
    }
    
    console.log(`[${inputData.workflowId}] Analyzing dependencies for ${inputData.retrievedFilePaths.length} files.`);
    try {
      const { text } = await analyzerAgent.generate([
        { 
          role: 'user', 
          content: `Analyze dependencies in these files: ${inputData.retrievedFilePaths.slice(0, 50).join(', ')}. Return dependency relationships as JSON.` 
        }
      ]);
      
      if (!text) {
        throw new Error('Dependency analysis failed or did not return dependencies from agent.');
      }
      
      let dependencies;
      try {
        dependencies = JSON.parse(text);
      } catch {
        dependencies = { raw: text, parsed: false };
      }
      
      console.log(`[${inputData.workflowId}] Dependencies analyzed successfully.`);
      return {
        ...inputData,
        dependencies: dependencies,
        status: 'dependenciesAnalyzed',
      };
    } catch (error: unknown) {
      console.error(`[${inputData.workflowId}] Error analyzing dependencies:`, error);
      const message = error instanceof Error ? error.message : String(error);
      return { ...inputData, status: 'errorAnalyzing', error: message };
    }
  },
});

/**
 * @step generateGraphStep
 * @description Generates a visual graph from the analyzed dependencies using the graphAgent.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const generateGraphStep = createStep({
  id: 'generateGraph',
  description: 'Generates a visual graph from the analyzed dependencies',
  inputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    dependencies: z.any().optional(),
    error: z.string().optional(),
  }),
  outputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    dependencies: z.any().optional(),
    graphOutput: z.any().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (inputData.status !== 'dependenciesAnalyzed' || !inputData.dependencies) {
      return { ...inputData, status: 'skippedGraphGeneration', error: inputData.error || 'Analysis failed or dependencies missing.' };
    }
    
    console.log(`[${inputData.workflowId}] Generating graph from dependencies.`);
    try {
      const { text } = await graphAgent.generate([
        { 
          role: 'user', 
          content: `Generate a dependency graph from this data: ${JSON.stringify(inputData.dependencies)}. Return the graph as SVG or a visualization format.` 
        }
      ]);
      
      if (!text) {
        throw new Error('Graph generation failed or did not return graphData from agent.');
      }
      
      console.log(`[${inputData.workflowId}] Graph generated successfully.`);
      return {
        ...inputData,
        graphOutput: text,
        status: 'graphGenerated',
      };
    } catch (error: unknown) {
      console.error(`[${inputData.workflowId}] Error generating graph:`, error);
      const message = error instanceof Error ? error.message : String(error);
      return { ...inputData, status: 'errorGeneratingGraph', error: message };
    }
  },
});

/**
 * @step cleanupRepositoryStep
 * @description Cleans up the cloned repository from the local file system using the dataAgent.
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
const cleanupRepositoryStep = createStep({
  id: 'cleanupRepository',
  description: 'Cleans up the cloned repository from the local file system',
  inputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    dependencies: z.any().optional(),
    graphOutput: z.any().optional(),
    error: z.string().optional(),
  }),
  outputSchema: z.object({
    workflowId: z.string(),
    githubRepoUrl: z.string(),
    status: z.string(),
    startTime: z.number(),
    localRepoPath: z.string().nullable().optional(),
    retrievedFilePaths: z.array(z.string()).optional(),
    dependencies: z.any().optional(),
    graphOutput: z.any().optional(),
    error: z.string().optional(),
    cleanupError: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    if (!inputData.localRepoPath) {
      console.warn(`[${inputData.workflowId}] No local repository path found, skipping cleanup.`);
      return { ...inputData, status: inputData.status || 'cleanupSkippedNoPath' };
    }
    
    console.log(`[${inputData.workflowId}] Cleaning up repository: ${inputData.localRepoPath}`);
    try {
      await dataAgent.generate([
        { 
          role: 'user', 
          content: `Delete this directory and all its contents: ${inputData.localRepoPath}` 
        }
      ]);
      
      console.log(`[${inputData.workflowId}] Repository cleaned up successfully.`);
      return {
        ...inputData,
        localRepoPath: null,
        status: inputData.graphOutput ? 'repositoryCleanedAfterGraph' : 'repositoryCleanedAfterError',
      };
    } catch (error: unknown) {
      console.error(`[${inputData.workflowId}] Error cleaning up repository:`, error);
      const message = error instanceof Error ? error.message : String(error);
      return { ...inputData, status: 'errorCleaningUp', cleanupError: message };
    }
  },
});/**
 * @workflow codeGraphMakerWorkflow
 * @description A Mastra workflow to analyze a GitHub repository, identify code dependencies,
 * and generate a visual dependency graph.
 * It uses various agents (git, data, analyzer, graph) to perform its tasks.
 *
 * @param {CodeGraphMakerInput} input - The input for the workflow, including the GitHub repository URL.
 * @returns {Promise<CodeGraphMakerOutput>} The result of the workflow, including the graph data or an error.
 *
 * @example
 * const result = await codeGraphMakerWorkflow.createRun().start({
 *   inputData: { githubRepoUrl: 'https://github.com/owner/repo.git' }
 * });
 * if (result.result.graphData) {
 *   console.log('Graph generated:', result.result.graphData);
 * } else {
 *   console.error('Workflow failed:', result.result.errorMessage);
 * }
 * [EDIT: December 11, 2024] & [BY: Claude]
 */
export const codeGraphMakerWorkflow = createWorkflow({
  id: 'codeGraphMaker',
  description: 'Analyzes a GitHub repository and generates a visual dependency graph',
  inputSchema: codeGraphMakerInputSchema,
  outputSchema: codeGraphMakerOutputSchema,
})
  .then(initializeWorkflowStep)
  .then(cloneRepositoryStep)
  .then(listFilesStep)
  .then(analyzeDependenciesStep)
  .then(generateGraphStep)
  .then(cleanupRepositoryStep)
  .map(({ inputData }) => {
    /**
     * @description Finalizes the workflow, calculating duration and preparing the definitive output.
     * [EDIT: December 11, 2024] & [BY: Claude]
     */
    const duration = (Date.now() - inputData.startTime) / 1000;
    console.log(`[${inputData.workflowId}] Workflow finished in ${duration}s. Final status: ${inputData.status}`);

    const finalStatus = inputData.status || 'unknown';
    let errorMessage = inputData.error || inputData.cleanupError;

    if (finalStatus.startsWith('error')) {
       // Error already set from a failing step
    } else if (finalStatus === 'skippedFileListing' || finalStatus === 'skippedAnalysis' || finalStatus === 'skippedGraphGeneration') {
      errorMessage = errorMessage || `Workflow step skipped due to previous error or missing data. Final status: ${finalStatus}`;
    } else if (!inputData.graphOutput && !finalStatus.startsWith('error') && finalStatus !== 'initialized' && finalStatus !== 'repositoryCloned' && finalStatus !== 'filesListed' && finalStatus !== 'dependenciesAnalyzed' && finalStatus !== 'cleanupSkippedNoPath' && finalStatus !== 'repositoryCleanedAfterError') {
      // If graphOutput is missing and it's not an early exit or error state, it's an issue.
      errorMessage = errorMessage || `Workflow completed but graph data is missing. Final status: ${finalStatus}`;
    }

    return {
      workflowId: inputData.workflowId,
      graphData: inputData.graphOutput || null,
      status: finalStatus,
      errorMessage: errorMessage,
    };
  })
  .commit();
