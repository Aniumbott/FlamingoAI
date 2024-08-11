import { socket } from "@/socket";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";

// Function to get the current workspace
async function getWorkspace(id: String) {
  console.log("collecting current workspace");
  const data = await fetch(`/api/workspace/?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  return response;
}

// Function to update the workspace
async function updateWorkspace(body: any, showNotification: boolean = true) {
  let notification : any;
  
  if (showNotification) {
    notification = showLoadingNotification("Updating workspace");
  }
  const data = await fetch("/api/workspace", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (data.status !== 200 && showNotification) {
    showErrorNotification(notification, "Failed to update workspace");
  } else if (showNotification) {
    showSuccessNotification(notification, "Workspace updated successfully");
  }

  const response = await data.json();
  socket.emit("updateWorkspace", body._id);
  console.log("response at updateWorkspace", response);

  return response;
}

export { getWorkspace, updateWorkspace };
