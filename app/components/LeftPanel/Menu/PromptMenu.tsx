// Modules
import { Menu, rem } from "@mantine/core";
import {
  IconDots,
  IconSortAscending,
  IconSortDescending,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from "@tabler/icons-react";

export default function PromptMenu() {
  return (
    <Menu>
      <Menu.Target>
        <IconDots style={{ width: "70%", height: "70%" }} stroke={1.5} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Sort</Menu.Label>
        <Menu.Item
          leftSection={
            <IconSortAscendingLetters
              style={{ width: rem(14), height: rem(14) }}
            />
          }
        >
          Name A-Z
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSortDescendingLetters
              style={{ width: rem(14), height: rem(14) }}
            />
          }
        >
          Name Z-A
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSortAscending style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Oldest First
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconSortDescending style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Newest First
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
