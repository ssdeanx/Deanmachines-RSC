/**
 * Environment configuration for AI-Volt
 * Validates and exports environment variables
 */

import { z } from "zod";

// Define environment schema
const envSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1, "Google AI API key is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  PORT: z.coerce.number().default(3141),

  LANGSMITH_TRACING: z.string().default("true").transform((val) => val === "true"),
  LANGSMITH_API_KEY: z.string().min(1, "LangSmith API key is required"),
  LANGSMITH_ENDPOINT: z.string().default("https://api.smith.langchain.com"),
  LANGSMITH_PROJECT: z.string().default("pr-warmhearted-jewellery-74"),
    // Database configuration for LibSQL/Turso (for Mastra agents and AI memory)
  DATABASE_URL: z.string().min(1, "Database URL is required"),
  DATABASE_AUTH_TOKEN: z.string().min(1, "Database Auth is required"),
  
  // Neo4j configuration for graph database
  NEO4J_URL: z.string().min(1, "Neo4j URL is required"),
  NEO4J_USERNAME: z.string().min(1, "Neo4j username is required"),
  NEO4J_PASSWORD: z.string().min(1, "Neo4j password is required"),
  
  // Supabase configuration for user authentication and data
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, "Supabase URL is required"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  AUTH_DATABASE_URL: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  SUPABASE_URL: z.string().min(1, "Supabase URL is required"),
  MEM0_API_KEY: z.string().min(1, "Mem0 API key is required"),
  GITHUB_TOKEN: z.string().min(1, "GitHub API key is required"),
  LANGFUSE_PUBLIC_KEY: z.string().min(1, "Langfuse public key is required"),
  LANGFUSE_SECRET_KEY: z.string().min(1, "Langfuse secret key is required"),
  LANGFUSE_HOST: z.string().min(1, "Langfuse host is required"),
  LANGFUSE_TRACING: z.string().default("true").transform((val) => val === "true"),
  TAVILY_API_KEY: z.string().min(1, "Tavily API key is required"),
});
// Validate environment variables
const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Environment validation failed:");
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

export const env = validateEnv();

export type Environment = z.infer<typeof envSchema>;
