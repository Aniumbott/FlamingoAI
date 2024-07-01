import { createElement } from "react";
import { IAIModel, IAIModelDocument } from "../models/AIModel";
import { IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";
import { ComboboxItemGroup } from "@mantine/core";

async function getAIResponse(
  message: any[],
  workspaceId: string,
  model: IAIModelDocument,
  scope: string
) {
  const data = await fetch("/api/aimodel", {
    method: "POST",
    body: JSON.stringify({
      messages: message,
      workspaceId: workspaceId,
      model: model,
      scope: scope,
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
  // console.log("response at getAIResponse", response);
  return response;
}

async function getAIModels(workspaceId: string) {
  const data = await fetch(`/api/aimodel?workspaceId=${workspaceId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  // console.log("response at getAIModels", response);
  return response;
}

function constructSelectModels(models: IAIModelDocument[]) {
  let list: ComboboxItemGroup[] = [
    {
      group: "openai",
      items: [],
    },
  ];
  models.forEach((model) => {
    list.find((i) => i.group == model.provider)
      ? list
          .find((i) => i.group == model.provider)
          ?.items.push({ value: model._id, label: model.name })
      : list.push({
          group: model.provider,
          items: [{ value: model._id, label: model.name }],
        });
  });
  return list;
}

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

async function streamTest() {
  try {
    const response = await fetch("/api/chat", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response?.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = "";

    while (true) {
      const { value, done } = (await reader?.read()) || {
        value: null,
        done: true,
      };
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedResponse += chunk;

      // Call the onProgress callback with the accumulated response
      console.log("Accumulated response:", accumulatedResponse);
    }

    return accumulatedResponse;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export {
  getAIResponse,
  getAIModels,
  constructSelectModels,
  isValidOpenAIKey,
  streamTest,
};
