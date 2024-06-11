import {
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import TextEditor from "./TextEditor";
import { useEffect, useState } from "react";

export default function PageWindow() {
  const [content, setContent] = useState<any[]>([
    {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Hello, World!",
            },
          ],
        },
      ],
    },
  ]);

  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    console.log(content);
  }, [content]);

  return (
    <Stack
      mt="-1rem"
      p="xl"
      mih="100vh"
      bg={colorScheme == "light" ? "var(--mantine-primary-color-light)" : ""}
    >
      <Card py="0" radius="md" mih="3rem">
        <Group mih="100%">
          <Title order={5}>New Page</Title>
        </Group>
      </Card>
      <Card radius="md" h="90vh">
        <ScrollArea scrollbarSize={0} mah="85vh">
          <Stack gap="md">
            {content.map((item, index) => (
              <TextEditor
                key={index}
                content={content}
                setContent={setContent}
                index={index}
              />
            ))}
          </Stack>
        </ScrollArea>
      </Card>
    </Stack>
  );
}
