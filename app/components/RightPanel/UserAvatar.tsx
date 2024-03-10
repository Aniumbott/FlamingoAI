import {
  Avatar,
  Menu,
  Text,
  rem,
  Group,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconSettings,
  IconUser,
  IconSun,
  IconMoon,
  IconLogout,
} from "@tabler/icons-react";
import { useState } from "react";
import Profile from "./Modals/Profile/Profile";
import Workspace from "./Modals/Workspace/Workspace";

export default function UserAvatar() {
  const [profileModalOpened, setProfileModalOpened] = useState(false);
  const [workspaceModalOpened, setWorkspaceModalOpened] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  return (
    <>
      <Profile opened={profileModalOpened} setOpened={setProfileModalOpened} />
      <Workspace
        opened={workspaceModalOpened}
        setOpened={setWorkspaceModalOpened}
      />
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Avatar style={{ margin: "0.3rem" }} color="green" radius="sm">
            AR
          </Avatar>
        </Menu.Target>

        <Menu.Dropdown>
          <div
            style={{
              marginRight: "0.5rem",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar style={{ margin: "0.3rem" }} color="green" radius="sm">
              AR
            </Avatar>
            <div>
              <Text size="sm">Aniket Rana</Text>
              <Text size="xs" c="grey">
                aniketrana@gmail.com
              </Text>
            </div>
          </div>

          <Menu.Divider />

          <Menu.Item
            leftSection={
              <IconUser style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => setProfileModalOpened(true)}
          >
            Profile
          </Menu.Item>
          {colorScheme === "dark" ? (
            <Menu.Item
              leftSection={
                <IconSun style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => setColorScheme("light")}
            >
              Light Mode
            </Menu.Item>
          ) : (
            <Menu.Item
              leftSection={
                <IconMoon style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => setColorScheme("dark")}
            >
              Dark Mode
            </Menu.Item>
          )}
          <Menu.Item
            leftSection={
              <IconSettings style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => setWorkspaceModalOpened(true)}
          >
            Workspace Settings
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Sign Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
