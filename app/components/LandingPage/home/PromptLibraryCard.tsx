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

const PromptLibraryCard = () => {
  const isMobile = useMediaQuery("(max-width: 48em)");
  return (
    <Stack my="5rem" gap={"md"} align={"start"} justify={"center"}>
      <Group
        preventGrowOverflow={true}
        grow={true}
        gap={"xl"}
        align={"strech"}
        justify={"space-between"}
        style={{
          flexDirection: isMobile ? "column-reverse" : "row",
        }}
      >
        <Stack
          maw={isMobile ? "100%" : ""}
          gap={"xl"}
          align={"center"}
          justify={"center"}
        >
          <Image
            radius="md"
            width="auto"
            fit="contain"
            alt=""
            w={isMobile ? "90vw" : 400}
            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
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
                &quot;I purchased Flamingo.ai and so far, love it! The interface
                is incredibly user-friendly, making it easy for me to generate
                high-quality content quickly.&quot;
              </Title>
              <Text w="100%" ta={isMobile ? "center" : "left"}>
                Lori N, Project Manager
              </Text>
            </Stack>
          </Group>
        </Stack>

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
            <Button size="lg" radius={"md"} rightSection={<IconArrowRight />}>
              Start Free
            </Button>
          </Anchor>
        </Stack>
      </Group>
    </Stack>
  );
};

export default PromptLibraryCard;
