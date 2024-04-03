async function getAssistantResponse(
  messages: any[],
  scope: string,
  workspaceId: string,
  model: string
) {
  const data = await fetch(
    `/api/assistant/?messages=${JSON.stringify(
      messages
    )}&scope=${scope}&workspaceId=${workspaceId}&model=${model}`,
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
