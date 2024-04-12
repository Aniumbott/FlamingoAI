import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createElement } from "react";

function showLoadingNotification(message: string) {
  const notificationId = notifications.show({
    loading: true,
    message: message,
    autoClose: false,
    withCloseButton: true,
    color: "teal",
    withBorder: true,
    styles: { description: { fontWeight: "bold" } },
  });
  return notificationId;
}

function showSuccessNotification(notificationId: string, message: string) {
  notifications.update({
    id: notificationId,
    icon: createElement(IconCheck),
    color: "teal",
    message: message,
    autoClose: 2000,
    withCloseButton: true,
    withBorder: true,
    loading: false,
    styles: { description: { fontWeight: "bold" } },
  });
}

function showErrorNotification(notificationId: string, message: string) {
  notifications.update({
    id: notificationId,
    icon: createElement(IconX),
    color: "red",
    message: message,
    autoClose: 5000,
    withCloseButton: true,
    withBorder: true,
    loading: false,
    styles: { description: { fontWeight: "bold" } },
  });
}


export { showLoadingNotification, showSuccessNotification, showErrorNotification};