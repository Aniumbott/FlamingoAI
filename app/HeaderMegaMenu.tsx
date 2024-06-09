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
} from "@mantine/core";
// import { MantineLogo } from '@mantinex/mantine-logo';
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderMegaMenu.module.css";

export default function HeaderMegaMenu(props: { active: number }) {
  const { active } = props;
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}
          <Text size="xl" fw={500}>
            Logo
          </Text>

          <Group h="100%" gap={0} visibleFrom="sm">
            <Anchor
              c={active == 0 ? "var(--mantine-primary-color-filled)" : ""}
              href="/"
              className={classes.link}
            >
              Home
            </Anchor>
            <Anchor
              c={active == 1 ? "var(--mantine-primary-color-filled)" : ""}
              href="/pricing"
              className={classes.link}
            >
              Pricing
            </Anchor>
            <Anchor
              c={active == 2 ? "var(--mantine-primary-color-filled)" : ""}
              href="#"
              className={classes.link}
            >
              Contact Us
            </Anchor>
          </Group>

          <Group visibleFrom="sm">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />

          <Anchor
            c={active == 0 ? "var(--mantine-primary-color-filled)" : ""}
            href="/"
            className={classes.link}
          >
            Home
          </Anchor>
          <Anchor
            c={active == 1 ? "var(--mantine-primary-color-filled)" : ""}
            href="/pricing"
            className={classes.link}
          >
            Pricing
          </Anchor>
          <Anchor
            c={active == 2 ? "var(--mantine-primary-color-filled)" : ""}
            href="#"
            className={classes.link}
          >
            Contact Us
          </Anchor>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            <Button variant="default">Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
