import React from "react";
import {
  rem,
  Paper,
  Title,
  Text,
  Group,
  Avatar,
  Button,
  Divider,
  Accordion,
  Anchor,
  PasswordInput,
  Badge,
} from "@mantine/core";

import { IconPlus } from "@tabler/icons-react";

import Image from "next/image";

import google from "@/public/google.svg";

import laptop from "@/public/laptop.svg";

export default function Home(props: {
  active: string;
  setActive: (alue: string) => void;
  activeTab: string;
  targetRef: any;
  scrollableRef: any;
}) {
  const { active, setActive, activeTab, targetRef, scrollableRef } = props;
  return (
    <Paper
      style={{ height: "100%", overflowY: "scroll" }}
      ref={scrollableRef}
      display={active === "home" ? "block" : "none"}
    >
      <div style={{ padding: "3rem 2rem" }}>
        {/* ACCOUNT */}
        <div ref={activeTab != "account" ? targetRef : null}>
          <Title order={2}>Account</Title>
          <Text size="sm"> Manage your account information</Text>
        </div>

        {/* Profile */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Profile
          </Text>
          <Divider mt={10} />
          <Button
            variant="subtle"
            color="teal"
            w="100%"
            h="auto"
            p={10}
            mt={10}
            justify="flex-start"
            onClick={() => setActive("profileUpdate")}
          >
            <Group>
              <Avatar size={50} radius="xl">
                AR
              </Avatar>
              <Text size="sm">Aniket Rana</Text>
            </Group>
          </Button>
        </div>

        {/* Emails  */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Email Addresses
          </Text>
          <Divider mt={10} />
          <Accordion variant="filled" mt={10}>
            <Accordion.Item value="1">
              <Accordion.Control>
                <Text size="sm"> aniketrana@gmail.com</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="md" fw={600}>
                  Primary email address
                </Text>
                <Text size="xs" c="dimmed">
                  This email address is the primary email address
                </Text>
                <Text size="md" fw={600} mt={10}>
                  Remove
                </Text>
                <Text size="xs" c="dimmed">
                  Delete this email address and remove it from your account
                </Text>
                <Anchor
                  mt={40}
                  c="red"
                  size="xs"
                  onClick={() => {
                    setActive("removeEmail");
                  }}
                >
                  Remove Email Address
                </Anchor>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Button
            variant="subtle"
            color="teal"
            w="100%"
            mt={10}
            size="xs"
            justify="flex-start"
            leftSection={
              <IconPlus
                style={{
                  width: rem(14),
                  height: rem(14),
                  marginRight: "1rem",
                }}
              />
            }
            onClick={() => setActive("addEmail")}
          >
            Add an email address
          </Button>
        </div>

        {/* Accounts  */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Connected Accounts
          </Text>
          <Divider mt={10} />
          <Accordion variant="filled" mt={10}>
            <Accordion.Item value="1">
              <Accordion.Control>
                <Group>
                  <Image src={google} alt="Google" width={20} height={20} />
                  <Text size="sm"> aniketrana@gmail.com</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Group>
                  <Avatar size={50} color="green" radius="xl">
                    AR
                  </Avatar>
                  <div>
                    <Text size="sm" fw={600}>
                      Aniket Rana
                    </Text>
                    <Text size="xs" c="dimmed">
                      aniketrana@gmail.com
                    </Text>
                  </div>
                </Group>
                <Text size="md" fw={600} mt={10}>
                  Remove
                </Text>
                <Text size="xs" c="dimmed">
                  Remove this connected account from your account
                </Text>
                <Anchor
                  mt={40}
                  c="red"
                  size="xs"
                  onClick={() => setActive("removeConnected")}
                >
                  Remove connected accunt
                </Anchor>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Button
            variant="subtle"
            color="teal"
            w="100%"
            mt={10}
            size="xs"
            justify="flex-start"
            leftSection={
              <IconPlus
                style={{
                  width: rem(14),
                  height: rem(14),
                  marginRight: "1rem",
                }}
              />
            }
            onClick={() => setActive("addConnected")}
          >
            Connect account
          </Button>
        </div>

        {/* SECURITY */}
        <div ref={activeTab != "security" ? targetRef : null}>
          <Title order={2} mt={60}>
            Security
          </Title>
          <Text size="sm"> Manage your security preferances</Text>
        </div>

        {/* Password */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Password
          </Text>
          <Divider mt={10} />
          <PasswordInput
            mt={10}
            w="100%"
            value="1234567890"
            variant="filled"
            disabled
          ></PasswordInput>
          <Button
            variant="subtle"
            color="teal"
            w="100%"
            mt={10}
            size="xs"
            justify="flex-start"
            leftSection={
              <IconPlus
                style={{
                  width: rem(14),
                  height: rem(14),
                  marginRight: "1rem",
                }}
              />
            }
            onClick={() => setActive("setPassword")}
          >
            Set Password
          </Button>
        </div>

        {/* Two Step */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Two-step verification
          </Text>
          <Divider mt={10} />

          <Button
            variant="subtle"
            color="teal"
            w="100%"
            mt={10}
            size="xs"
            justify="flex-start"
            leftSection={
              <IconPlus
                style={{
                  width: rem(14),
                  height: rem(14),
                  marginRight: "1rem",
                }}
              />
            }
            onClick={() => setActive("addTwoFactor")}
          >
            Add two-step verification
          </Button>
        </div>

        {/* Devices  */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Active devices
          </Text>
          <Divider mt={10} />
          <Accordion variant="filled" mt={10}>
            <Accordion.Item value="1">
              <Accordion.Control>
                <Group>
                  <Image src={laptop} alt="Google" width={70} height={70} />
                  <div>
                    <Group>
                      <Text size="sm" fw={600}>
                        X11
                      </Text>
                      <Badge
                        size="xs"
                        variant="light"
                        fw={600}
                        color="violet"
                        radius={0}
                      >
                        This Device
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed">
                      Chrome 122.0.0
                    </Text>
                    <Text size="xs" c="dimmed">
                      2405:201:2032:91d:f4ca:9dc4:fc88:4148 (Surat, IN)
                    </Text>
                    <Text size="xs" c="dimmed">
                      Today t 9:54PM
                    </Text>
                  </div>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="md" fw={600}>
                  Current Device
                </Text>
                <Text size="xs">This is your current device.</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* Danger */}
        <div>
          <Text size="lg" fw={600} mt={40}>
            Danger
          </Text>
          <Divider mt={10} />

          <Group w="100%" justify="space-between" mt={10}>
            <div>
              <Text size="md" fw={600}>
                Delete Account
              </Text>
              <Text size="xs" c="dimmed">
                Delete your account and all its associated data
              </Text>
            </div>
            <Button
              color="red"
              radius={0}
              size="xs"
              onClick={() => setActive("deleteAccount")}
            >
              DELETE ACCOUNT
            </Button>
          </Group>
        </div>
      </div>
    </Paper>
  );
}
