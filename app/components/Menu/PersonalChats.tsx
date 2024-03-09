import React, { useState, ReactNode } from "react";
import { Paper, Text, Collapse, Button, Stack } from "@mantine/core";

interface ChatProps {
  name: string;
}

const Chat: React.FC<ChatProps> = ({ name }) => (
  <Paper p={"md"} style={{ marginBottom: "10px" }}>
    <Text>{name}</Text>
  </Paper>
);

interface FolderProps {
  name: string;
  children: ReactNode;
}

const Folder: React.FC<FolderProps> = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack style={{ marginBottom: "10px" }}>
      <Button onClick={() => setIsOpen(!isOpen)}>{name}</Button>
      <Collapse in={isOpen}>{children}</Collapse>
    </Stack>
  );
};

const PersonalChats: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack>
      <Button onClick={() => setIsOpen(!isOpen)}>Personal Chats</Button>
      <Collapse in={isOpen}>
        <Folder name="Folder 1">
          <Chat name="Chat 1" />
          <Chat name="Chat 2" />
          <Folder name="Folder 1">
            <Chat name="Chat 1" />
            <Chat name="Chat 2" />
          </Folder>
        </Folder>
        <Folder name="Folder 2">
          <Chat name="Chat 3" />
          <Chat name="Chat 4" />
        </Folder>
        <Chat name="Chat 5" />
      </Collapse>
    </Stack>
  );
};

export default PersonalChats;
