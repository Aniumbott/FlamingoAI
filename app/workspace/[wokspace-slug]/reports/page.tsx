"use client";
import { useOrganization } from "@clerk/nextjs";
import {
  Paper,
  Title,
  Text,
  Select,
  Avatar,
  Table,
  Group,
  Tooltip,
  Button,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { IconClock, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";
export default function Reports() {
  const { organization } = useOrganization();
  const [selected, setSelected] = useState("Today");
  const [activeUsers, setActiveUsers] = useState([
    {
      month: "Jan",
      users: 10,
    },
    {
      month: "Feb",
      users: 20,
    },
    {
      month: "Mar",
      users: 30,
    },
    {
      month: "Apr",
      users: 40,
    },
    {
      month: "May",
      users: 50,
    },
    {
      month: "Jun",
      users: 60,
    },
    {
      month: "Jul",
      users: 70,
    },
    {
      month: "Aug",
      users: 80,
    },
    {
      month: "Sep",
      users: 90,
    },
    {
      month: "Oct",
      users: 100,
    },
    {
      month: "Nov",
      users: 110,
    },
    {
      month: "Dec",
      users: 120,
    },
  ]);
  const [chatEfficiency, setChatEfficiency] = useState([
    {
      name: "Aniket Rana",
      efficient: 40,
      moderate: 30,
      inefficient: 30,
    },
    {
      name: "Aniket Rana",
      efficient: 40,
      moderate: 30,
      inefficient: 30,
    },
  ]);
  const [longestChats, setLongestChats] = useState([
    {
      id: "1",
      name: "new chat",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "2",
      name: "new chat 2",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "3",
      name: "new chat 3",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "4",
      name: "new chat 4",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "5",
      name: "new chat 5",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "6",
      name: "new chat 6",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "7",
      name: "new chat 7",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
    {
      id: "8",
      name: "new chat 8",
      tokens: 100,
      model: "GPT-3",
      contextWindow: 100,
      ratio: "0.3%",
      messages: 10,
      participants: 3,
      createdDate: "2021-10-10",
    },
  ]);
  const [tocketnDistribution, setTokenDistribution] = useState([
    {
      week: "Week 1",
      input: 100,
      output: 50,
    },
    {
      week: "Week 2",
      input: 200,
      output: 150,
    },
    {
      week: "Week 3",
      input: 100,
      output: 30,
    },
    {
      week: "Week 4",
      input: 160,
      output: 50,
    },
    {
      week: "Week 5",
      input: 300,
      output: 150,
    },
    {
      week: "Week 6",
      input: 200,
      output: 180,
    },
    {
      week: "Week 7",
      input: 180,
      output: 60,
    },
    {
      week: "Week 8",
      input: 140,
      output: 80,
    },
  ]);
  const [tokenUsageByUser, setTokenUsageByUser] = useState([
    {
      name: "Aniket Rana",
      tockens: 350,
    },
    {
      name: "Aniket Rana",
      tockens: 540,
    },
  ]);
  const [userEngagement, setUserEngagement] = useState([
    {
      name: "Aniket Rana",
      chats: 10,
      messages: 100,
    },
    {
      name: "Aniket Rana",
      chats: 10,
      messages: 100,
    },
  ]);
  return (
    <Paper my="3rem" mx="8vw">
      <Group justify="space-between" align="start">
        <div>
          <Title order={1}>TeamGPT</Title>
          <Title mt="1rem" order={2}>
            Usage Reports for {organization?.name}
          </Title>
        </div>
        <Button
          unstyled
          onClick={() => {
            // go back
            window.history.back();
          }}
        >
          {" "}
          Go to Dashboard
        </Button>
      </Group>

      <div className="flex flex-col mt-5">
        <div className="flex flex-row ">
          <div
            className="flex flex-col"
            style={{
              marginRight: "1rem",
            }}
          >
            <Select
              defaultValue={selected}
              onChange={(value) => setSelected(value || "Today")}
              data={[
                "Today",
                "7 days",
                "30 days",
                "60 days",
                "90 days",
                "Privious Week",
                "Previous Month",
                "All time",
                "Custom",
              ]}
              leftSection={<IconClock />}
            ></Select>
            <Paper
              withBorder
              h="100%"
              w="15rem"
              mt="1rem"
              p="2rem"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Title order={5} ta="center">
                Total Number of Chats
              </Title>
              <Title>15</Title>
            </Paper>
            <Paper
              withBorder
              h="100%"
              w="15rem"
              mt="1rem"
              p="2rem"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Title order={5} ta="center">
                Total Number of Messages Sent
              </Title>
              <Title>15</Title>
            </Paper>
          </div>
          <div className="h-full w-full">
            <Paper
              withBorder
              h="100%"
              w="100%"
              p="2rem"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "space-between",
              }}
            >
              <div className="mb-5">
                <Title order={3}>Active Users</Title>
                <Text size="sm">
                  See how many people are active — meaning, they sent a message
                  in a chat.
                </Text>
              </div>
              <BarChart
                h={300}
                data={activeUsers}
                dataKey="month"
                yAxisLabel="Users"
                tickLine="y"
                series={[
                  {
                    name: "users",
                    color: "teal",
                  },
                ]}
              />
            </Paper>
          </div>
        </div>
        <Paper
          withBorder
          mt="1rem"
          w="100%"
          p="2rem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Title order={3}>Chat Efficiency by User</Title>
          <Text mt="1rem" size="sm">
            See how well users chat with the AI models. Each message a user
            sends is marked as high, moderate, or low efficiency based on how
            many tokens it uses. Sending messages in shorter chats is preferred
            as the message will include less context from previous messages and
            the chat will be more cost-effective and focused.
          </Text>
          <BarChart
            type="stacked"
            dataKey="name"
            h={80 * chatEfficiency.length}
            mt="2rem"
            xAxisLabel="Ammount (%)"
            data={chatEfficiency}
            orientation="vertical"
            barProps={{}}
            series={[
              { name: "efficient", color: "teal" },
              { name: "moderate", color: "yellow" },
              { name: "inefficient", color: "red" },
            ]}
          ></BarChart>
        </Paper>
        <Paper
          withBorder
          mt="1rem"
          h="auto"
          w="100%"
          p="2rem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Title order={3}>The longest chats in your workspace</Title>
          <Text mt="1rem" size="sm">
            See the longest chats in your workspace — each new message in a long
            chat uses an increasing amount of tokens. To optimise usage costs
            and maintain AI focus, consider splitting longer chats into smaller
            ones or starting fresh.
          </Text>
          <Table mt="1rem" verticalSpacing={20}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Chat Name</Table.Th>
                <Table.Th>
                  <Group justify="start">
                    Tockens
                    <Tooltip
                      withArrow
                      multiline
                      w={400}
                      label="The total number of tokens utilised in the chat; the chat length, in tokens."
                    >
                      <IconInfoCircle size="14px" />
                    </Tooltip>
                  </Group>
                </Table.Th>
                <Table.Th>
                  <Group justify="start">
                    Model
                    <Tooltip
                      withArrow
                      multiline
                      w={400}
                      label="The GPT model the chat is using. If chats started with one model, but then switched, the latest model is shown here."
                    >
                      <IconInfoCircle size="14px" />
                    </Tooltip>
                  </Group>
                </Table.Th>
                <Table.Th>
                  <Group justify="start">
                    Context <br /> Window
                    <Tooltip
                      withArrow
                      multiline
                      w={400}
                      label="The number of tokens the model can maintain as context when processing a request. When the conversation exceeds the context window, older messages are dropped from the context."
                    >
                      <IconInfoCircle size="14px" />
                    </Tooltip>
                  </Group>
                </Table.Th>
                <Table.Th>
                  <Group justify="start">
                    Ratio
                    <Tooltip
                      withArrow
                      multiline
                      w={400}
                      label="The proportion of the model's total context window that is currently being utilized by the chat. Values over 100% indicate that earliest information is dropped from the context."
                    >
                      <IconInfoCircle size="14px" />
                    </Tooltip>
                  </Group>
                </Table.Th>
                <Table.Th>Messages</Table.Th>
                <Table.Th>Participants</Table.Th>
                <Table.Th>Date created</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {longestChats.map((chat) => (
                <Table.Tr key={chat.id}>
                  <Table.Td>{chat.name}</Table.Td>
                  <Table.Td>{chat.tokens}</Table.Td>
                  <Table.Td>{chat.model}</Table.Td>
                  <Table.Td>{chat.contextWindow}</Table.Td>
                  <Table.Td>{chat.ratio}</Table.Td>
                  <Table.Td>{chat.messages}</Table.Td>
                  <Table.Td>{chat.participants}</Table.Td>
                  <Table.Td>{chat.createdDate}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
        <Paper
          withBorder
          mt="1rem"
          h="auto"
          w="100%"
          p="2rem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Title order={3}>Token Distribution Overview</Title>
          <Text mt="1rem" size="sm">
            See the token usage breakdown by type. Input tokens are almost
            always more than output tokens, because each new message sent in the
            chat contains the previous messages as context. Tokens can be
            converted to cost. See your cost in OpenAI.
          </Text>
          <BarChart
            type="stacked"
            dataKey="week"
            h={300}
            mt="2rem"
            xAxisLabel="Ammount"
            data={tocketnDistribution}
            barProps={{}}
            series={[
              { name: "input", color: "teal" },
              { name: "output", color: "yellow" },
            ]}
          ></BarChart>
        </Paper>
        <Paper
          withBorder
          mt="1rem"
          h="auto"
          w="100%"
          p="2rem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Title order={3}>Token usage by user</Title>
          <Text mt="1rem" size="sm">
            See token consumption for each user to understand their GPT
            activity. Cross check with their tokens per message ratio to assess
            their efficiency and adoption. Champion users are the ones with most
            tokens and lowest tokens per message figure.
          </Text>
          <BarChart
            dataKey="name"
            h={80 * chatEfficiency.length}
            mt="2rem"
            xAxisLabel="Ammount (%)"
            data={tokenUsageByUser}
            orientation="vertical"
            barProps={{}}
            series={[{ name: "tockens", color: "teal" }]}
          ></BarChart>
        </Paper>
        <Paper
          withBorder
          mt="1rem"
          h="auto"
          w="100%"
          p="2rem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Title order={3}>User engagement</Title>
          <Text mt="1rem" size="sm">
            See the engagement of your team - chats created and messages sent.
          </Text>
          <Table mt="1rem" verticalSpacing={10}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th>Chats</Table.Th>
                <Table.Th>Messages</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {userEngagement.map((user) => (
                <Table.Tr key={user.name}>
                  <Table.Td>
                    <Group>
                      <Avatar alt="user" radius="xl" />
                      <Text>{user.name}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{user.chats}</Table.Td>
                  <Table.Td>{user.messages}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
        <Paper
          mt="1rem"
          h="auto"
          w="100%"
          p="1rem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-between",
          }}
        >
          <Title order={5}>A quick note about reports:</Title>
          <Text mt="1rem" size="sm">
            Some people do work which requires and benefits from long chats.
            Others complete a lot of quick one-prompt tasks. This data is best
            used for understanding your whole workspace&apos;s use of Team-GPT,
            not evaluating an individual&apos;s performance.
          </Text>
        </Paper>
      </div>
    </Paper>
  );
}
