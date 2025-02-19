"use client";

import {
  CreateOrganization,
  OrganizationProfile,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import {
  Alert,
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Paper,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import create from "@/public/create.svg";
import setup from "@/public/setup.svg";
import upgrade from "@/public/upgrade.svg";
import done from "@/public/done.svg";
import NextImage from "next/image";
import { useSearchParams } from "next/navigation";
import { IconInfoCircle, IconLink } from "@tabler/icons-react";
import { getWorkspace, updateWorkspace } from "../controllers/workspace";
import { isValidOpenAIKey } from "../controllers/aiModel";
import CustomCreateOrganization from "../components/PageWindow/CustomCreateOrganization";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 48em)");
  const { organization } = useOrganization();
  const { user } = useUser();
  const [active, setActive] = useState(0);
  const { colorScheme } = useMantineColorScheme();
  const searchParams = useSearchParams();
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    if (searchParams.get("step")) {
      setActive(parseInt(searchParams.get("step") ?? "0"));
    }
  }, [searchParams]);

  return (
    <Group
      mah="100vh"
      gap={0}
      style={{
        overflow: "hidden",
        flexWrap: "nowrap",
        flexDirection: isMobile ? "column-reverse" : "row",
        background: colorScheme
          ? "var(--mantine-color-dark-8)"
          : "var(--mantine-color-gray-1)",
      }}
    >
      <Paper
        pos="relative"
        p={isMobile ? "sm" : "md"}
        pt="3rem"
        mih="100vh"
        w="100%"
        radius={0}
        style={{
          display: "flex",
          flexDirection: "column",

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Group
          pos="absolute"
          top="0"
          w="100%"
          p={isMobile ? "sm" : "xl"}
          justify="space-between"
        >
          <Title order={isMobile ? 3 : 1}>Flamingo.ai</Title>
          <Group gap="0">
            {user && user.hasImage ? (
              <Avatar radius="sm" src={user.imageUrl} />
            ) : (
              <Avatar radius="sm">
                {user?.firstName + " " + user?.lastName}
              </Avatar>
            )}
            <Container maw={isMobile ? "40vw" : "500"}>
              <Text fz="sm" truncate>
                {user?.firstName + " " + user?.lastName}
              </Text>
              <Text fz="xs" c="dimmed" truncate>
                {user?.emailAddresses[0]?.emailAddress}
              </Text>
            </Container>
          </Group>
        </Group>

        {active === 0 && (
          // <CreateOrganization
          //   skipInvitationScreen
          //   afterCreateOrganizationUrl={"/onboarding?step=1"}
          // />
          <CustomCreateOrganization />
        )}
        {(active === 1 || active == 2) && (
          <Card radius={"lg"} shadow="md" p="md">
            <Title order={3}>
              Connect your workspace to your OpenAI Account to{" "}
              <span
                style={{
                  color: "var(--mantine-primary-color-filled)",
                }}
              >
                start chatting
              </span>
              .
            </Title>
            <Text size="xs" c="dimmed">
              Collect your API key from the{" "}
              <Anchor
                c="dimmed"
                td="underline"
                href="https://platform.openai.com/account/api-keys"
              >
                OpenAI dashboard.
              </Anchor>
            </Text>
            <TextInput
              mt="xl"
              required
              radius="md"
              label="Enter your OpenAI API key here"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              defaultValue={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
              }}
              style={{ width: "100%" }}
            />
            <Alert
              mt="xl"
              radius="md"
              variant="light"
              title="You can always change this later in the workspace settings."
              icon={<IconInfoCircle />}
            ></Alert>
            <Group mt="md" justify="flex-end">
              <Button
                size="md"
                radius="md"
                type="submit"
                onClick={() => {
                  if (apiKeyInput) {
                    setActive(2);
                    isValidOpenAIKey(apiKeyInput).then((res) => {
                      if (res) {
                        getWorkspace(organization?.id || "").then((res) => {
                          console.log(res);
                          updateWorkspace({
                            ...res.workspace,
                            apiKeys: [
                              ...res.workspace.apiKeys.map((apiKey: any) => {
                                if (
                                  apiKey.provider == "openai" &&
                                  apiKey.scope == "public"
                                )
                                  return {
                                    ...apiKey,
                                    key: apiKeyInput,
                                  };
                                return apiKey;
                              }),
                            ],
                          }).then(() => {
                            window.history.pushState(
                              {},
                              "",
                              "/onboarding?step=3"
                            );
                          });
                        });
                      } else {
                        setActive(1);
                      }
                    });
                  } else {
                    alert("Please enter API key");
                  }
                }}
              >
                Submit
              </Button>
              <Button
                size="md"
                radius="md"
                variant="outline"
                onClick={() => {
                  window.history.pushState({}, "", "/onboarding?step=3");
                }}
              >
                Skip
              </Button>
            </Group>
          </Card>
        )}
        {active == 3 && (
          <Card radius={"lg"} shadow="md" p="md">
            <Title order={3}>
              Heads up, you&apos;re creating a{" "}
              <span
                style={{
                  color: "var(--mantine-primary-color-filled)",
                }}
              >
                Free account
              </span>{" "}
              for 2 members.
            </Title>
            <Text mt="md">Do you have more pople to invite?</Text>
            <Group mt="xl" justify="flex-end">
              <Anchor
                target="_blank()"
                href={`/workspace/${organization?.slug}/upgrade`}
              >
                <Button
                  size="md"
                  radius="md"
                  onClick={() => {
                    window.history.pushState({}, "", "/onboarding?step=4");
                  }}
                >
                  Upgrade
                </Button>
              </Anchor>
              <Button
                size="md"
                radius="md"
                variant="outline"
                onClick={() => {
                  window.history.pushState({}, "", "/onboarding?step=4");
                }}
              >
                Skip
              </Button>
            </Group>
          </Card>
        )}
        {active == 4 && (
          <Box
            style={{
              overflowY: "scroll",
            }}
          >
            <Title order={isMobile ? 2 : 1} mb="xl">
              Successfully Created{" "}
              <span
                style={{
                  color: "var(--mantine-primary-color-filled)",
                }}
              >
                {organization?.name}
              </span>
              .
            </Title>

            <Group w="100%" justify="space-between" align="center" mb="md">
              <Title order={3}>Invite people into your Workspace.</Title>
              <Anchor href={`/workspace/${organization?.slug}`}>
                <Button size="sm" radius="md">
                  Go to your workspace
                </Button>
              </Anchor>
            </Group>
            <OrganizationProfile />
          </Box>
        )}
        <Stepper
          display={isMobile ? "none" : "flex"}
          maw="90vw"
          pos="absolute"
          bottom="2rem"
          mt="3rem"
          active={active}
          size="xs"
        >
          <Stepper.Step disabled label="Create" />
          <Stepper.Step label="Setup" />
          <Stepper.Step label="Testing" loading={active == 2} />
          <Stepper.Step label="Upgrade" />
          <Stepper.Step label="Done" />
        </Stepper>
      </Paper>
      <Box
        display={isMobile || active == 4 ? "none" : "flex"}
        mih="100vh"
        w="100%"
        h="500"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {active == 0 && (
          <>
            <Title
              ta="center"
              w="70%"
              c="var(--mantine-primary-color-filled)"
              size={"3rem"}
              mb="5rem"
            >
              Create a new Workspace
            </Title>
            <Image
              w="auto"
              h="400"
              p="2rem"
              component={NextImage}
              src={create}
              alt="Create"
            />
          </>
        )}
        {(active == 1 || active == 2) && (
          <>
            <Title
              ta="center"
              w="70%"
              c="var(--mantine-primary-color-filled)"
              size={"3rem"}
              mb="5rem"
            >
              Set Up API key for your workspace.
            </Title>

            <Image
              w="auto"
              h="400"
              p="2rem"
              component={NextImage}
              src={setup}
              alt="Setup"
            />
          </>
        )}
        {active == 3 && (
          <>
            <Title ta="center" w="70%" size={"3rem"} mb="5rem">
              Upgrade your workspace to invite more people.
            </Title>
            <Image
              w="auto"
              h="400"
              p="2rem"
              component={NextImage}
              src={upgrade}
              alt="Upgrade"
            />
          </>
        )}
        {/* {active == 4 && (
          <>
            <Title ta="center" w="70%" size={"3rem"} mb="5rem">
              Successfully Created{" "}
              <span
                style={{
                  color: "var(--mantine-primary-color-filled)",
                }}
              >
                {organization?.name}
              </span>
              .
            </Title>
            <Image
              w="auto"
              h="400"
              p="2rem"
              component={NextImage}
              src={done}
              alt="Done"
            />
          </>
        )} */}
      </Box>
    </Group>
  );
}
