async function getAssistantResponse(
  messages: any[],
  workspaceId: string,
  model: string
) {
  const data = await fetch(
    `/api/assistant/?messages=${JSON.stringify(
      messages
    )}&workspaceId=${workspaceId}&model=${model}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const response = await data.json();
  return response;
}

export { getAssistantResponse };
