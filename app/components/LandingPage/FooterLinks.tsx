import {
  Text,
  Container,
  ActionIcon,
  Group,
  rem,
  Button,
  Anchor,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconArrowRight,
} from "@tabler/icons-react";
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from "./FooterLinks.module.css";
import { Label } from "recharts";

const data = [
  {
    title: "Features",
    links: [
      { label: "Team-GPT Enterprise", link: "#" },
      { label: "Collaborative AI", link: "#" },
      { label: "Use prompt templates", link: "#" },
      { label: "Share chat results", link: "#" },
      { label: "Edit & Delete messages", link: "#" },
      { label: "Fork conversations", link: "#" },
    ],
  },
  {
    title: "Popular Articles",
    links: [
      { label: "10 Best AI Tools for Education", link: "#" },
      { label: "10 Best AI Marketing Tools", link: "#" },
      { label: "Team-GPT vs ChatGPT", link: "#" },
      { label: "Team-GPT vs Microsoft Copilot", link: "#" },
      { label: "Team-GPT vs Google Gemini", link: "#" },
      { label: "Team-GPT vs Perplexity Enterprise", link: "#" },
      { label: "Team-GPT vs Langdock", link: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Get in touch", link: "#" },
      { label: "Careers", link: "#" },
      { label: "Legal", link: "#" },
      { label: "Privacy policy", link: "#" },
      { label: "Terms of use", link: "#" },
      { label: "Cookie notice", link: "#" },
    ],
  },
];

export function FooterLinks() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<"a">
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          {/* <MantineLogo size={30} /> */}
          <Text size="xl" fw={500}>
            Logo
          </Text>
          <Text size="xs" c="dimmed" className={classes.description}>
            Can you afford to skip on AI adoption?
          </Text>
          <Anchor href="/workspace">
            <Button size="lg" radius={"md"} rightSection={<IconArrowRight />}>
              Start Free
            </Button>
          </Anchor>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2020 teamGPT.dev. All rights reserved.
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
