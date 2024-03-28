// Modules
import { Accordion, Text, ActionIcon, Center, Menu, rem } from "@mantine/core";
import {
  IconCaretRightFilled,
  IconDots,
  IconFolderFilled,
  IconFolderOpen,
  IconBulbFilled,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
  IconSortAscending,
  IconSortDescending,
  IconAlignJustified,
} from "@tabler/icons-react";

// Components
import style from "../RightPanel/RightPanel.module.css";

type Props = {
  item: {
    title: string;
    content: any[];
  };
};

type AccordionItem = {
  id: string;
  title: string;
  content: any[];
};

export default function LibraryAccordianItem(props: Props) {
  const { item } = props;
  return (
    <Accordion.Item key={item.title} value={item.title}>
      <Center>
        <Accordion.Control>
          <Text size="sm" fw={600}>
            {item.title}
          </Text>
        </Accordion.Control>
        <ActionIcon size="lg" variant="subtle" aria-label="Sort" color="light">
          <PromptMenu />
        </ActionIcon>
      </Center>
      <Accordion.Panel>
        {item.content.map((subItem, subIndex) => {
          if (subItem.type == "folder")
            return (
              <div key={subIndex}>
                <Accordion
                  chevronPosition="left"
                  classNames={{ chevron: style.chevron }}
                  chevron={<IconCaretRightFilled className={style.icon} />}
                >
                  <FolderItem item={subItem} />
                </Accordion>
              </div>
            );
          else if (subItem.type == "chat")
            return (
              <div key={subIndex}>
                <ChatItem item={subItem} />
              </div>
            );
          else
            return (
              <div key={subIndex}>
                <PromptItem item={subItem} />
              </div>
            );
        })}
      </Accordion.Panel>
    </Accordion.Item>
  );
}

const PromptMenu = () => {
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
};

const FolderLabel = (props: { title: string; isOpened: boolean }) => {
  return (
    <div className="flex justify-start items-center">
      {props.isOpened ? (
        <IconFolderOpen
          style={{
            width: "1rem",
            height: "1rem",
            color: "var(--mantine-color-yellow-3)",
          }}
        />
      ) : (
        <IconFolderFilled
          style={{
            width: "1rem",
            height: "1rem",
            color: "var(--mantine-color-yellow-3)",
          }}
        />
      )}
      <Text size="sm" style={{ marginLeft: "0.5rem" }}>
        {props.title}
      </Text>
    </div>
  );
};

const FolderItem = (props: { item: AccordionItem }) => {
  const { item } = props;
  return (
    <>
      <Accordion.Item value={item.id}>
        <Accordion.Control>
          <FolderLabel title={item.title} isOpened={false} />
        </Accordion.Control>

        <Accordion.Panel>
          {item.content.map((subItem, subIndex) => {
            if (subItem.type == "folder")
              return (
                <div key={subIndex}>
                  <Accordion
                    chevronPosition="left"
                    classNames={{ chevron: style.chevron }}
                    chevron={<IconCaretRightFilled className={style.icon} />}
                  >
                    <FolderItem item={subItem} />
                  </Accordion>
                </div>
              );
            else if (subItem.type == "chat")
              return (
                <div key={subIndex}>
                  <ChatItem item={subItem} />
                </div>
              );
            else
              return (
                <div key={subIndex}>
                  <PromptItem item={subItem} />
                </div>
              );
          })}
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

const PromptItem = (props: { item: AccordionItem }) => {
  const { item } = props;
  return (
    <>
      <div className={style.prompt}>
        <IconBulbFilled
          style={{
            width: "1rem",
            height: "1rem",
            color: "var(--mantine-color-teal-3)",
          }}
        />
        <Text size="sm" style={{ marginLeft: "0.5rem" }}>
          {item.title}
        </Text>
      </div>
    </>
  );
};

const ChatItem = (props: { item: AccordionItem }) => {
  const { item } = props;
  return (
    <>
      <div className={style.prompt}>
        <IconAlignJustified
          color="gray"
          style={{
            width: "1rem",
            height: "1rem",
          }}
        />
        <Text size="sm" style={{ marginLeft: "0.5rem" }}>
          {item.title}
        </Text>
      </div>
    </>
  );
};
