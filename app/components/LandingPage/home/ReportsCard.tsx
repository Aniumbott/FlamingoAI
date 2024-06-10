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

const ReportsCard = () => {
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
                &quot;Within an hour of activating it, I was able to get my team
                using it and getting immediate value. I highly recommend
                Team-GPT.&quot;
              </Title>
              <Text>Derek, Small Business Owner</Text>
            </Stack>
          </Group>
        </Stack>

        <Stack gap={"md"} align={"start"} justify={"center"}>
          <Box fz={"lg"} className=" rounded-xl" fw={"600"} bg={"gray"} p={10}>
            Adoption Reports
          </Box>
          <Title order={1}>
            Measure your AI adoption rate and ensure your team is talking to the
            AI
          </Title>
          <Text>Team-GPT really wants you to add AI to your team.</Text>
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
            <Button rightSection={<IconArrowRight />}>Start Free</Button>
          </Anchor>
        </Stack>
      </Group>
    </Stack>
  );
};

export default ReportsCard;
