import {
  Group,
  Paper,
  Anchor,
  Text,
  rem,
  Button,
  Title,
  Avatar,
  FileInput,
  Input,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

export default function RemoveEmail(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "removeEmail" ? "block" : "none"}
    >
      <Group gap={0}>
        <Button
          variant="subtle"
          size="compact-xs"
          radius="xl"
          color="gray"
          leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => {
            props.setActive("home");
          }}
        >
          <Text>Account</Text>
        </Button>
        <Text ml={5}> / &nbsp; Remove email address </Text>
      </Group>
      <Title order={1} mt={40}>
        Remove email address
      </Title>
      <Text size="sm" mt={20}>
        aniketrana@gmail.com will be removed from this account.
      </Text>
      <Text size="sm" mt={20}>
        You will no longer be able to sign in using this email address.
      </Text>
      <Group w="100%" justify="flex-end" mt={30}>
        <Button
          variant="subtle"
          radius={0}
          color="teal"
          onClick={() => {
            props.setActive("home");
          }}
        >
          CANCEL
        </Button>
        <Button color="teal" variant="filled" radius={0}>
          CONTINUE
        </Button>
      </Group>
    </Paper>
  );
}
