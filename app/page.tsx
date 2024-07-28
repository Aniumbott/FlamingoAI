"use client";
import React, { useEffect, useRef, useState } from "react";
import HeaderMegaMenu from "./components/LandingPage/HeaderMegaMenu";
import {
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Switch,
  useMantineColorScheme,
  Image,
  Paper,
  Divider,
  Anchor,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { FooterLinks } from "./components/LandingPage/FooterLinks";
import FreeCard from "./components/LandingPage/pricing/freeCard";
import ProCard from "./components/LandingPage/pricing/proCard";
import MaxCard from "./components/LandingPage/pricing/maxCard";
import EnterpriseCard from "./components/LandingPage/pricing/enterpriseCard";
import HowItWorks from "./components/LandingPage/home/HowItWorks";
import Faq from "./components/LandingPage/home/Faq";
import ReportsCard from "./components/LandingPage/home/ReportsCard";
import PromptLibraryCard from "./components/LandingPage/home/PromptLibraryCard";
import FolderCard from "./components/LandingPage/home/FolderCard";
import CostSavingCard from "./components/LandingPage/home/CostSavingCard";
import { useMediaQuery, useQueue, useScrollIntoView } from "@mantine/hooks";
import NextImage from "next/image";

import merask from "@/public/Maersk-Logo.webp";
import jhons from "@/public/Johns-Hopkins-Logo.webp";
import polk from "@/public/Polkastarter-Logo.webp";
import medesk from "@/public/Medesk-Logo.webp";
import charles from "@/public/Charles-Schwab-Logo.webp";
import limechain from "@/public/Limechain-Logo.webp";
import shift4 from "@/public/Shift-4-Logo.webp";
import { streamTest } from "./controllers/aiModel";

export default function Home() {
  const [isMonthly, setIsMonthly] = useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const previousColorScheme = colorScheme;
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 50,
  });
  const [target, setTarget] = useState("home");
  const isMobile = useMediaQuery("(max-width: 48em)");
  useEffect(() => {
    scrollIntoView();
  }, [target]);

  useEffect(() => {
    if (previousColorScheme == "dark") {
      setColorScheme("light");
    }
    return localStorage.setItem(
      "mantine-color-scheme-value",
      previousColorScheme
    );
  }, []);

  return (
    colorScheme === "light" && (
      <Box bg="var(--mantine-color-gray-1)">
        <HeaderMegaMenu
          active={target == "pricing" ? 1 : target == "contact-us" ? 2 : 0}
          setTarget={setTarget}
        />
        <Stack
          m={"auto"}
          p="xl"
          maw="1200px"
          align={"center"}
          justify={"center"}
        >
          <Paper
            ref={target == "home" ? targetRef : null}
            w="100vw"
            px="1rem"
            py="5rem"
            radius="0"
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Title
              w="calc(min(1000px, 100%))"
              mt={"calc(2rem + 5vw)"}
              ta="center"
              size={"4rem"}
            >
              Intuitive GPT chat for your{" "}
              <span
                style={{
                  padding: "0.5rem 1rem",
                  color: "white",
                  background: "var(--mantine-primary-color-filled)",
                }}
              >
                whole
              </span>{" "}
              company
            </Title>
            <Text mt="xl" size="lg" ta={"center"}>
              <div>
                <b>Flamingo.ai </b> guarantees ChatGPT adoption for teams
                between 2 and 20,000 people.
              </div>
              <div>
                Organize knowledge, collaborate, and master AI in one shared
                workspace.
              </div>
            </Text>
            {/* <Button onClick={() => streamTest()}>Click me</Button> */}
            <Anchor href="/workspace">
              <Button
                size="xl"
                mt="3rem"
                radius={"lg"}
                rightSection={<IconArrowRight />}
              >
                Start Free{" "}
              </Button>
            </Anchor>

            <Text mt="5rem">
              {" "}
              👇 See how Flamingo.ai works. Click the ‘Continue‘ button below
              for a guided tour! 👇
            </Text>
            <Image
              mt="3rem"
              radius="md"
              width="auto"
              fit="contain"
              maw={1100}
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
              alt=""
            />
          </Paper>
          {/* -------------------------------------------------------------------------------------------- */}

          <Title ta="center" mt="5rem" order={1}>
            Companies that trust us
          </Title>

          <Group
            gap={"3rem"}
            pt="lg"
            justify="center"
            style={{
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            {[merask, jhons, polk, medesk, charles, limechain, shift4].map(
              (e, id) => (
                <Image
                  mah={"1.5em"}
                  w="auto"
                  component={NextImage}
                  alt="sponsor"
                  src={e}
                  key={id}
                ></Image>
              )
            )}
          </Group>

          {/* -------------------------------------------------------------------------------------------- */}
          {/* <Divider w="100vw" variant="dashed" size={"sm"} /> */}
          <FolderCard />
          <Divider w="100vw" variant="dashed" size={"sm"} />
          <PromptLibraryCard />
          <Divider w="100vw" variant="dashed" size={"sm"} />
          <CostSavingCard />
          <Divider w="100vw" variant="dashed" size={"sm"} />
          <ReportsCard />
          {/* <Divider w="100vw" variant="dashed" size={"sm"} /> */}

          {/* -------------------------------------------------------------------------------------------- */}
          <Paper
            ref={target == "pricing" ? targetRef : null}
            mt="5rem"
            w="100vw"
            px="1rem"
            py="5rem"
            radius="0"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
            }}
          >
            <Title ta="center" order={1}>
              A small price to pay.. to truly{" "}
              <span
                style={{
                  padding: "0.2rem 0.5rem",
                  color: "white",
                  background: "var(--mantine-primary-color-filled)",
                }}
              >
                Adopt AI
              </span>
            </Title>
            <Text ta="center" mt="md">
              30-day money back guarantee
            </Text>
            <Group mt="lg" justify="center">
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
            <Group gap={"3rem"} my="xl" justify="center">
              <FreeCard />
              <ProCard isMonthly={isMonthly} />
              <MaxCard isMonthly={isMonthly} />
            </Group>
            <Title order={2} my="xl" fw="300" ta="center">
              Have pricing questions? Contact us at{" "}
              <span style={{ color: "var(--mantine-primary-color-filled)" }}>
                <b>humans@flamingo.ai</b>
              </span>
            </Title>

            <EnterpriseCard />
          </Paper>

          {/* -------------------------------------------------------------------------------------------- */}
          <Title mt="5rem" order={1}>
            How it works?
          </Title>
          <HowItWorks />

          {/* <Divider color="grey" w={"100%"} size={"xs"} /> */}

          <Faq />
        </Stack>
        <Box ref={target == "contact-us" ? targetRef : null}>
          <FooterLinks />
        </Box>
      </Box>
    )
  );
}
