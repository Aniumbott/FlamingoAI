import React, { useState } from "react";
import {
  Card,
  Avatar,
  ActionIcon,
  CloseButton,
  Text,
  Divider,
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
} from "@tabler/icons-react";
import style from "./RightPanel.module.css";
import UserAvatar from "./UserAvatar";

export default function RightPanel(props: {
  rightOpened: boolean;
  toggleRight: () => void;
}) {
  const { rightOpened, toggleRight } = props;
  const [active, setActive] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const buttonStyle = (ind: Number) => {
    return {
      width: "100%",
      height: "3rem",
      padding: "0.5rem",
      borderLeft: active == ind ? "3px solid #f0f0f0" : "",
    };
  };
  return (
    <>
      {/* RightPanel Navigation */}
      <Card
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
        }}
      >
        <div>
          <UserAvatar />
        </div>
        <div style={{ marginTop: "-25rem" }}>
          <ActionIcon
            style={buttonStyle(0)}
            variant="subtle"
            aria-label="Settings"
            radius={0}
            color="white"
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
            variant="subtle"
            aria-label="Settings"
            radius={0}
            color="white"
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
            variant="subtle"
            aria-label="Settings"
            radius={0}
            color="white"
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
            variant="subtle"
            aria-label="Settings"
            radius={0}
            color="white"
            onClick={() => {
              !rightOpened ? toggleRight() : "";
              setActive(3);
            }}
          >
            <IconHelp style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </div>
        <div>
          {darkMode ? (
            <ActionIcon
              style={buttonStyle(999)}
              variant="subtle"
              aria-label="Settings"
              radius={0}
              color="white"
              onClick={() => setDarkMode(!darkMode)}
            >
              <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
            </ActionIcon>
          ) : (
            <ActionIcon
              style={buttonStyle(999)}
              variant="subtle"
              aria-label="Settings"
              radius={0}
              color="white"
              onClick={() => setDarkMode(!darkMode)}
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
              color="white"
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
              color="white"
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
      </Card>
      {/* Ralaven Content */}
      {active == 0 ? savedPrompts(toggleRight) : <></>}
      {active == 1 ? reports(toggleRight) : <></>}
      {active == 2 ? comments(toggleRight) : <></>}
      {active == 3 ? help(toggleRight) : <></>}
    </>
  );
}

const savedPrompts = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>SAVED PROMPTS</Text>
        <CloseButton onClick={toggleRight} />
      </div>
      <Divider my="md" />
    </>
  );
};

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
