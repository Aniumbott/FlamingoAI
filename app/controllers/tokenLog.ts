async function getWrokSpaceTokens(workspaceId: string) {
  try {
    const data = await fetch(`/api/tokenLog/?workspaceId=${workspaceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function createTokenLog(
  createdBy: string,
  chatId: string,
  workspaceId: string,
  inputTokens: string,
  outputTokens: string
) {
  try {
    const data = await fetch(`/api/tokenLog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdBy,
        chatId,
        workspaceId,
        inputTokens,
        outputTokens,
      }),
    });
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export { getWrokSpaceTokens, createTokenLog };
