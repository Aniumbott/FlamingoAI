import { createPrompt } from "@/app/controllers/prompt";
import { IPromptDocument } from "@/app/models/Prompt";
import { useAuth } from "@clerk/nextjs";
import {
  Alert,
  Button,
  FocusTrap,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import * as Mongoose from "mongoose";
import React, { useState } from "react";

const PromptModal = (props: {
  opened: boolean;
  setOpened: (value: boolean) => void;
  scope: "public" | "private" | "";
  parentFolder: Mongoose.Types.ObjectId | null;
  modalItem: IPromptDocument | null;
  setModalItem: (value: IPromptDocument | null) => void;
}) => {
  const { opened, setOpened, modalItem, setModalItem, scope, parentFolder } =
    props;
  const [name, setName] = useState(modalItem ? modalItem.name : "");
  const [description, setDescription] = useState(
    modalItem ? modalItem.description : ""
  );
  const [content, setContent] = useState(modalItem ? modalItem.content : "");

  const [initialName, setInitialName] = useState(name);
  const [initialDescription, setInitialDescription] = useState(description);
  const [initialContent, setInitialContent] = useState(content);

  const [showInstructions, setShowInstructions] = useState(false);
  const hasChanged =
    name !== initialName ||
    description !== initialDescription ||
    content !== initialContent;

  const { orgId, userId } = useAuth();

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setOpened(false);
        setModalItem(null);
        setName("");
        setDescription("");
        setContent("");
      }}
      padding={0}
      size={"80%"}
      withCloseButton={false}
    >
      <FocusTrap.InitialFocus />
      <Stack gap={"md"} p={"lg"} align="center">
        <Title order={3}>
          {modalItem ? modalItem.name : "New Prompt Template"}
        </Title>
        <Stack w={"80%"} align="center" gap={"xl"} justify="center">
          <TextInput
            label="Name (Shortcut):"
            withAsterisk
            placeholder="A name for your prompt."
            // error={name.length < 1}
            w={"100%"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            label="Description:"
            placeholder="A description for your prompt."
            w={"100%"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Textarea
            label="Prompt:"
            placeholder="Enter prompt content here. Use {{}} to create a variable. Example: {{name}} is a {{adjective}} {{noun}}"
            w={"100%"}
            // error={content.length < 1}
            withAsterisk
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {modalItem && (
            <Alert variant="default" c={"teal"} icon={<IconInfoCircle />}>
              {`To use this prompt in chat, type "/${name}"`}
            </Alert>
          )}
          {modalItem === null ? (
            <Button
              variant="default"
              fw={400}
              fullWidth
              disabled={name.length < 1 || content.length < 1}
              onClick={() => {
                if (scope === "") {
                  return setOpened(false);
                }
                createPrompt(
                  name,
                  content,
                  description,
                  scope,
                  parentFolder,
                  userId || "",
                  orgId || ""
                ).then((res) => {
                  console.log(res);
                  setOpened(false);
                });
              }}
            >
              Create
            </Button>
          ) : (
            <Button variant="default" fw={400} fullWidth disabled={!hasChanged}>
              Save
            </Button>
            // <Group gap={5} w={"100%"} grow preventGrowOverflow={true}>
            //   <Button
            //     variant="default"
            //     fw={400}
            //     onClick={() => setShowInstructions(!showInstructions)}
            //   >
            //     Use
            //   </Button>
            //  </Group>
          )}
        </Stack>
      </Stack>
    </Modal>
  );
};

export default PromptModal;
