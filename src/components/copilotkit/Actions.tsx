import { useCopilotAction } from "@copilotkit/react-core";
// ...

const YourMainContent = () => {
  // ...

  useCopilotAction({
    name: "weatherInfo",
    available: "disabled", // Don't allow the agent or UI to call this tool as its only for rendering
    render: ({ status, args }) => {
      return (
        <p className="text-gray-500 mt-2">
          {status !== "complete" && "Calling weather API..."}
          {status === "complete" &&
            `Called the weather API for ${args.location}.`}
        </p>
      );
    },
  });
  // ...
};
