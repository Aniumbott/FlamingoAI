"use client";
import React, { useEffect, useState } from "react";
import HeaderMegaMenu from "./components/LandingPage/HeaderMegaMenu";
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
  Center,
  Container,
  Card,
  Slider,
  Switch,
  Anchor,
} from "@mantine/core";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
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
import { useScrollIntoView } from "@mantine/hooks";

export default function Home() {
  const [isMonthly, setIsMonthly] = useState(false);
  const [maxValue, setMaxValue] = useState(10);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 10,
  });
  const [target, setTarget] = useState("home");
  useEffect(() => {
    scrollIntoView();
  }, [target]);
  return (
    <Box>
      <HeaderMegaMenu
        active={target == "pricing" ? 1 : target == "contact-us" ? 2 : 0}
        setTarget={setTarget}
      />
      <Stack
        mt="7rem"
        mx={"10%"}
        gap={"xl"}
        align={"center"}
        justify={"center"}
      >
        <Title ref={target == "home" ? targetRef : null} order={1}>
          Intuitive GPT Chat For Your Whole Company
        </Title>
        <Title order={3} ta={"center"}>
          <div>
            <span className=" font-bold">Team-GPT </span> guarantees ChatGPT
            adoption for teams between 2 and 20,000 people.
          </div>
          <div>
            Organize knowledge, collaborate, and master AI in one shared
            workspace.
          </div>
        </Title>
        <Button rightSection={<IconArrowRight />}>Start Free </Button>
        {/* <Divider color="grey" w={"100%"} size={"xs"} /> */}
        <Title order={2}>Companies that trust us</Title>
        {/* <Divider color="grey" w={"100%"} size={"xs"} /> */}
        <FolderCard />
        <PromptLibraryCard />
        <CostSavingCard />
        <ReportsCard />
        {/* <Divider color="grey" w={"100%"} size={"xs"} /> */}
        {/* <Title order={1}>A small price to pay.. to truly Adopt AI</Title>
        <Text fz={"h2"}>
          Have pricing questions? Contact us at humans@team-gpt.com
        </Text> */}

        <Title ref={target == "pricing" ? targetRef : null} order={1}>
          Small price to pay for great collaboration
        </Title>
        <Text>30-day money back guarantee</Text>
        <Group>
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
          <FreeCard />
          <ProCard isMonthly={isMonthly} />
          <MaxCard isMonthly={isMonthly} />
        </Group>
        <Title my="xl" fw="300" ta="center">
          Have pricing questions? Contact us at{" "}
          <span style={{ color: "var(--mantine-primary-color-filled)" }}>
            <b>humans@team-gpt.com</b>
          </span>
        </Title>
        <EnterpriseCard />

        {/* <Divider color="grey" w={"100%"} size={"xs"} /> */}

        <Title order={1}>How it works?</Title>
        <HowItWorks />

        {/* <Divider color="grey" w={"100%"} size={"xs"} /> */}

        <Faq />
      </Stack>
      <Box ref={target == "contact-us" ? targetRef : null}>
        <FooterLinks />
      </Box>
    </Box>
  );
}
