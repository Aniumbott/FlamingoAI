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
      action: "apiCall",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // console.log(messages);

  // console.log("data at getAssistantResponse", data);

  const response = await data.json();
  return response;
}

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
