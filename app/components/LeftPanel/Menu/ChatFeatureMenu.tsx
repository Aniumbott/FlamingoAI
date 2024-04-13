// Modules
import {
  Menu,
  Button,
  Stack,
  Text,
  rem,
  Avatar,
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  IconDots,
  IconFolderUp,
  IconStar,
  IconTrash,
  IconCopy,
  IconPencilMinus,
  IconStarFilled,
  IconStarOff,
  IconArchive,
} from "@tabler/icons-react";
import { useHover } from "@mantine/hooks";
import { deleteChat, updateChat } from "@/app/controllers/chat";
import { IChatDocument } from "@/app/models/Chat";
import { useAuth } from "@clerk/nextjs";

export default function ChatFeatureMenu(props: {
  chat: IChatDocument;
  members: any[];
  open: boolean;
  setOpen: (value: boolean) => void;
  setRename: (value: boolean) => void;
  setMoveModal: (value: boolean) => void;
}) {
  const { userId, orgId } = useAuth();
  return (
    <>
      <Menu
        width={200}
        position="bottom-end"
        styles={{
          dropdown: {
            backgroundColor: "#ffffff",
          },
          item: {
            backgroundColor: "#ffffff",
            color: "#000000",
            hover: {
              backgroundColor: "#000000",
            },
            height: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: "0px",
          },
        }}
        opened={props.open}
        onChange={props.setOpen}
      >
        <Menu.Target>
          <ActionIcon
            size="25px"
            variant="subtle"
            aria-label=""
            color="#9CA3AF"
            // {...(hovered ? { opacity: "1" } : { opacity: "0" })}
            style={{
              "--ai-hover-color": "white",
            }}
           
          >
            <IconDots size={15} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>
            <Stack gap={5}>
              <Text fw={"500"} fz={"sm"} c={"#000000"}>
                {props.chat.name}
              </Text>
              <Avatar.Group>
                {props.members.map((member, key) =>
                  props.chat.participants.includes(member.userId) ? (
                    <Avatar
                      radius={"md"}
                      key={key}
                      style={{
                        border: "none",
                      }}
                      size="25px"
                      src={member.imageUrl}
                    />
                  ) : null
                )}
              </Avatar.Group>
            </Stack>
          </Menu.Label>
          <Divider color={"#d8dce0"} my={2} />
          {props.chat.archived ? (
            <>
              <Menu.Item
                onClick={() => {
                  updateChat(props.chat._id, {
                    archived: false,
                  }).then((res) => {
                    console.log(res);
                  });
                }}
              >
                <MenuButton properties={MenuData[6]} />
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  deleteChat(props.chat).then((res) => {
                    console.log(res);
                  });
                }}
              >
                <MenuButton properties={MenuData[7]} />
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item onClick={() => props.setRename(true)}>
                <MenuButton properties={MenuData[0]} />
              </Menu.Item>
              <Menu.Item>
                <MenuButton properties={MenuData[1]} />
              </Menu.Item>
              {userId && props.chat.favourites?.includes(userId) ? (
                <Menu.Item
                  onClick={() => {
                    updateChat(props.chat._id, {
                      $pull: { favourites: userId || "" },
                    }).then((res) => {
                      console.log(res);
                    });
                  }}
                >
                  <MenuButton properties={MenuData[5]} />
                </Menu.Item>
              ) : (
                <Menu.Item
                  onClick={() => {
                    updateChat(props.chat._id, {
                      $push: { favourites: userId || "" },
                    }).then((res) => {
                      console.log(res);
                    });
                  }}
                >
                  <MenuButton properties={MenuData[2]} />
                </Menu.Item>
              )}
              <Menu.Item onClick={() => props.setMoveModal(true)}>
                <MenuButton properties={MenuData[3]} />
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  updateChat(props.chat._id, {
                    archived: true,
                  }).then((res) => {
                    console.log(res);
                  });
                }}
              >
                <MenuButton properties={MenuData[4]} />
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

const MenuButton = (props: {
  properties: { title: string; icon: React.ReactNode };
}) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline", fz: "xl" }
          : { color: "0F172A", variant: "transparent" })}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
        }}
        // onClick={props.properties.onClickAction}
      >
        <Stack gap={1} align="start">
          <Text fw={"400"} fz={"xs"}>
            {props.properties.title}
          </Text>
        </Stack>
      </Button>
    </div>
  );
};

const MenuData: { title: string; icon: React.ReactNode }[] = [
  {
    title: "Rename",
    icon: <IconPencilMinus size={20} />,
  },
  {
    title: "Copy Link",
    icon: <IconCopy size={20} />,
  },
  {
    title: "Add to favourite",
    icon: <IconStar size={20} />,
  },
  {
    title: "Move",
    icon: <IconFolderUp size={20} />,
  },
  {
    title: "Archive",
    icon: <IconTrash size={20} />,
  },
  {
    title: "Remove from favourite",
    icon: <IconStarOff size={20} />,
  },
  {
    title: "Restore",
    icon: <IconArchive size={20} />,
  },
  {
    title: "Delete",
    icon: <IconTrash size={20} />,
  },
];
