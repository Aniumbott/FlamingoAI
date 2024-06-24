import {
  Paper,
  Table,
  Tooltip,
  Group,
  Title,
  Text,
  Avatar,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export default function LongestChats(props: {
  filteredChats: any[];
  tokenLogs: any[];
  assistants: any[];
  members: any[];
}) {
  const { filteredChats, tokenLogs, assistants, members } = props;

  function getContexWIndow(assistantId: string, model: string) {
    const assistant: any = assistants.find(
      (assistant: any) => assistant._id === assistantId
    );
    if (assistant) {
      const mdl = assistant.models.find((m: any) => m.value === model);
      return mdl?.contextWindow;
    }
    return 0;
  }

  function getRatio(chat: any) {
    const ratio =
      ((chat.messages.reduce((sum: number, message: any) => {
        return sum + Number(message.content);
      }, 0) +
        chat.instructions.text.length) /
        getContexWIndow(chat.assistant.assistantId, chat.assistant.model)) *
      100;

    return (
      <Text size="sm" c={ratio > 100 ? "red" : ""}>
        {ratio.toFixed(2)}%
      </Text>
    );
  }

  function getParticipants(chat: any) {
    const participants = members.filter((member: any) => {
      return chat.participants.includes(member.userId);
    });

    console.log(participants);
    return (
      <Avatar.Group>
        {participants.length <= 2 ? (
          participants.map((member, key) =>
            member.hasImage ? (
              <Avatar radius="sm" key={key} size="sm" src={member.imageUrl} />
            ) : (
              <Avatar radius="sm" key={key} size="sm" variant="white">
                {member.firstName[0] + member.lastName[0]}
              </Avatar>
            )
          )
        ) : (
          <>
            {participants[participants.length - 1].hasImage ? (
              <Avatar
                radius="sm"
                size="sm"
                src={participants[participants.length - 1].imageUrl}
              />
            ) : (
              <Avatar radius="sm" size="sm" variant="white">
                {participants[participants.length - 1].firstName[0] +
                  participants[participants.length - 1].lastName[0]}
              </Avatar>
            )}

            {participants[participants.length - 2].hasImage ? (
              <Avatar
                radius="sm"
                size="sm"
                src={participants[participants.length - 2].imageUrl}
              />
            ) : (
              <Avatar radius="sm" size="sm" variant="white">
                {participants[participants.length - 2].firstName[0] +
                  participants[participants.length - 2].lastName[0]}
              </Avatar>
            )}
            <Avatar radius="sm" size="sm" variant="white">
              +{participants.length - 2}
            </Avatar>
          </>
        )}
      </Avatar.Group>
    );
  }
  return (
    <Paper
      withBorder
      mt="1rem"
      h="auto"
      w="100%"
      p="2rem"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between",
      }}
    >
      <Title order={3}>The longest chats in your workspace</Title>
      <Text mt="1rem" size="sm">
        See the longest chats in your workspace — each new message in a long
        chat uses an increasing amount of tokens. To optimise usage costs and
        maintain AI focus, consider splitting longer chats into smaller ones or
        starting fresh.
      </Text>
      <Table mt="1rem" verticalSpacing={20}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Chat Name</Table.Th>
            <Table.Th>
              <Group justify="start">
                Tockens
                <Tooltip
                  withArrow
                  multiline
                  w={400}
                  label="The total number of tokens utilised in the chat; the chat length, in tokens."
                  fz="xs"
                >
                  <IconInfoCircle size="14px" />
                </Tooltip>
              </Group>
            </Table.Th>
            <Table.Th>
              <Group justify="start">
                Model
                <Tooltip
                  withArrow
                  multiline
                  w={400}
                  label="The GPT model the chat is using. If chats started with one model, but then switched, the latest model is shown here."
                  fz="xs"
                >
                  <IconInfoCircle size="14px" />
                </Tooltip>
              </Group>
            </Table.Th>
            <Table.Th>
              <Group justify="start">
                Context <br /> Window
                <Tooltip
                  withArrow
                  multiline
                  w={400}
                  label="The number of tokens the model can maintain as context when processing a request. When the conversation exceeds the context window, older messages are dropped from the context."
                  fz="xs"
                >
                  <IconInfoCircle size="14px" />
                </Tooltip>
              </Group>
            </Table.Th>
            <Table.Th>
              <Group justify="start">
                Ratio
                <Tooltip
                  withArrow
                  multiline
                  w={400}
                  label="The proportion of the model's total context window that is currently being utilized by the chat. Values over 100% indicate that earliest information is dropped from the context."
                  fz="xs"
                >
                  <IconInfoCircle size="14px" />
                </Tooltip>
              </Group>
            </Table.Th>
            <Table.Th>Messages</Table.Th>
            <Table.Th>Participants</Table.Th>
            <Table.Th>Date created</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredChats.map((chat: any) => {
            return (
              <Table.Tr key={chat._id}>
                <Table.Td maw={200}>
                  <Text size="sm" truncate={true}>
                    {chat.name}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {tokenLogs
                    .filter((tokenLog: any) => {
                      return tokenLog.chatId === chat._id;
                    })
                    .reduce((sum: number, tokenLog: any) => {
                      return sum + tokenLog.inputTokens + tokenLog.outputTokens;
                    }, 0)}
                </Table.Td>
                <Table.Td>{chat.assistant.model}</Table.Td>
                <Table.Td>
                  {getContexWIndow(
                    chat.assistant.assistantId,
                    chat.assistant.model
                  )}
                </Table.Td>
                <Table.Td>{getRatio(chat)}</Table.Td>
                <Table.Td>{chat.messages.length}</Table.Td>
                <Table.Td>{getParticipants(chat)}</Table.Td>
                <Table.Td>
                  {new Date(chat.createdAt).toLocaleDateString()}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
