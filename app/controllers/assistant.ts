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
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(messages);

  console.log("data at getAssistantResponse", data);

  const response = await data.json();
  return response;
}

export { getAssistantResponse };
