// Modules
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import {
  Accordion,
  AccordionPanel,
  ActionIcon,
  Avatar,
  Group,
  ScrollArea,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconCaretRightFilled } from "@tabler/icons-react";

// Compontets
import ChatItem from "./ChatItem";
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import style from "../RightPanel/RightPanel.module.css";
import PromptMenu from "./Menu/PromptMenu";

const PeopleChats = (props: { members: any[] }) => {
  const { members } = props;
  const [allChats, setAllChats] = useState<IChatDocument[]>([]);

  useEffect(() => {
    const fetchAllChats = async () => {
      setAllChats((await getAllChats()).chats);
    };
    fetchAllChats();
  }, []);

  return (
    <ScrollArea scrollbarSize={3} pb={"10"}>
      {members.length > 0 && (
        <Accordion
          chevronPosition="left"
          className={style.parent}
          classNames={{ chevron: style.chevron }}
          chevron={<IconCaretRightFilled className={style.icon} />}
          variant="default"
        >
          {members.map((user: any) => {
            const filteredChats = allChats.filter((chat) =>
              chat.participants.includes(user.userId)
            );
            return (
              <Accordion.Item
                value={user.userId}
                key={user.userId}
                style={{
                  borderBottom: "2px solid yello",
                }}
              >
                <Accordion.Control className={style.accordionControl}>
                  <AccordianLabel
                    user={user}
                    chatCount={filteredChats.length}
                  />
                </Accordion.Control>
                <AccordionPanel>
                  {filteredChats.map((chat, key) => (
                    <ChatItem item={chat} key={key} members={members} />
                  ))}
                </AccordionPanel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </ScrollArea>
  );
};

const AccordianLabel = (props: { user: any; chatCount: number }) => {
  const { user, chatCount } = props;
  // console.log(user);
  return (
    <Group wrap="nowrap" gap={"xs"} justify="space-between">
      {user.hasImage ? (
        <Avatar size={"25px"} radius={"sm"} src={user.imageUrl} />
      ) : (
        <Avatar>{user.firstName[0]}</Avatar>
      )}
      <Text
        style={{
          flexGrow: 1,
        }}
        ta={"left"}
        size="sm"
        c={"white"}
        fw={500}
      >
        {user.firstName} {user.lastName}
      </Text>
      <Group wrap="nowrap" grow gap={2} align="center">
        <ActionIcon
          size="sm"
          variant="subtle"
          aria-label="Sort"
          color="#9CA3AF"
          style={{
            "--ai-hover-color": "white",
          }}
          onClick={(event) => {
            event.stopPropagation();
            // Add any additional logic for the ActionIcon click here
          }}
        >
          <PromptMenu />
        </ActionIcon>
        <ThemeIcon size="sm" color="gray" variant="filled" radius="sm">
          <Text size="xs">{chatCount}</Text>
        </ThemeIcon>
      </Group>
    </Group>
  );
};
export default PeopleChats;
