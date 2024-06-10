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
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
const FolderCard = () => {
  return (
    <Stack gap={"md"} align={"start"} justify={"center"}>
      <Group
        preventGrowOverflow={true}
        grow={true}
        gap={"xl"}
        align={"strech"}
        justify={"space-between"}
      >
        <Stack gap={"md"} align={"start"} justify={"center"}>
          <Box fz={"lg"} className=" rounded-xl" fw={"600"} bg={"gray"} p={10}>
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
            <Button rightSection={<IconArrowRight />}>Start Free</Button>
          </Anchor>
        </Stack>
        <Stack gap={"xl"} align={"center"} justify={"center"}>
          <Image
            radius="md"
            width="auto"
            fit="contain"
            h={200}
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            alt=""
          />
          <Group
            wrap="nowrap"
            gap={"xl"}
            align={"center"}
            justify={"space-between"}
          >
            <Image
              radius="md"
              w={"30%"}
              fit="contain"
              alt=""
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            />
            <Stack w={"70%"} gap={"xs"} align={"start"} justify={"center"}>
              <Title order={4}>
                &quot;Perfect for team organisation, transparency &
                collaboration.&quot;
              </Title>
              <Text>George Wilson</Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default FolderCard;
