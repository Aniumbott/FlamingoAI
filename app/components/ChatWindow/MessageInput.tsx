import { createMessage, sendAssistantMessage } from "@/app/controllers/message";
import {
  Box,
  Textarea,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconRefresh, IconSend } from "@tabler/icons-react";
import { useState } from "react";

export default function MessageInput(props: {
  userId: string;
  currentChatId: string;
  chat: any;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  setSearchTerm: (searchTerm: string) => void;
  combobox: any;
}) {
  const {
    userId,
    currentChatId,
    chat,
    processing,
    setProcessing,
    setSearchTerm,
    combobox,
  } = props;
  const { colorScheme } = useMantineColorScheme();
  const [messageInput, setMessageInput] = useState("");
  const isMobile = useMediaQuery(`(max-width: 48em)`);

  function tillLastUserMessage(messages: any[]) {
    let lastUserMessageIndex = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === "user") {
        lastUserMessageIndex = i;
        break;
      }
    }
    return messages.slice(0, lastUserMessageIndex + 1);
  }

  return (
    <Box
      className="w-full h-fit flex justify-center items-center"
      style={{
        background:
          colorScheme == "dark"
            ? "var(--mantine-color-dark-8)"
            : "var(--mantine-color-gray-1)",
      }}
    >
      {chat?.messages?.length &&
      chat.messages.some((message: any) => message.type === "user") ? (
        <Tooltip label="Regenerate" fz="xs">
          <ActionIcon
            {...(isMobile ? { size: 42 } : { size: 50 })}
            style={{
              borderRadius:
                "var(--mantine-radius-sm) 0 0 var(--mantine-radius-sm)",
            }}
            disabled={processing}
            onClick={() => {
              setProcessing(true);
              let contexWindow = tillLastUserMessage(chat.messages);
              sendAssistantMessage(
                contexWindow.slice(0, -1),
                contexWindow[contexWindow.length - 1],
                chat.instructions,
                chat.workspaceId,
                {
                  ...chat.assistant,
                  scope: chat.scope == "private" ? "private" : "public",
                }
              );
            }}
          >
            <IconRefresh size={isMobile ? "15px" : "20px"} />
          </ActionIcon>
        </Tooltip>
      ) : null}

      <Textarea
        autosize={true}
        maxRows={4}
        radius={
          chat?.messages?.length &&
          chat.messages.some((message: any) => message.type === "user")
            ? "0"
            : "var(--mantine-radius-sm) 0 0 var(--mantine-radius-sm)"
        }
        w="66%"
        autoFocus={true}
        value={messageInput}
        disabled={processing}
        my="xl"
        onChange={(e) => {
          setMessageInput(e.currentTarget.value);

          if (e.currentTarget.value.endsWith("/")) {
            setSearchTerm(e.currentTarget.value.split("/").pop() ?? "");
            combobox.openDropdown();
          } else {
            combobox.closeDropdown();
          }
        }}
        onKeyDown={(e: any) => {
          if (
            messageInput != "" &&
            e.key === "Enter" &&
            !e.shiftKey &&
            !messageInput.includes("/")
          ) {
            setProcessing(true);
            createMessage(
              userId || "",
              messageInput,
              "user",
              currentChatId
            ).then((res) => {
              sendAssistantMessage(
                chat.messages,
                res.message,
                chat.instructions,
                chat.workspaceId,
                {
                  ...chat.assistant,
                  scope: chat.scope == "private" ? "private" : "public",
                }
              );
              setMessageInput("");
            });
          }
        }}
        {...(isMobile
          ? {
              placeholder: "Type '/' to select a prompt",
              size: "md",
              hiddenFrom: "sm",
            }
          : {
              placeholder: "Type a message or type '/' to select a prompt",
              size: "lg",
              miw: "300px",
              maw: "1100px",
              visibleFrom: "sm",
            })}
      />
      <Tooltip label="Send message" fz="xs">
        <ActionIcon
          {...(isMobile ? { size: 42 } : { size: 50 })}
          radius="0"
          disabled={processing}
          style={{
            borderRadius:
              "0 var(--mantine-radius-sm) var(--mantine-radius-sm) 0",
          }}
          onClick={() => {
            if (messageInput != "") {
              setProcessing(true);
              console.log("chat assistant", chat.assistant);
              createMessage(
                userId || "",
                messageInput,
                "user",
                currentChatId
              ).then((res) => {
                sendAssistantMessage(
                  chat.messages,
                  res.message,
                  chat.instructions,
                  chat.workspaceId,
                  {
                    ...chat.assistant,
                    scope: chat.scope == "private" ? "private" : "public",
                  }
                );
                setMessageInput("");
              });
            }
          }}
        >
          <IconSend size={isMobile ? "15" : "24"} />
        </ActionIcon>
      </Tooltip>
    </Box>
  );
}
