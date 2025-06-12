import { CopilotKit } from "@copilotkit/react-core";
import {
  CopilotSidebar,
  CopilotChatSuggestion,
  RenderSuggestion,
  RenderSuggestionsListProps,
  UserMessageProps,
} from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Key } from "react";

const CustomSuggestionsList = (props: UserMessageProps) => {
  const wrapperStyles = "flex items-center gap-2 justify-end mb-4";
  const messageStyles = "bg-blue-500 text-white py-2 px-4 rounded-xl break-words flex-shrink-0 max-w-[80%]";
  const avatarStyles = "bg-blue-500 shadow-sm min-h-10 min-w-10 rounded-full text-white flex items-center justify-center";

  return (
    <div className="suggestions flex flex-col gap-2 p-4">
      <h1>Try asking:</h1>
      <div className="flex gap-2">
        {suggestions.map((suggestion: CopilotChatSuggestion, index: Key | null | undefined) => (
          <RenderSuggestion
            key={index}
            title={suggestion.title}
            message={suggestion.message}
            partial={suggestion.partial}
            className="rounded-md border border-gray-500 bg-white px-2 py-1 shadow-md"
            onClick={() => onSuggestionClick(suggestion.message)}
          />
        ))}
      </div>
    </div>
  );
};

<CopilotKit>
  <CopilotSidebar RenderSuggestionsList={CustomSuggestionsList} />
</CopilotKit>
