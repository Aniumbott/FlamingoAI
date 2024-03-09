import { Avatar, Menu, Text, rem, Group } from "@mantine/core";
import {
  IconSettings,
  IconUser,
  IconSun,
  IconLogout,
} from "@tabler/icons-react";

export default function UserAvatar() {
  return (
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
          leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSun style={{ width: rem(14), height: rem(14) }} />}
        >
          Light Mode
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
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
  );
}
