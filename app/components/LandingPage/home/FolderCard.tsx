import React from "react";
import {
  Button,
  Box,
  Group,
  Image,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Anchor,
  Avatar,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
const FolderCard = () => {
  const isMobile = useMediaQuery("(max-width: 48em)");
  return (
    <Stack mt="5rem" mb="5rem" gap={"md"} align={"start"} justify={"center"}>
      <Group
        preventGrowOverflow={true}
        grow={true}
        gap={"xl"}
        align={"center"}
        justify={"space-between"}
        style={{
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Stack
          maw={isMobile ? "100%" : ""}
          gap={"md"}
          align={"start"}
          justify={"center"}
        >
          <Box
            fz={"sm"}
            className="rounded-md"
            fw={"600"}
            bg={"var(--mantine-color-gray-3)"}
            p={10}
          >
            Folders and Subfolders
          </Box>
          <Title order={1}>Reduce clutter and organize knowledge</Title>
          <Text>Most chats are trash… but not all.</Text>
          <Text>
            Categorize the good ones, order them in folders and subfolders, and
            reduce clutter.
          </Text>
          <Text>
            A well organized ChatGPT workspace, enhances accessibility,
            knowledge sharing and team collaboration.
          </Text>
          <List
            icon={
              <ThemeIcon radius={"xl"} size={"xs"}>
                <IconCheck />
              </ThemeIcon>
            }
            spacing={"5px"}
            center={true}
            // withPadding={true}
          >
            <ListItem>Organize chats in folders</ListItem>
            <ListItem>Help your team find the best chats</ListItem>
            <ListItem>Accelerate adoption by highlighting use cases</ListItem>
          </List>
          <Anchor href="/workspace">
            <Button size="lg" radius={"md"} rightSection={<IconArrowRight />}>
              Start Free
            </Button>
          </Anchor>
        </Stack>
        <Stack
          maw={isMobile ? "100%" : ""}
          gap={"xl"}
          align={"center"}
          justify={"center"}
        >
          <Image
            radius="md"
            fit="contain"
            w={isMobile ? "90vw" : 400}
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            alt=""
          />
          <Group
            wrap="nowrap"
            gap={"xl"}
            align={"center"}
            justify={isMobile ? "space-between" : " center"}
            style={{
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <Avatar size="xl" radius={"md"}></Avatar>
            <Stack w={"70%"} gap={"xs"} align={"start"} justify={"center"}>
              <Title ta={isMobile ? "center" : "left"} order={4}>
                &quot;Perfect for team organisation, transparency &
                collaboration.&quot;
              </Title>
              <Text w="100%" ta={isMobile ? "center" : "left"}>
                George Wilson
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default FolderCard;
