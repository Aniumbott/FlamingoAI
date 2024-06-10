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

const PromptLibraryCard = () => {
  return (
    <Stack gap={"md"} align={"start"} justify={"center"}>
      <Group
        preventGrowOverflow={true}
        grow={true}
        gap={"xl"}
        align={"strech"}
        justify={"space-between"}
      >
        <Stack gap={"xl"} align={"center"} justify={"center"}>
          <Image
            radius="md"
            width="auto"
            fit="contain"
            alt=""
            h={200}
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
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
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
              alt=""
            />
            <Stack w={"70%"} gap={"xs"} align={"start"} justify={"center"}>
              <Title order={4}>
                &quot;I purchased Team-GPT and so far, love it! The interface is
                incredibly user-friendly, making it easy for me to generate
                high-quality content quickly.&quot;
              </Title>
              <Text>Lori N, Project Manager</Text>
            </Stack>
          </Group>
        </Stack>

        <Stack gap={"md"} align={"start"} justify={"center"}>
          <Box fz={"lg"} className=" rounded-xl" fw={"600"} bg={"gray"} p={10}>
            Prompt Library
          </Box>
          <Title order={1}>
            Learn ChatGPT as a team and reach the next level of productivity
          </Title>
          <Text>Learn by example.</Text>
          <Text>
            Never start from scratch with our tried-and-tested conversation
            starters.
          </Text>
          <Text>
            Explore how your own team is engaging with ChatGPT to expedite your
            journey to AI adoption.
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
            <ListItem>100+ ready-to-use prompt templates</ListItem>
            <ListItem>50+ Tips and Tricks to help you master GPT</ListItem>
            <ListItem>
              Learn and improve by having group chats with the AI
            </ListItem>
          </List>
          <Anchor href="/workspace">
            <Button rightSection={<IconArrowRight />}>Start Free</Button>
          </Anchor>
        </Stack>
      </Group>
    </Stack>
  );
};

export default PromptLibraryCard;
