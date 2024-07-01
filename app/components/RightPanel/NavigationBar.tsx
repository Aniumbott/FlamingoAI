import {
  Paper,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  Flex,
  em,
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
import { Protect, UserButton } from "@clerk/nextjs";
import { useMediaQuery } from "@mantine/hooks";
import { usePathname } from "next/navigation";

export default function NavigationBar(props: {
  active: number;
  setActive: (active: number) => void;
  rightOpened: boolean;
  toggleRight: () => void;
}) {
  const { active, setActive, rightOpened, toggleRight } = props;
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const ButtonProps = (ind: number) => {
    return {
      style: {
        width: "3rem",
        height: "3rem",
        padding: "0.5rem",
      },
      variant: active == ind ? "light" : "subtle",
      "aria-label": "Categories",
      radius: 0,
      color: active == ind && active != 999 ? "" : "light",
      onClick: () => {
        !rightOpened ? toggleRight() : "";
        setActive(ind);
      },
    };
  };

  return (
    <Paper
      style={{
        position: "absolute",
        padding: 0,
        zIndex: 1000,
        background:
          colorScheme === "dark"
            ? isMobile
              ? "var(--mantine-color-dark-7)"
              : "var(--mantine-color-dark-8)"
            : isMobile
            ? "var(--mantine-color-white)"
            : "var(--mantine-color-gray-1)",
        width: isMobile ? "calc(100% - 1rem)" : "3rem",
      }}
      {...(isMobile
        ? {
            h: "3rem",
            bottom: "0",
            px: "sm",
            m: "0.5rem",
            radius: "md",
            shadow: "xs",
          }
        : {
            h: "100%",
            top: "0",
            left: "-3rem",
          })}
    >
      <div
        className={`h-full w-full flex  ${
          isMobile ? "flex-row justify-between" : "flex-col justify-start pt-3"
        }`}
      >
        <div className="flex justify-center items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
        {pathname.split("/")[3] != "page" && (
          <div
            className={`flex items-center justify-center ${
              isMobile ? "flex-row" : "flex-col mt-[8rem]"
            }`}
            // style={{ marginTop: "8rem" }}
          >
            <Tooltip label="Prompts" position="left" fz="xs">
              <ActionIcon {...ButtonProps(0)}>
                <IconCategory size={20} />
              </ActionIcon>
            </Tooltip>

            <Protect role="org:admin">
              <Tooltip label="Reports" position="left" fz="xs">
                <ActionIcon {...ButtonProps(1)}>
                  <IconTrendingUp size={20} />
                </ActionIcon>
              </Tooltip>
            </Protect>

            <Tooltip label="Comments" position="left" fz="xs">
              <ActionIcon {...ButtonProps(2)}>
                <IconMessages size={20} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Help" position="left" fz="xs">
              <ActionIcon {...ButtonProps(3)}>
                <IconHelp size={20} />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
        <div
          className={`h-full flex justify-end items-end ${
            isMobile ? "flex-row" : "flex-col"
          }`}
        >
          {colorScheme == "dark" ? (
            <Tooltip label="Light Mode" position="left" fz="xs">
              <ActionIcon
                {...ButtonProps(999)}
                onClick={() => setColorScheme("light")}
              >
                <IconSun size={20} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Tooltip label="Dark Mode" position="left" fz="xs">
              <ActionIcon
                {...ButtonProps(999)}
                onClick={() => setColorScheme("dark")}
              >
                <IconMoon size={20} />
              </ActionIcon>
            </Tooltip>
          )}
          {pathname.split("/")[3] != "page" && !isMobile ? (
            rightOpened ? (
              <Tooltip label="Collapse panel" position="left" fz="xs">
                <ActionIcon {...ButtonProps(999)} onClick={() => toggleRight()}>
                  <IconLayoutSidebarLeftExpand size={20} />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Tooltip label="Expand panel" position="left" fz="xs">
                <ActionIcon {...ButtonProps(999)} onClick={() => toggleRight()}>
                  <IconLayoutSidebarRightExpand size={20} />
                </ActionIcon>
              </Tooltip>
            )
          ) : null}
        </div>
      </div>
    </Paper>
  );
}
