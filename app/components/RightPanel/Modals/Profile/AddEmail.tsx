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

export default function AddEmail(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "addEmail" ? "block" : "none"}
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
        <Text ml={5}> / &nbsp; Add email address </Text>
      </Group>
      <Title order={1} mt={40}>
        Add email address
      </Title>

      <Input.Wrapper mt={20} size="xs" label="Email Address">
        <Input
          placeholder="Enter email address"
          defaultValue="Aniket"
          mt={5}
          radius={0}
        />
      </Input.Wrapper>
      <Text size="sm" mt={20}>
        An email containing a verification link will be sent to this email
        address.
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
