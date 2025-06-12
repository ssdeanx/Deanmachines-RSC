'use client';

import { useState, createContext, useContext } from 'react';
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const MASTRA_URL = process.env.MASTRA_URL || "http://localhost:4111";

// Context for managing the current agent endpoint
const AgentContext = createContext<{
  currentEndpoint: string;
  setCurrentEndpoint: (endpoint: string) => void;
}>({
  currentEndpoint: `${MASTRA_URL}/copilotkit`,
  setCurrentEndpoint: () => {},
});

export const useAgent = () => useContext(AgentContext);

export default function PlaygroundLayout({ children }: {children: React.ReactNode}) {
    const [currentEndpoint, setCurrentEndpoint] = useState(`${MASTRA_URL}/copilotkit`);

    return (
        <html lang="en">
            <body>
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
            </body>
        </html>
    );
}
