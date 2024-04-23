//  Modules
import { notifications } from "@mantine/notifications";
import { createElement } from "react";
import { IconX } from "@tabler/icons-react";

// Function to collec the assistant response
async function getAssistantResponse(
  messages: any[],
  workspaceId: string,
  assistant: any
) {
  const data = await fetch("/api/assistant", {
    method: "POST",
    body: JSON.stringify({
      messages,
      workspaceId,
      assistant,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (data.status !== 200) {
    notifications.show({
      icon: createElement(IconX),
      color: "red",
      title: "Missing or invalid API key.",
      message: "Kindly update in workspace settings.",
      withCloseButton: true,
      withBorder: true,
      loading: false,
    });
    return null;
  }
  const response = await data.json();
  return response;
}

// Function to get all available assistants
async function getAssistants() {
  const data = await fetch(`/api/assistant`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  return response;
}

export { getAssistantResponse, getAssistants };
