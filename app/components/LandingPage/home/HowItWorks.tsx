import React from "react";
import { Group, Image, Stack, Text } from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

const HowItWorks = () => {
  return (
    <Group
      gap={"xl"}
      align={"center"}
      justify={"space-between"}
      grow={true}
      preventGrowOverflow={true}
    >
      <Stack
        // className="bg-teal-900 p-5 rounded-md "
        gap={"lg"}
        align="center"
        justify="center"
      >
        <Image
          radius="md"
          w={100}
          fit="contain"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          alt=""
        />
        <Text className=" text-center" fz="lg">
          1. Create a completely free account for your team.
        </Text>
      </Stack>
      <Stack
        // className="bg-teal-900 p-5 rounded-md"
        gap={"lg"}
        align="center"
        justify="center"
      >
        <Image
          radius="md"
          w={100}
          fit="contain"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
          alt=""
        />
        <Text className=" text-center" fz="lg">
          2. Add your OpenAI API key. Don&apos;t have one? Get yours here.
        </Text>
      </Stack>
      <Stack
        // className="bg-teal-900 p-5 rounded-md"
        gap={"lg"}
        align="center"
        justify="center"
      >
        <Image
          alt=""
          radius="md"
          w={100}
          fit="contain"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
        />
        <Text className=" text-center" fz="lg">
          3. Collaborate with your team on chats and prompts!
        </Text>
      </Stack>
    </Group>
  );
};

export default HowItWorks;
