import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
 
const MASTRA_URL = process.env.MASTRA_URL || "http://localhost:4111";
 
export default function RootLayout({ children }: {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>
                <CopilotKit runtimeUrl={`${MASTRA_URL}/copilotkit`}>
                    {children}
                </CopilotKit>
            </body>
        </html>
    );
}