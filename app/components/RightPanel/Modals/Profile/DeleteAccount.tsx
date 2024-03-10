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
import { IconShieldCheckFilled } from "@tabler/icons-react";

export default function DeleteAccount(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "deleteAccount" ? "block" : "none"}
    >
      <Group gap={0}>
        <Button
          variant="subtle"
          size="compact-xs"
          radius="xl"
          color="gray"
          leftSection={
            <IconShieldCheckFilled
              style={{ width: rem(14), height: rem(14) }}
            />
          }
          onClick={() => {
            props.setActive("home");
          }}
        >
          <Text>Security</Text>
        </Button>
        <Text ml={5}> / &nbsp; Delete Account </Text>
      </Group>
      <Title order={1} mt={40}>
        Delete Account
      </Title>

      <Text size="sm" mt={20}>
        Are you sure you want to delete your account?
      </Text>
      <Text size="sm" mt={20}>
        This action is permanent and irreversible.
      </Text>
      <Text size="sm" mt={20}>
        Type Delete account below to continue.
      </Text>
      <Input.Wrapper mt={20} size="xs" label="Confirmation">
        <Input placeholder="Delete Account" mt={5} radius={0} />
      </Input.Wrapper>
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
          DELETE ACCOUNT
        </Button>
      </Group>
    </Paper>
  );
}
