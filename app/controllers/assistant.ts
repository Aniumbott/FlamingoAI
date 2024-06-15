//  Modules
import { notifications } from "@mantine/notifications";
import { createElement } from "react";
import { IconX } from "@tabler/icons-react";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";

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

// Test the OpenAI API
async function isValidOpenAIKey(key: string) {
  let isValid = false;
  const notification = showLoadingNotification("Testing API key...");
  await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  }).then((response) => (isValid = response.status === 200));
  if (isValid) {
    showSuccessNotification(notification, "API key is valid.");
  } else {
    showErrorNotification(notification, "API key is invalid.");
  }
  return isValid;
}

export { getAssistantResponse, getAssistants, isValidOpenAIKey };
