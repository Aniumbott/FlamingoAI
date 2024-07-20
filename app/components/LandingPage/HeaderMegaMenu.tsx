"use client";
import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Center,
  Box,
  Burger,
  Drawer,
  Collapse,
  ScrollArea,
  rem,
  useMantineTheme,
  Anchor,
  Title,
} from "@mantine/core";
// import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import classes from "./HeaderMegaMenu.module.css";
import {
  OrganizationSwitcher,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
export default function HeaderMegaMenu(props: {
  active: number;
  setTarget: (target: string) => void;
}) {
  const { active, setTarget } = props;
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { isSignedIn } = useUser();
  const isMobile = useMediaQuery(`(max-width: 48em)`);

  return (
    <Box
      style={{
        position: "fixed",
        width: "100vw",
        top: 0,
        background: "var(--mantine-color-white)",
        boxShadow: "var(--mantine-shadow-xl)",
        zIndex: 1000,
      }}
    >
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}
          <Link
            href="#home"
            onClick={() => {
              setTarget("home");
            }}
          >
            <Text size="xl" fw={500}>
              Flamingo.ai
            </Text>
          </Link>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Anchor
              c={active == 0 ? "var(--mantine-primary-color-filled)" : ""}
              href="#home"
              onClick={() => {
                setTarget("home");
              }}
              className={classes.link}
            >
              Home
            </Anchor>
            <Anchor
              c={active == 1 ? "var(--mantine-primary-color-filled)" : ""}
              href="#pricing"
              onClick={() => {
                setTarget("pricing");
              }}
              className={classes.link}
            >
              Pricing
            </Anchor>
            <Anchor
              c={active == 2 ? "var(--mantine-primary-color-filled)" : ""}
              href="#contact-us"
              onClick={() => {
                setTarget("contact-us");
              }}
              className={classes.link}
            >
              Contact Us
            </Anchor>
          </Group>

          {isSignedIn ? (
            <Group>
              <UserButton afterSignOutUrl="/" />
              <Divider orientation="vertical" />
              <Anchor href="/workspace">
                <Button
                  variant="outline"
                  rightSection={<IconArrowUpRight size={20} />}
                >
                  Workspace
                </Button>
              </Anchor>
            </Group>
          ) : (
            <Group visibleFrom="sm">
              <SignInButton>
                <Button variant="default">Log in</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign up</Button>
              </SignUpButton>
            </Group>
          )}

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        position="right"
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Drawer.Title p="sm">
          <Group justify="space-between">
            <Title order={3}>Navigation</Title>
          </Group>
        </Drawer.Title>
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Anchor
            c={active == 0 ? "var(--mantine-primary-color-filled)" : ""}
            href="#home"
            onClick={() => {
              setTarget("home");
            }}
            className={classes.link}
          >
            Home
          </Anchor>
          <Anchor
            c={active == 1 ? "var(--mantine-primary-color-filled)" : ""}
            href="#pricing"
            onClick={() => {
              setTarget("pricing");
            }}
            className={classes.link}
          >
            Pricing
          </Anchor>
          <Anchor
            c={active == 2 ? "var(--mantine-primary-color-filled)" : ""}
            href="#contact-us"
            onClick={() => {
              setTarget("contact-us");
            }}
            className={classes.link}
          >
            Contact Us
          </Anchor>

          <Divider my="sm" />

          {!isSignedIn && (
            <Group justify="center" grow pb="xl" px="md">
              <SignInButton>
                <Button variant="default">Log in</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign up</Button>
              </SignUpButton>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
