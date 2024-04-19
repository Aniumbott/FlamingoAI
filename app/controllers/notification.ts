import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createElement } from "react";

// Show loading notification
function showLoadingNotification(message: string) {
  const notificationId = notifications.show({
    loading: true,
    message: message,
    autoClose: false,
    withCloseButton: true,
    withBorder: true,
    styles: { description: { fontWeight: "bold" } },
  });
  return notificationId;
}

// Update to success notification
function showSuccessNotification(notificationId: string, message: string) {
  notifications.update({
    id: notificationId,
    icon: createElement(IconCheck),
    message: message,
    autoClose: 2000,
    withCloseButton: true,
    withBorder: true,
    loading: false,
    styles: { description: { fontWeight: "bold" } },
  });
}

// Update to error notification
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

export {
  showLoadingNotification,
  showSuccessNotification,
  showErrorNotification,
};
