import { MessagesProps, CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotChat } from "@copilotkit/react-core";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

function CustomMessages({
  messages,
  inProgress,
  RenderTextMessage,
  RenderActionExecutionMessage,
  RenderResultMessage,
  RenderAgentStateMessage,
}: MessagesProps) {
  const wrapperStyles = "p-4 flex flex-col gap-2 h-full overflow-y-auto bg-indigo-300";

  /*
    Message types handled:
    - TextMessage: Regular chat messages
    - ActionExecutionMessage: When the LLM executes an action
    - ResultMessage: Results from actions
    - AgentStateMessage: Status updates from CoAgents
  */

  return (
    <div className={wrapperStyles}>
      {messages.map((message, index) => {
        if (message.isTextMessage()) {
          return <RenderTextMessage
            key={message.id}
            message={message}
            inProgress={inProgress}
            index={index}
            isCurrentMessage={index === messages.length - 1}
          />;
        } else if (message.isActionExecutionMessage()) {
          return <RenderActionExecutionMessage
            key={message.id}
            message={message}
            inProgress={inProgress}
            index={index}
            isCurrentMessage={index === messages.length - 1}
          />;
        } else if (message.isResultMessage()) {
          return <RenderResultMessage
            key={message.id}
            message={message}
            inProgress={inProgress}
            index={index}
            isCurrentMessage={index === messages.length - 1}
          />;
        } else if (message.isAgentStateMessage()) {
          return <RenderAgentStateMessage
            key={message.id}
            message={message}
            inProgress={inProgress}
            index={index}
            isCurrentMessage={index === messages.length - 1}
          />;
        }
      })}
    </div>
  );
}

<CopilotKit>
  <CopilotSidebar Messages={CustomMessages} />
</CopilotKit>
