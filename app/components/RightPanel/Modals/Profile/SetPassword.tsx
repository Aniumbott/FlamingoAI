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

export default function SetPassword(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "setPassword" ? "block" : "none"}
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
        <Text ml={5}> / &nbsp; Set password </Text>
      </Group>
      <Title order={1} mt={40}>
        Set Password
      </Title>

      <Input.Wrapper
        mt={20}
        size="xs"
        label="New Password"
        error="Your password must contain 8 or more characters."
      >
        <Input
          placeholder="Enter new password"
          defaultValue="Aniket"
          mt={5}
          radius={0}
          type="password"
        />
      </Input.Wrapper>
      <Input.Wrapper
        mt={20}
        size="xs"
        label="Confirm password"
        error="Passwords don't match."
      >
        <Input
          placeholder="Confirm new password"
          defaultValue="Rana"
          type="password"
          mt={5}
          radius={0}
        />
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
          CONTINUE
        </Button>
      </Group>
    </Paper>
  );
}
