"use client";

import { useState, createContext, useContext } from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const MASTRA_URL = process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL || "http://localhost:4111";

/**
 * Context for managing the current agent endpoint in the playground
 *
 * @interface AgentContextType
 * @property {string} currentEndpoint - The current agent endpoint URL
 * @property {function} setCurrentEndpoint - Function to update the current endpoint
 *
 * @author Dean Machines Team
 * @date 2025-01-13
 * @version 1.0.0
 */
const AgentContext = createContext<{
    currentEndpoint: string;
    setCurrentEndpoint: (endpoint: string) => void;
}>({
    currentEndpoint: `${MASTRA_URL}/copilotkit`,
    setCurrentEndpoint: () => { },
});

/**
 * Hook to access the agent context for endpoint management
 *
 * @returns {AgentContextType} The agent context with current endpoint and setter
 *
 * @example
 * ```typescript
 * const { currentEndpoint, setCurrentEndpoint } = useAgent();
 * setCurrentEndpoint('http://localhost:4111/copilotkit/research');
 * ```
 *
 * @author Dean Machines Team
 * @date 2025-01-13
 */
export const useAgent = () => useContext(AgentContext);

/**
 * Playground layout component that provides CopilotKit context and agent management
 *
 * This layout wraps all playground pages with the necessary CopilotKit providers
 * and agent context for multi-agent coordination. It handles dynamic endpoint
 * switching and provides session management for AI interactions.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The playground layout with CopilotKit providers
 *
 * @example
 * ```typescript
 * // Used automatically by Next.js App Router for (playground) route group
 * <PlaygroundLayout>
 *   <PlaygroundPage />
 * </PlaygroundLayout>
 * ```
 *
 * @author Dean Machines Team
 * @date 2025-01-13
 * @version 1.0.0
 */
export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
    const [currentEndpoint, setCurrentEndpoint] = useState(`${MASTRA_URL}/copilotkit`);

    return (
        <AgentContext.Provider value={{ currentEndpoint, setCurrentEndpoint }}>
            <CopilotKit
                runtimeUrl={currentEndpoint}
                headers={{
                    'X-User-ID': 'playground-user',
                    'X-Session-ID': `session-${Date.now()}`,
                    'X-Project-Context': 'DeanMachines Playground',
                    'X-Debug-Mode': 'true',
                }}
            >
                {children}
            </CopilotKit>
        </AgentContext.Provider>
    );
}
