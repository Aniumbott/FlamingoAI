// Modules
import { useEffect, useState } from "react";
import {
  ActionIcon,
  CloseButton,
  Text,
  Divider,
  useMantineColorScheme,
  Paper,
  Tooltip,
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

// Components
import style from "./RightPanel.module.css";
import { Protect, UserButton } from "@clerk/nextjs";
import PromptsPanel from "./Panels/PromptsPanel/PromptsPanel";
import CommentsPanel from "./Panels/CommentsPanel";
import ReportsPanel from "./Panels/ReportsPanel";

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
      borderLeft:
        active == ind ? "3px solid var(--mantine-primary-color-filled)" : "",
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
            <Tooltip label="Prompts" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(0)}
                variant={active == 0 ? "light" : "subtle"}
                aria-label="Categories"
                radius={0}
                color={active == 0 ? "" : "light"}
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
            </Tooltip>

            <Protect role="org:admin">
              <Tooltip label="Reports" position="left" fz="xs">
                <ActionIcon
                  style={buttonStyle(1)}
                  variant={active == 1 ? "light" : "subtle"}
                  aria-label="Trending Up"
                  radius={0}
                  color={active == 1 ? "" : "light"}
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
              </Tooltip>
            </Protect>

            <Tooltip label="Comments" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(2)}
                variant={active == 2 ? "light" : "subtle"}
                aria-label="Messages"
                radius={0}
                color={active == 2 ? "" : "light"}
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
            </Tooltip>

            <Tooltip label="Help" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(3)}
                variant={active == 3 ? "light" : "subtle"}
                aria-label="Help"
                radius={0}
                color={active == 3 ? "" : "light"}
                onClick={() => {
                  !rightOpened ? toggleRight() : "";
                  setActive(3);
                }}
              >
                <IconHelp
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
          </div>
        </div>
        <div>
          {colorScheme == "dark" ? (
            <Tooltip label="Light Mode" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(999)}
                variant="subtle"
                aria-label="Sun"
                radius={0}
                color="light"
                onClick={() => setColorScheme("light")}
              >
                <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label="Dark Mode" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(999)}
                variant="subtle"
                aria-label="Moon"
                radius={0}
                color="light"
                onClick={() => setColorScheme("dark")}
              >
                <IconMoon
                  style={{ width: "70%", height: "70%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Tooltip>
          )}
          {rightOpened ? (
            <Tooltip label="Collapse panel" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(999)}
                variant="subtle"
                aria-label="Expand panel"
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
            </Tooltip>
          ) : (
            <Tooltip label="Expand panel" position="left" fz="xs">
              <ActionIcon
                style={buttonStyle(999)}
                variant="subtle"
                aria-label="Expand panel"
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
            </Tooltip>
          )}
        </div>
      </Paper>
      {/* Ralaven Content */}
      {active == 0 ? <PromptsPanel toggleRight={toggleRight} /> : null}
      {active == 1 ? <ReportsPanel toggleRight={toggleRight} /> : null}
      {active == 2 ? <CommentsPanel toggleRight={toggleRight} /> : null}
      {active == 3 ? help(toggleRight) : null}
    </>
  );
}

const reports = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>REPORTS</Text>
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
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
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
      </div>
      <Divider my="md" />
    </>
  );
};
