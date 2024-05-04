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
  ActionIcon,
  Popover,
  Loader,
  Stack,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { IconCalendar, IconClock, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getChatsReportData } from "@/app/controllers/chat";
import { getAssistants } from "@/app/controllers/assistant";
import { DatePicker } from "@mantine/dates";
import { getWrokSpaceTokens } from "@/app/controllers/tokenLog";
import ActiveUsers from "@/app/components/Reports/ActiveUsers";
import LongestChats from "@/app/components/Reports/LongestChats";
import TokenDistribution from "@/app/components/Reports/TokenDistribution";
import { set } from "mongoose";

export default function Reports() {
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All time");
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [tokenLogs, setTokenLogs] = useState<any>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [assistants, setAssistants] = useState([]); // [TODO: add type
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

  useEffect(() => {
    if (organization?.id) {
      const collectData = async () => {
        const data = await getChatsReportData(organization.id);
        setChats(data.chats);
      };
      const collectAssistants = async () => {
        const data = await getAssistants();
        setAssistants(data.assistants);
      };
      const collectTokenLogs = async () => {
        const data = await getWrokSpaceTokens(organization.id);
        setTokenLogs(data.tokenLogs);
      };

      setIsLoading(true);
      collectData().then(() =>
        collectAssistants().then(() =>
          collectTokenLogs().then(() => setIsLoading(false))
        )
      );
      if (filter == "All time") {
        setDateRange([new Date(organization?.createdAt), new Date()]);
      }
    }
  }, [organization?.id]);

  useEffect(() => {
    const getmembers = async () => {
      const userList =
        (await organization?.getMemberships())?.map((member: any) => {
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
      setMembers(userList);
    };
    getmembers();
  }, [organization?.membersCount]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      if (
        dateRange[0] == organization?.createdAt &&
        dateRange[1].toLocaleDateString() == new Date().toLocaleDateString()
      ) {
        {
          setFilteredChats(chats);
        }
      } else {
        setFilteredChats(
          chats.filter((chat: any) => {
            const chatDate = new Date(chat.updatedAt);
            chatDate.setHours(0, 0, 0, 0);
            if (dateRange[0] && dateRange[1]) {
              if (dateRange[0].toDateString() === dateRange[1].toDateString()) {
                return chatDate.toDateString() === dateRange[0].toDateString();
              } else {
                return chatDate >= dateRange[0] && chatDate <= dateRange[1];
              }
            }
            return true;
          })
        );
      }
    }
  }, [chats, dateRange]);

  useEffect(() => {
    switch (filter) {
      case "Today":
        setDateRange([new Date(), new Date()]);
        break;
      case "7 days":
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 6)),
          new Date(),
        ]);
        break;

      case "30 days":
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 30)),
          new Date(),
        ]);
        break;

      case "60 days":
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 60)),
          new Date(),
        ]);
        break;

      case "90 days":
        setDateRange([
          new Date(new Date().setDate(new Date().getDate() - 90)),
          new Date(),
        ]);
        break;

      case "Previous Week":
        setDateRange([
          new Date(
            new Date().setDate(new Date().getDate() - new Date().getDay() - 6)
          ),
          new Date(
            new Date().setDate(new Date().getDate() - new Date().getDay())
          ),
        ]);
        break;

      case "Previous Month":
        setDateRange([
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        ]);
        break;

      case "All time":
        setDateRange([
          new Date(organization?.createdAt || Date.now()),
          new Date(),
        ]);
        break;
    }
  }, [filter]);
  function getTotalMessages(chats: any[]) {
    let totalMessages = 0;
    chats.forEach((chat: any) => {
      // totalMessages += chat.messages.length;
      chat.messages.forEach((message: any) => {
        if ((message.type = "user")) totalMessages++;
        // totalMessages++;
      });
    });
    return totalMessages;
  }

  return (
    <>
      {isLoading ? (
        <Stack gap={20} justify="center" align="center" w="100%" h="100vh">
          <div className="flex flex-row items-center justify-center">
            <Title order={3} mr="md">
              Generating reports for your organization.
            </Title>
            <Loader size="md" />
          </div>
        </Stack>
      ) : (
        <Paper my="3rem" mx="8vw">
          <Group justify="space-between" align="start">
            <div>
              <Title order={1}>TeamGPT</Title>
              <Title mt="1rem" order={2}>
                Usage Reports for{" "}
                {`${organization?.name} from ${
                  dateRange[0]?.toLocaleDateString() || "start"
                } till ${dateRange[1]?.toLocaleDateString() || "date"}.`}
              </Title>
            </div>
            <Button
              variant="default"
              onClick={() => {
                // go back
                window.history.back();
              }}
            >
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
                <Group wrap="nowrap">
                  <Select
                    allowDeselect={false}
                    defaultValue={filter}
                    onChange={(value) => {
                      setFilter(value || "Today");
                    }}
                    data={[
                      "Today",
                      "7 days",
                      "30 days",
                      "60 days",
                      "90 days",
                      "Previous Week",
                      "Previous Month",
                      "All time",
                      "Custom",
                    ]}
                    leftSection={<IconClock />}
                  ></Select>
                  {filter == "Custom" ? (
                    <Popover>
                      <Popover.Target>
                        <ActionIcon variant="default" size="lg">
                          <IconCalendar width="20px" height="20px" />
                        </ActionIcon>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker
                          type="range"
                          allowSingleDateInRange
                          value={dateRange || new Date()}
                          onChange={setDateRange}
                        />
                      </Popover.Dropdown>
                    </Popover>
                  ) : null}
                </Group>
                <Paper
                  withBorder
                  h="100%"
                  w="100%"
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
                  <Title>{filteredChats.length}</Title>
                </Paper>
                <Paper
                  withBorder
                  h="100%"
                  w="100%"
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
                  <Title>{getTotalMessages(filteredChats)}</Title>
                </Paper>
              </div>
              <div className="h-full w-full">
                <ActiveUsers dateRange={dateRange} tokenLogs={tokenLogs} />
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
                sends is marked as high, moderate, or low efficiency based on
                how many tokens it uses. Sending messages in shorter chats is
                preferred as the message will include less context from previous
                messages and the chat will be more cost-effective and focused.
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
                  {
                    name: "efficient",
                    color: "var(--mantine-primary-color-filled)",
                  },
                  { name: "moderate", color: "yellow" },
                  { name: "inefficient", color: "red" },
                ]}
              ></BarChart>
            </Paper>
            <LongestChats
              filteredChats={filteredChats}
              tokenLogs={tokenLogs}
              assistants={assistants}
              members={members}
            />
            <TokenDistribution dateRange={dateRange} tokenLogs={tokenLogs} />
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
                activity. Cross check with their tokens per message ratio to
                assess their efficiency and adoption. Champion users are the
                ones with most tokens and lowest tokens per message figure.
              </Text>
              <BarChart
                orientation="vertical"
                h={80 * members.length}
                xAxisLabel="Tokens"
                mt="2rem"
                dataKey="name"
                data={members
                  .map((member: any) => {
                    return {
                      name: member.firstName + " " + member.lastName,
                      tokens: tokenLogs
                        .filter((tokenLog: any) => {
                          return tokenLog.createdBy == member.userId;
                        })
                        .reduce((acc: number, tokenLog: any) => {
                          return (
                            acc +
                            Number(tokenLog.inputTokens) +
                            Number(tokenLog.outputTokens)
                          );
                        }, 0),
                    };
                  })
                  .sort((a, b) => b.tokens - a.tokens)}
                series={[
                  {
                    name: "tokens",
                    color: "var(--mantine-primary-color-filled)",
                  },
                ]}
              />
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
                See the engagement of your team - chats created and messages
                sent.
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
                  {members.map((member: any) => {
                    return (
                      <Table.Tr key={member.userId}>
                        <Table.Td>
                          <Group>
                            {member?.hasImage ? (
                              <Avatar
                                size="md"
                                radius="sm"
                                src={member?.imageUrl}
                                mt={5}
                              />
                            ) : (
                              <Avatar size="md" radius="sm" mt={5}>
                                {member?.firstName + member?.lastName}
                              </Avatar>
                            )}
                            <Text>
                              {member.firstName + " " + member.lastName}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          {
                            filteredChats.filter((chat: any) =>
                              chat.participants.includes(member.userId)
                            ).length
                          }
                        </Table.Td>
                        <Table.Td>
                          {filteredChats
                            .filter((chat: any) =>
                              chat.participants.includes(member.userId)
                            )
                            .reduce((acc: number, chat: any) => {
                              return acc + chat.messages.length;
                            }, 0)}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
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
                Others complete a lot of quick one-prompt tasks. This data is
                best used for understanding your whole workspace&apos;s use of
                Team-GPT, not evaluating an individual&apos;s performance.
              </Text>
            </Paper>
          </div>
        </Paper>
      )}
    </>
  );
}
