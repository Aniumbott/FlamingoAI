import { IAIModelDocument } from "../models/AIModel";
import { IPageDocument } from "../models/Page";
import { getAIResponse } from "./aiModel";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";
import { socket } from "@/socket";

async function getAllPages(workspaceId: string) {
  try {
    const data = await fetch(`/api/page/?workspaceId=${workspaceId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function getPageById(pageId: string, workspaceId: string) {
  try {
    const data = await fetch(
      `/api/page/?id=${pageId}&workspaceId=${workspaceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const response = await data.json();
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function createPage(workspaceId: string, createdBy: string) {
  const notificationId = showLoadingNotification("Creating Page...");
  try {
    const data = await fetch("/api/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceId,
        createdBy,
      }),
    });
    const response = await data.json();
    showSuccessNotification(notificationId, "Page Created Successfully");
    socket.emit("createPage", workspaceId, response.page);
    return response;
  } catch (error) {
    console.log(error);
    showErrorNotification(notificationId, "Error Creating Page");
    return error;
  }
}

async function updatePage(id: string, body: any) {
  const notificationId = showLoadingNotification("Saving changes...");
  try {
    const data = await fetch(`/api/page`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...body }),
    });
    const response = await data.json();
    showSuccessNotification(notificationId, "Changes saved Successfully");
    return response;
  } catch (error) {
    console.log(error);
    showErrorNotification(notificationId, "Error saving changes");
    return error;
  }
}

async function deletePage(page: IPageDocument) {
  const notificationId = showLoadingNotification("Deleting Page...");
  try {
    const data = await fetch(`/api/page`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: page._id }),
    });
    const response = await data.json();
    showSuccessNotification(notificationId, "Page Deleted Successfully");
    socket.emit("deletePage", page.workspaceId, page);
    return response;
  } catch (error) {
    console.log(error);
    showErrorNotification(notificationId, "Error Deleting Page");
    return error;
  }
}

async function getFormattedResponse(
  action: string,
  workspaceId: string,
  aiModel: IAIModelDocument,
  content: string,
  userId: string,
) {
  let notification = showLoadingNotification("Formatting Content...");
  if (!aiModel) {
    showErrorNotification(notification, "Assistant not found");
    return;
  }
  if (!content || content.length == 0) {
    showErrorNotification(notification, "Content not found");
    return;
  }
  let pageContent = [
    {
      role: "system",
      content:
        "You are an AI that will be used to format the provided content, The first line of the prompt will be the action that will be performed on the content, And the content will be provided in the next line onwards. The content should be formatted according to the provided action and response should include the formatted content only, If the provided action is invalid or not possible then just send 'Invalid' in the response.",
    },
    {
      role: "user",
      content: `${action} \n ${content}`,
    },
  ];

  let response;
  try {
    await getAIResponse(
      pageContent,
      workspaceId,
      aiModel,
      "public",
      userId,
    ).then((res: any) => {
      console.log("res at getFormattedResponse", res);
      response = res.gptRes.choices[0].message.content;
    });
  } catch (error) {
    console.log(error);
    showErrorNotification(notification, "Error Formatting Content");
    return error;
  }
  if (response === "Invalid") {
    showErrorNotification(notification, "Invalid Action");
    return;
  }
  showSuccessNotification(notification, "Content Formatted Successfully");
  return response;
  // .then((res: any) => {
  //   if (res) {
  //     createTokenLog(
  //       message.createdBy,
  //       message.chatId,
  //       workspaceId,
  //       res.gptRes.usage.prompt_tokens.toString(),
  //       res.gptRes.usage.completion_tokens.toString()
  //     );
  //   }
  // });
}

export {
  getAllPages,
  getPageById,
  createPage,
  updatePage,
  deletePage,
  getFormattedResponse,
};
