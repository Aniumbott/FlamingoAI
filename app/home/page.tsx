"use client";
import React from "react";
import HeaderMegaMenu from "./HeaderMegaMenu";
import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  List,
  ListItem,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Container,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { FooterLinks } from "./FooterLinks";

export default function Home() {
  return (
    <Box>
      <HeaderMegaMenu />
      <Stack mx={"10%"} gap={"xl"} align={"center"} justify={"center"}>
        <Title order={1}>Intuitive GPT chat for your whole company</Title>
        <Text>
          <span className=" font-bold">Team-GPT </span> guarantees ChatGPT
          adoption for teams between 2 and 20,000 people. Organize knowledge,
          collaborate, and master AI in one shared workspace.
        </Text>
        <Button rightSection={<IconArrowRight />}>Start Free </Button>
        <Divider color="grey" w={"100%"} size={"xs"} />
        <Title order={2}>Companies that trust us</Title>
        <Divider color="grey" w={"100%"} size={"xs"} />
        <Card1 />
        <Card2 />
        <Card1 />
        <Card2 />
        <Divider color="grey" w={"100%"} size={"xs"} />
        <Title order={1}>A small price to pay.. to truly Adopt AI</Title>
        <Text fz={"h2"}>
          Have pricing questions? Contact us at humans@team-gpt.com
        </Text>

        <Divider color="grey" w={"100%"} size={"xs"} />

        <Title order={1}>How it works?</Title>
        <HowItWorks />

        <Divider color="grey" w={"100%"} size={"xs"} />

        <FaqSimple />
      </Stack>
      <FooterLinks />
    </Box>
  );
}

const FaqSimple = () => {
  return (
    <Container w={"100%"} className="py-5 ">
      <Title ta="center" order={1} mb={"xl"}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated" w={"70%"} mx={"auto"}>
        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="free-teamgpt"
        >
          <Accordion.Control>Can I try Team-GPT for free?</Accordion.Control>
          <Accordion.Panel p={10}>
            Absolutely, Team-GPT is free for up to 2 people. Sign up and try it
            with a another person to explore all the possibilities for
            collaboration. The platform is designed to facilitate collaboration
            for teams of any size.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="training-resources"
        >
          <Accordion.Control>
            Are there any training materials or resources available to help my
            team adopt Team-GPT?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            Team-GPT is built to simplify the complexities of AI. With Team-GPT
            anyone can become an expert in AI and find value in it. Just send
            them an invite and Team-GPT will take care of onboarding them with
            out ChatGPT for Work interactive course. The course is FREE and is
            integrated into the Team-GPT platform. Thanks to it many
            non-technical users have discovered the magic of AI collaboration.
            We also provide an extensive Knowledge Base filled with various
            resources to help you onboard your whole team into Team-GPT.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="subscription-required"
        >
          <Accordion.Control>
            Is a ChatGPT subscription required to use Team-GPT?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <p>
              No, you don&rsquo;t need a ChatGPT Plus subscription to use
              Team-GPT.
            </p>
            <p>
              Instead, you need to obtain an API key from OpenAI, which you can
              get here. After connecting your API key to Team-GPT, you can use
              the system and pay OpenAI for your usage. You&rsquo;ll be billed
              at the end of the month based on your actual usage, which can be
              more cost-effective, especially if you&rsquo;re collaborating with
              other people.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="AI-model"
        >
          <Accordion.Control>
            Can I chat with more than one AI model?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <p>
              You will not be able to use Team-GPT without setting an OpenAI API
              key.
            </p>
            <p>
              After signing into Team-GPT, go to the &quot;Set API key&quot; menu. From
              there, you can enter your API key in the appropriate field and
              save the changes. This will connect your OpenAI API key to
              Team-GPT, allowing you to use the platform.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="why-teamGPT"
        >
          <Accordion.Control>
            Why should I use Team-GPT, instead of ChatGPT?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <p>
              ChatGPT Plus doesn&rquos;t have a team plan. You can only use it
              individually. As a team owner, you can even pay for your
              colleagues&rquos; ChatGPT Plus subscription.
            </p>

            <p>Full Team-GPT vs ChatGPT comparison table.</p>

            <p>
              Team-GPT is a platform that allows you to collaborate with your
              team using ChatGPT. If you have someone to collaborate with,
              Team-GPT can help you make better use of ChatGPT.
            </p>

            <p>
              The models used by Team-GPT are provided by OpenAI&rquos;s ChatGPT
              API. Therefore, all interactions made through Team-GPT are
              equivalent to those made through the ChatGPT UI available at
              https://chat.openai.com/.
            </p>

            <p>
              The value that Team-GPT provides is related to human
              collaboration. The model output is 100% the same.
            </p>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item
          className=" rounded-md mb-2 border border-gray-300"
          value="after-signup"
        >
          <Accordion.Control>
            What should I do after signing up for Team-GPT?
          </Accordion.Control>
          <Accordion.Panel p={10}>
            <List type="ordered" spacing={"md"}>
              <List.Item>Log in with your credentials. Log in.</List.Item>
              <List.Item>
                Set your API key (create one here if needed).
              </List.Item>
              <List.Item>Invite team members.</List.Item>
              <List.Item>Start collaborating in Team-GPT.</List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

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
        className="bg-teal-900 p-5 rounded-md "
        gap={"lg"}
        align="center"
        justify="center"
      >
        <Image
          radius="md"
          w={100}
          fit="contain"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
        />
        <Text className=" text-center" fz="lg">
          1. Create a completely free account for your team.
        </Text>
      </Stack>
      <Stack gap={"lg"} align="center" justify="center">
        <Image
          radius="md"
          w={100}
          fit="contain"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
        />
        <Text className=" text-center" fz="lg">
          2. Add your OpenAI API key. Don&apos;t have one? Get yours here.
        </Text>
      </Stack>
      <Stack gap={"lg"} align="center" justify="center">
        <Image
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

const Card1 = () => {
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
          <Button rightSection={<IconArrowRight />}>Learn more</Button>
        </Stack>
        <Stack gap={"xl"} align={"center"} justify={"center"}>
          <Image
            radius="md"
            width="auto"
            fit="contain"
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
            />
            <Stack w={"70%"} gap={"xs"} align={"start"} justify={"center"}>
              <Title order={4}>
              &quot;Perfect for team organisation, transparency & collaboration.&quot;
              </Title>
              <Text>George Wilson</Text>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};

const Card2 = () => {
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
            />
            <Stack w={"70%"} gap={"xs"} align={"start"} justify={"center"}>
              <Title order={4}>
              &quot;I purchased Team-GPT and so far, love it! The interface is
                incredibly user-friendly, making it easy for me to generate
                high-quality content quickly.&quot;
              </Title>
              <Text>Lori N Project Manager</Text>
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
          <Button rightSection={<IconArrowRight />}>Learn more</Button>
        </Stack>
      </Group>
    </Stack>
  );
};
