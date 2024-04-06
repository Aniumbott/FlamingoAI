// Modules
import { useState } from "react";
import {
  ActionIcon,
  CloseButton,
  Text,
  Divider,
  Input,
  Accordion,
  ScrollArea,
  useMantineColorScheme,
  Paper,
  Avatar,
  Container,
  Box,
} from "@mantine/core";
import {
  IconCategory,
  IconTrendingUp,
  IconMessages,
  IconHelp,
  IconSun,
  IconMoon,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconSearch,
  IconCaretRightFilled,
} from "@tabler/icons-react";

// Components
import style from "./RightPanel.module.css";
import UserAvatar from "./UserAvatar";
import LibraryAccordianItem from "./LibraryAccordianItem";
import { UserButton } from "@clerk/nextjs";

export default function RightPanel(props: {
  rightOpened: boolean;
  toggleRight: () => void;
}) {
  const { rightOpened, toggleRight } = props;
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [active, setActive] = useState(0);
  const buttonStyle = (ind: Number) => {
    return {
      width: "100%",
      height: "3rem",
      padding: "0.5rem",
      borderLeft: active == ind ? "3px solid var(--mantine-color-teal-5)" : "",
    };
  };

  return (
    <>
      {/* RightPanel Navigation */}
      <Paper
        style={{
          height: "100%",
          width: "3rem",
          position: "absolute",
          top: 0,
          left: "-3rem",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          borderLeft: "1px solid var(--app-shell-border-color)",
        }}
      >
        <div>
          <div className="w-full flex justify-center items-center mt-3">
            <UserButton />
          </div>
          <div style={{ marginTop: "8rem" }}>
            <ActionIcon
              style={buttonStyle(0)}
              variant={active == 0 ? "light" : "subtle"}
              aria-label="Settings"
              radius={0}
              color={active == 0 ? "teal" : "light"}
              onClick={() => {
                !rightOpened ? toggleRight() : "";
                setActive(0);
              }}
            >
              <IconCategory
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>

            <ActionIcon
              style={buttonStyle(1)}
              variant={active == 1 ? "light" : "subtle"}
              aria-label="Settings"
              radius={0}
              color={active == 1 ? "teal" : "light"}
              onClick={() => {
                !rightOpened ? toggleRight() : "";
                setActive(1);
              }}
            >
              <IconTrendingUp
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>

            <ActionIcon
              style={buttonStyle(2)}
              variant={active == 2 ? "light" : "subtle"}
              aria-label="Settings"
              radius={0}
              color={active == 2 ? "teal" : "light"}
              onClick={() => {
                !rightOpened ? toggleRight() : "";
                setActive(2);
              }}
            >
              <IconMessages
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>

            <ActionIcon
              style={buttonStyle(3)}
              variant={active == 3 ? "light" : "subtle"}
              aria-label="Settings"
              radius={0}
              color={active == 3 ? "teal" : "light"}
              onClick={() => {
                !rightOpened ? toggleRight() : "";
                setActive(3);
              }}
            >
              <IconHelp style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          </div>
        </div>
        <div>
          {colorScheme == "dark" ? (
            <ActionIcon
              style={buttonStyle(999)}
              variant="subtle"
              aria-label="Settings"
              radius={0}
              color="light"
              onClick={() => setColorScheme("light")}
            >
              <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          ) : (
            <ActionIcon
              style={buttonStyle(999)}
              variant="subtle"
              aria-label="Settings"
              radius={0}
              color="light"
              onClick={() => setColorScheme("dark")}
            >
              <IconMoon style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          )}
          {rightOpened ? (
            <ActionIcon
              style={buttonStyle(999)}
              variant="subtle"
              aria-label="Settings"
              radius={0}
              color="light"
              onClick={() => {
                toggleRight();
                rightOpened ? setActive(-1) : "";
              }}
            >
              <IconLayoutSidebarLeftExpand
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          ) : (
            <ActionIcon
              style={buttonStyle(999)}
              variant="subtle"
              aria-label="Settings"
              radius={0}
              color="light"
              onClick={() => {
                toggleRight();
                !rightOpened ? setActive(0) : "";
              }}
            >
              <IconLayoutSidebarRightExpand
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            </ActionIcon>
          )}
        </div>
      </Paper>
      {/* Ralaven Content */}
      {active == 0 ? <SavedPrompts toggleRight={toggleRight} /> : <></>}
      {active == 1 ? reports(toggleRight) : <></>}
      {active == 2 ? comments(toggleRight) : <></>}
      {active == 3 ? help(toggleRight) : <></>}
    </>
  );
}

function SavedPrompts(props: { toggleRight: () => void }) {
  const { toggleRight } = props;
  const [system, setSystem] = useState({
    title: "System Library",
    content: [
      {
        id: "1jkjhhhjkh",
        type: "folder",
        title: "Folder 1",
        content: [
          {
            id: "1u89jij",
            type: "prompt",
            title: "Prompt 1",
            content: "This is the content of prompt 1",
          },
          {
            id: "2jjginou9",
            type: "folder",
            title: "Folder 2",
            content: [
              {
                id: "1jbuiujoij",
                type: "prompt",
                title: "Prompt 2",
                content: "This is the content of prompt 2",
              },
            ],
          },
        ],
      },
      {
        id: "1jkjhhhjkh",
        type: "folder",
        title: "Folder 2",
        content: [
          {
            id: "1u89jij",
            type: "prompt",
            title: "Prompt 1",
            content: "This is the content of prompt 1",
          },
          {
            id: "2jjginou9",
            type: "folder",
            title: "Folder 2",
            content: [
              {
                id: "1jbuiujoij",
                type: "prompt",
                title: "Prompt 2",
                content: "This is the content of prompt 2",
              },
            ],
          },
        ],
      },
    ],
  });
  const [workspace, setWorkspace] = useState({
    title: "Workspace Library",
    content: [
      {
        id: "1jkjhhhjkh",
        type: "folder",
        title: "Folder 1",
        content: [
          {
            id: "1u89jij",
            type: "prompt",
            title: "Prompt 1",
            content: "This is the content of prompt 1",
          },
          {
            id: "2jjginou9",
            type: "folder",
            title: "Folder 2",
            content: [
              {
                id: "1jbuiujoij",
                type: "prompt",
                title: "Prompt 2",
                content: "This is the content of prompt 2",
              },
            ],
          },
        ],
      },
      {
        id: "1jkjhhhjkh",
        type: "folder",
        title: "Folder 2",
        content: [
          {
            id: "1u89jij",
            type: "prompt",
            title: "Prompt 1",
            content: "This is the content of prompt 1",
          },
          {
            id: "2jjginou9",
            type: "folder",
            title: "Folder 2",
            content: [
              {
                id: "1jbuiujoij",
                type: "prompt",
                title: "Prompt 2",
                content: "This is the content of prompt 2",
              },
            ],
          },
        ],
      },
    ],
  });
  const [personal, setPersonal] = useState({
    title: "Personal Library",
    content: [
      {
        id: "1jkjhhhjkh",
        type: "folder",
        title: "Folder 1",
        content: [
          {
            id: "1u89jij",
            type: "chat",
            title: "Prompt 1",
            content: "This is the content of prompt 1",
          },
          {
            id: "2jjginou9",
            type: "folder",
            title: "Folder 2",
            content: [
              {
                id: "1jbuiujoij",
                type: "prompt",
                title: "Prompt 2",
                content: "This is the content of prompt 2",
              },
            ],
          },
        ],
      },
      {
        id: "1jkjhhhjkh",
        type: "folder",
        title: "Folder 2",
        content: [
          {
            id: "1u89jij",
            type: "prompt",
            title: "Prompt 1",
            content: "This is the content of prompt 1",
          },
          {
            id: "2jjginou9",
            type: "folder",
            title: "Folder 2",
            content: [
              {
                id: "1jbuiujoij",
                type: "prompt",
                title: "Prompt 2",
                content: "This is the content of prompt 2",
              },
            ],
          },
        ],
      },
    ],
  });

  return (
    <>
      <div className={style.activeTitle}>
        <Text>SAVED PROMPTS</Text>
        <CloseButton onClick={toggleRight} />
      </div>
      <Divider my="md" />
      <Input
        placeholder="Search Prompts..."
        leftSection={<IconSearch size={16} />}
        style={{ margin: "0 1rem" }}
      />
      <ScrollArea h={"100%"} scrollbarSize={0} style={{ marginTop: "2rem" }}>
        <Accordion
          chevronPosition="left"
          className={style.parent}
          classNames={{ chevron: style.chevron }}
          chevron={<IconCaretRightFilled className={style.icon} />}
        >
          <LibraryAccordianItem item={system} />

          <LibraryAccordianItem item={workspace} />

          <LibraryAccordianItem item={personal} />
        </Accordion>
      </ScrollArea>
    </>
  );
}

const reports = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>REPORTS</Text>
        <CloseButton onClick={toggleRight} />
      </div>
      <Divider my="md" />
    </>
  );
};

const comments = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>COMMENTS</Text>
        <CloseButton onClick={toggleRight} />
      </div>
      <Divider my="md" />
    </>
  );
};

const help = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>HELP</Text>
        <CloseButton onClick={toggleRight} />
      </div>
      <Divider my="md" />
    </>
  );
};
