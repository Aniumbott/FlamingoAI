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

const CostSavingCard = () => {
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
            Cost Savings
          </Box>
          <Title order={1}>
            10x cheaper and faster than ChatGPT aaand... collaborative
          </Title>
          <Text>Pay only for what you use.</Text>
          <Text>
            Eliminate the wait limits of ChatGPT Plus with priority access to
            the OpenAI API.
          </Text>
          <Text>
            Example for a team of 20: ChatGPT Plus costs $20 x 20 = $400/m,
            while Flamingo.ai would cost ~ $40 + $110 (of API usage) /m
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
            <ListItem> Pay only for what you use</ListItem>
            <ListItem>Priority access to the OpenAI API</ListItem>
            <ListItem>
              Flamingo.ai handles company billing and invoices
            </ListItem>
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
            width="auto"
            fit="contain"
            maw={400}
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
                &quot;6 hours of constant prompting cost me .33 cents. Kudos to
                the developers of Flamingo.ai. This is a great app and is WORTH
                ITS WEIGHT IN GOLD!&quot;
              </Title>
              <Text w="100%" ta={isMobile ? "center" : "left"}>
                Tim Man
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default CostSavingCard;
