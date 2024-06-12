import React from "react";
import { Card, Group, Image, Stack, Text, ThemeIcon } from "@mantine/core";
import {
  IconApi,
  IconArrowRight,
  IconCheck,
  IconUsersGroup,
} from "@tabler/icons-react";
import { IconLogin2 } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

const HowItWorks = () => {
  const isMobile = useMediaQuery("(max-width: 48em)");
  return (
    <Group
      gap={"xl"}
      align={"center"}
      justify={"space-between"}
      grow={true}
      style={{
        flexDirection: isMobile ? "column" : "row",
      }}
      preventGrowOverflow={true}
    >
      <Card radius={"md"} maw={isMobile ? "100%" : "250"} mah="150" shadow="sm">
        <Stack gap="lg" align="center" justify="center">
          <ThemeIcon variant="white" size={"xl"}>
            <IconLogin2 size={70} />
          </ThemeIcon>
          <Text fz="md" className=" text-center">
            1. Create a completely free account for your team.
          </Text>
        </Stack>
      </Card>

      <Card radius={"md"} maw={isMobile ? "100%" : "250"} mah="150" shadow="sm">
        <Stack align="center" justify="space-between">
          <ThemeIcon variant="white" size={"xl"}>
            <IconApi size={70} />
          </ThemeIcon>
          <Text fz="md" className=" text-center">
            2. Add your OpenAI API key. Don&apos;t have one? Get yours here.
          </Text>
        </Stack>
      </Card>
      <Card radius={"md"} maw={isMobile ? "100%" : "250"} mah="150" shadow="sm">
        <Stack align="center" justify="space-between">
          <ThemeIcon variant="white" size={"xl"}>
            <IconUsersGroup size={70} />
          </ThemeIcon>
          <Text fz="md" className=" text-center">
            3. Collaborate with your team on chats and prompts!
          </Text>
        </Stack>
      </Card>
    </Group>
  );
};

export default HowItWorks;
