export const getOpenRouterResponse = async (
  api_key: string,
  model: string,
  provided: string,
  message: any
) => {

  let openRouterModel = "";

  switch (provided) {
    case "google":
      if (model === "models/gemini-1.5-pro-latest")
        openRouterModel = "google/gemini-pro-1.5-exp";
      break;
    case "anthropic":
      const modelName = model.substring(0, model.lastIndexOf("-"));
      openRouterModel = `anthropic/${modelName}`;
      break;
    default:
      openRouterModel = `openai/${model}`;
      break;
  }


  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: message,
      }),
    }
  );


  const jsonResponse= await response.json();
  return jsonResponse.choices[0].message.content
};
