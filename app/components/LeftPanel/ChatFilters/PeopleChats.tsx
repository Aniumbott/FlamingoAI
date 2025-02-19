// Modules
import { useEffect, useState } from "react";
import { useAuth, useOrganization } from "@clerk/nextjs";
import {
  Accordion,
  AccordionPanel,
  ActionIcon,
  Avatar,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Loader,
} from "@mantine/core";
import { IconCaretRightFilled, IconSearch } from "@tabler/icons-react";

// Compontets
import ChatItem from "../Items/ChatItem";
import { getAllChats } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import style from "../LeftPanel.module.css";
import SortMenu from "../Menu/SortMenu";
import { socket } from "@/socket";
import { sortItems } from "@/app/controllers/chat";

const PeopleChats = (props: {
  toggleLeft: () => void;
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { members, allowPersonal, allowPublic } = props;
  const [allChats, setAllChats] = useState<IChatDocument[]>([]);
  const { userId, orgId } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredMembers = members.filter((member) => {
    return (
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    const fetchAllChats = async () => {
      const chats = (await getAllChats(userId || "", orgId || "")).chats;
      setAllChats(
        chats
        // chats.filter((chat: IChatDocument) => chat.archived === false)
      );
    };
    fetchAllChats();
    socket.on("refreshChats", () => {
      fetchAllChats();
    });

    return () => {
      console.log("unmounting people chats");
      socket.off("refreshChats");
    };
  }, []);

  return (
    <Stack gap={"sm"}>
      <TextInput
        placeholder="Search Members..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ScrollArea mah="calc(100vh - 380px)" scrollbarSize={3} pb={"10"}>
        {filteredMembers.length > 0 ? (
          <Accordion
            chevronPosition="left"
            className={style.parent}
            classNames={{ chevron: style.chevron }}
            chevron={<IconCaretRightFilled className={style.icon} />}
            variant="default"
          >
            {/* {allChats.length > 0 ? ( */}
            {filteredMembers.map((user: any) => (
              <UserAccordionItem
                toggleLeft={props.toggleLeft}
                user={user}
                allChats={allChats}
                members={members}
                key={user.userId}
                allowPersonal={allowPersonal}
                allowPublic={allowPublic}
              />
            ))}
            {/* ) : (
              <Text style={{ textAlign: "center" }} c="dimmed" size="xs">
                No people chats
              </Text>
            )} */}
          </Accordion>
        ) : (
          <Loader type="dots" w={"100%"} />
        )}
      </ScrollArea>
    </Stack>
  );
};

const UserAccordionItem = (props: {
  toggleLeft: () => void;
  user: any;
  allChats: IChatDocument[];
  members: any[];
  allowPublic: boolean;
  allowPersonal: boolean;
}) => {
  const { toggleLeft, user, allChats, members } = props;
  const [sort, setSort] = useState<string>("New");

  const [sortedChats, setSortedChats] = useState<IChatDocument[]>([]);

  useEffect(() => {
    const filteredChats = allChats?.filter((chat) =>
      chat.participants.includes(user.userId)
    );
    setSortedChats(filteredChats);
  }, [allChats, user]);

  useEffect(() => {
    if (sortedChats.length) setSortedChats(sortItems(sortedChats, sort));
  }, [sort]);

  return (
    <Accordion.Item value={user.userId} key={user.userId}>
      <Accordion.Control className={style.accordionControl}>
        <AccordianLabel
          user={user}
          chatCount={sortedChats.length}
          sort={sort}
          setSort={setSort}
        />
      </Accordion.Control>
      <AccordionPanel>
        {sortedChats.map((chat: IChatDocument, key: any) => (
          <ChatItem
            toggleLeft={toggleLeft}
            item={chat}
            key={key}
            members={members}
            allowPersonal={props.allowPersonal}
            allowPublic={props.allowPublic}
          />
        ))}
      </AccordionPanel>
    </Accordion.Item>
  );
};

const AccordianLabel = (props: {
  user: any;
  chatCount: number;
  sort: string;
  setSort: (value: string) => void;
}) => {
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
          <SortMenu sort={props.sort} setSort={props.setSort} />
        </ActionIcon>
        <ThemeIcon size="sm" color="grey" variant="filled" radius="sm">
          <Text size="xs">{chatCount}</Text>
        </ThemeIcon>
      </Group>
    </Group>
  );
};
export default PeopleChats;
