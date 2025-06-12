import { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
 
export default function Page() {
    return (
        <main>
            <h1>Your App</h1>
            <CopilotPopup
                labels={{
                    title: "AI Assistant",
                    initial: "How can I help you today?",
                }}
            />
        </main>
    );
}