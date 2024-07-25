import { socket } from "@/socket";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";

async function generateImage(
  createdBy: string,
  prompt: string,
  resolution: string,
  isHD: boolean,
  workspaceId: string,
  modelName: string
) {
  const notificationId = showLoadingNotification("Generating image...");
  try {
    const data = await fetch("/api/imageGen/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdBy,
        prompt,
        resolution,
        isHD,
        workspaceId,
        modelName,
      }),
    });

    const response = await data.json();
    showSuccessNotification(notificationId, "Image Generated");
    socket.emit("createImageGen", workspaceId, response.imageGen._id);
    return response;
  } catch (err) {
    console.error(err);
    showErrorNotification(notificationId, "Failed to generate image");
    return err;
  }
}

async function getImageGen(imageGenId: string) {
  try {
    const data = await fetch(`/api/imageGen/?id=${imageGenId}`);
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function getImageGens(workspaceId: string) {
  try {
    const data = await fetch(
      `/api/imageGen/?workspaceId=${workspaceId}&action=all`
    );
    const response = await data.json();
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

async function deleteImageGen(imageGenId: string, workspaceId: string) {
  const notificationId = showLoadingNotification("Deleting image...");
  try {
    const data = await fetch("/api/imageGen", {
      method: "DELETE",
      body: JSON.stringify({ id: imageGenId, workspaceId: workspaceId }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    showSuccessNotification(notificationId, "Image Deleted");
    socket.emit("deleteImageGen", workspaceId, imageGenId);
    return response;
  } catch (err) {
    console.error(err);
    showErrorNotification(notificationId, "Failed to delete image");
    return err;
  }
}

export { generateImage, getImageGen, getImageGens, deleteImageGen };
