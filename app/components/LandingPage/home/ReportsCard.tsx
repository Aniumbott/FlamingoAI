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

const ReportsCard = () => {
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
                &quot;Within an hour of activating it, I was able to get my team
                using it and getting immediate value. I highly recommend
                Flamingo.ai.&quot;
              </Title>
              <Text w="100%" ta={isMobile ? "center" : "left"}>
                Derek, Small Business Owner
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
            Adoption Reports
          </Box>
          <Title order={1}>
            Measure your AI adoption rate and ensure your team is talking to the
            AI
          </Title>
          <Text>Flamingo.ai really wants you to add AI to your team.</Text>
          <Text>
            Gain invaluable insights into your team&quot;s adoption rate and
            engagement level with ChatGPT.
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
            <ListItem>Ranking of the top users</ListItem>
            <ListItem>Number of chats and messages</ListItem>
            <ListItem>Adoption rate of the whole company</ListItem>
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

export default ReportsCard;
