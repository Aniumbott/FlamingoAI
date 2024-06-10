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

const CostSavingCard = () => {
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
            while Team-GPT would cost ~ $40 + $110 (of API usage) /m
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
            <ListItem>Team-GPT handles company billing and invoices</ListItem>
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
                &quot;6 hours of constant prompting cost me .33 cents. Kudos to
                the developers of Team-GPT. This is a great app and is WORTH ITS
                WEIGHT IN GOLD!&quot;
              </Title>
              <Text>Tim Man</Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

export default CostSavingCard;
