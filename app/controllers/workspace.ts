import { socket } from "@/socket";
import {
  showErrorNotification,
  showLoadingNotification,
  showSuccessNotification,
} from "./notification";

async function getWorkspace(id: String) {
  console.log("collecting current workspace");
  const data = await fetch(`/api/workspace/?id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await data.json();
  // console.log("data at getWorkspace", response);
  return response;
}

async function updateWorkspace(body: any) {
  const notification = showLoadingNotification("Updating Workspace");
  const data = await fetch("/api/workspace", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (data.status !== 200) {
    showErrorNotification(notification, "Failed to update workspace");
  } else {
    showSuccessNotification(notification, "Workspace updated successfully");
  }

  const response = await data.json();
  socket.emit("updateWorkspace", body._id);
  console.log("response at updateWorkspace", response);

  return response;
}

export { getWorkspace, updateWorkspace };
