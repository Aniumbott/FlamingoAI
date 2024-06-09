"use client";
import React, { useState } from "react";
import HeaderMegaMenu from ".././HeaderMegaMenu";
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
  Switch,
  Card,
  Slider,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { FooterLinks } from ".././FooterLinks";

export default function Home() {
  const [isMonthly, setIsMonthly] = useState(false);
  const [proValue, setProValue] = useState(10);
  const [maxValue, setMaxValue] = useState(10);
  return (
    <Box>
      <HeaderMegaMenu active={1} />
      <Stack mx={"10%"} gap={"xl"} align={"center"} justify={"center"}>
        <Title order={1}>Small price to pay for great collaboration</Title>
        <Text mb="xl">30-day money back guarantee</Text>
        <Group mt="xl">
          <Text c={!isMonthly ? "var(--mantine-primary-color-filled)" : ""}>
            Yearly
          </Text>
          <Switch
            size="md"
            checked={isMonthly}
            onClick={() => {
              setIsMonthly(!isMonthly);
            }}
          />
          <Text c={isMonthly ? "var(--mantine-primary-color-filled)" : ""}>
            Monthly
          </Text>
        </Group>
        <Group gap={"xl"} mb="xl">
          <Card
            mih={530}
            radius="md"
            w={330}
            shadow="lg"
            withBorder
            style={{
              border: "1px solid var(--mantine-primary-color-filled)",
            }}
          >
            <Title order={4} c="var(--mantine-primary-color-filled)">
              FREE
            </Title>
            <Title order={2} mt="md">
              Try it out
            </Title>
            <Text c="dimmed" ta="right" mt="xl">
              Up to 2 people
            </Text>
            <Title order={1} mt="md">
              $0
            </Title>
            <Text c="dimmed">+AI usage cost</Text>
            <List mt="xl" icon={<IconCheck size="20px" />}>
              <ListItem>Shared chats</ListItem>
              <ListItem>Prompt library</ListItem>
              <ListItem>Folders and subfolders</ListItem>
              <ListItem>Collaborate in ChatGPT</ListItem>
              <ListItem>Pay-per-use of OpenAI API</ListItem>
            </List>
            <Title order={5} c="dimmed" ta="center" mt="xl">
              No credit card required.
            </Title>
            <Button mt="lg">Get Started</Button>
          </Card>
          <Card mih={530} radius="md" w={330} shadow="lg" withBorder>
            <Title order={4} c="var(--mantine-primary-color-filled)">
              PRO
            </Title>
            <Title order={2} mt="md">
              Collaborate
            </Title>
            <Text c="dimmed" ta="right" mt="xl">
              {isMonthly ? "Billed per month" : "Billed per year"}
            </Text>
            <Group align="flex-end" gap={"5px"} mt="md">
              <Title order={1}>${proValue * 2}</Title>
              <Text>/team/{isMonthly ? "month" : "year"}</Text>
            </Group>
            <Slider
              step={10}
              min={10}
              max={500}
              size={"lg"}
              value={proValue}
              onChange={setProValue}
            />
            <Text ta="center"> {proValue} users</Text>
            <Text c="dimmed">+AI usage cost</Text>
            <List mt="xl" icon={<IconCheck size="20px" />}>
              <ListItem c="var(--mantine-primary-color-filled)">
                Everything in FREE
              </ListItem>
              <ListItem>Up to 500 people</ListItem>
              <ListItem>Personal OpenAI API keys</ListItem>
              <ListItem>Azure OpenAI Integration</ListItem>
              <ListItem>Members roles and permissions</ListItem>
            </List>
            <Button mt="xl" variant="outline">
              Upgrade Now
            </Button>
          </Card>
          <Card mih={530} radius="md" w={330} shadow="lg" withBorder>
            <Title order={4} c="var(--mantine-primary-color-filled)">
              MAX
            </Title>
            <Title order={2} mt="md">
              Step up
            </Title>
            <Text c="dimmed" ta="right" mt="xl">
              {isMonthly ? "Billed per month" : "Billed per year"}
            </Text>
            <Group align="flex-end" gap={"5px"} mt="md">
              <Title order={1}>${maxValue * (isMonthly ? 5 : 4)}</Title>
              <Text>/team/{isMonthly ? "month" : "year"}</Text>
            </Group>
            <Slider
              step={10}
              min={10}
              max={500}
              size={"lg"}
              value={maxValue}
              onChange={setMaxValue}
            />
            <Text ta="center"> {maxValue} users</Text>
            <Text c="dimmed">+AI usage cost</Text>
            <List mt="xl" icon={<IconCheck size="20px" />}>
              <ListItem>Everything in PRO</ListItem>
              <ListItem c="var(--mantine-primary-color-filled)">
                AI Editing with Pages 🪄
              </ListItem>
              <ListItem c="var(--mantine-primary-color-filled)">
                Image generation with DALL·E 3
              </ListItem>
              <ListItem c="var(--mantine-primary-color-filled)">
                Anthropic Claude integration
              </ListItem>
              <ListItem c="var(--mantine-primary-color-filled)">
                Custom models (LLaMa, Mixtral)
              </ListItem>
            </List>
            <Button mt="xl" variant="outline">
              Upgrade Now
            </Button>
          </Card>
        </Group>
        <Title my="xl" fw="300" ta="center">
          Have pricing questions? Contact us at{" "}
          <span style={{ color: "var(--mantine-primary-color-filled)" }}>
            <b>humans@team-gpt.com</b>
          </span>
        </Title>
        <Card mt={"xl"} radius="md" w={1050} shadow="lg" withBorder>
          <Group justify="space-between">
            <Box maw={470}>
              <Title order={5} c="var(--mantine-primary-color-filled)">
                TEAM-GPT ENTERPRISE
              </Title>
              <Title mt="sm" mb="lg" order={3}>
                Our flagship product
              </Title>
              <Text mt="xl">
                Team-GPT Enterprise allows your organization to have the
                software:
              </Text>
              <List mt="lg">
                <ListItem>on premises or private cloud deployment</ListItem>
                <ListItem>private database, which only you can access</ListItem>
                <ListItem>
                  OpenAI, Microsoft Azure, Google Gemini, Anthropic Claude, or
                  any custom model (LLaMa, Mixtral, etc.)
                </ListItem>
              </List>
              <Text mt="lg">
                Talk to us for the best custom solution and pricing for your
                business!
              </Text>
              <Group mt="xl">
                <Button size="md">Lets Talk</Button>
                <Button variant="outline" size="md">
                  Read More
                </Button>
              </Group>
            </Box>
            <Image
              w="500"
              radius="md"
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
            />
          </Group>
        </Card>
      </Stack>
      <FooterLinks />
    </Box>
  );
}
