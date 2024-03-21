import {
  Autocomplete,
  Group,
  rem,
  ActionIcon,
  Title,
  Button,
} from "@mantine/core";
import {
  IconSearch,
  IconLayoutSidebarLeftExpand,
  IconUsersPlus,
  IconRocket,
} from "@tabler/icons-react";
import classes from "./HeaderSearch.module.css";
import WorkspaceBranding from "./LeftPanel/Modals/WorkspaceBranding";
import { useState } from "react";
import { OrganizationProfile } from "@clerk/nextjs";
import InvitePeople from "./LeftPanel/Modals/InvitePeople";

export default function NavigationBar(props: {
  leftOpened: boolean;
  toggleLeft: () => void;
}) {
  const { leftOpened, toggleLeft } = props;
  const [open, setOpen] = useState(false);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          {!leftOpened ? (
            <Group>
              <Title order={4}>TeamGPT</Title>
              <ActionIcon
                variant="subtle"
                color="grey"
                aria-label="Settings"
                onClick={toggleLeft}
              >
                <IconLayoutSidebarLeftExpand
                  style={{ width: "90%", height: "90%" }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          ) : (
            <></>
          )}

          <Autocomplete
            variant="unstyled"
            className={classes.search}
            placeholder="Search"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
        </Group>
        <Group style={{ marginRight: "3rem" }}>
          <Button
            leftSection={<IconUsersPlus size={20} />}
            variant="subtle"
            color="grey"
            radius="md"
            onClick={() => setOpen(true)}
          >
            Invite
          </Button>
          <Button
            leftSection={<IconRocket size={20} />}
            variant="subtle"
            color="grey"
            radius="md"
          >
            Upgrade
          </Button>
        </Group>
      </div>
      <InvitePeople opened={open} setOpened={setOpen} />
    </header>
  );
}
