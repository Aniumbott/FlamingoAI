// Modules
import { Avatar, Text, useMantineColorScheme } from "@mantine/core";

function getDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function MessageItem(props: {
  message: {
    createdBy: {
      hasImage: Boolean;
      name: String;
      avatar: string;
    };
    content: String;
    type: String;
    updatedAt: Date;
    createdAt: Date;
  };
}) {
  const { message } = props;
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <div
        className="w-full min-h-36 flex justify-center items-center"
        style={{
          background:
            colorScheme == "dark"
              ? "var(--mantine-color-dark-8)"
              : "var(--mantine-color-gray-0)",
        }}
      >
        <div className="w-2/3 h-full min-w-96 flex flex-row ">
          {message.createdBy.hasImage ? (
            <Avatar
              size="md"
              radius="sm"
              src={message.createdBy.avatar}
              mt={5}
            />
          ) : (
            <Avatar size="md" radius="sm" mt={5}>
              {message.createdBy.name[0]}
            </Avatar>
          )}
          <div className="w-full ml-10 flex flex-col   ">
            <div className="flex flex-row items-center ">
              <Text size="md" fw={700}>
                {message.createdBy.name}
              </Text>
              <Text pl={10} size="xs">
                {getDate(message.updatedAt.toString())}
              </Text>
              {message.createdAt !== message.updatedAt ? (
                <Text pl={10} size="xs">
                  (edited)
                </Text>
              ) : null}
            </div>
            <Text mt={5} size="md">
              {message.content}
            </Text>
          </div>
        </div>
      </div>
    </>
  );
}

export default MessageItem;
