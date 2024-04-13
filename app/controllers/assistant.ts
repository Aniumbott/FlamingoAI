async function getAssistantResponse(
  messages: any[],
  workspaceId: string,
  model: string
) {
  const data = await fetch("/api/assistant", {
    method: "POST",
    body: JSON.stringify({
      messages,
      workspaceId,
      model,
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

async function createAssistant(name: string, models: any[]) {
  console.log("name", name, "models", models);
  const data = await fetch("/api/assistant", {
    method: "POST",
    body: JSON.stringify({
      name,
      models,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();

  console.log("response at addAssistant", response);

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

export { getAssistantResponse, createAssistant, getAssistants };
