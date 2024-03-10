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
import Image from "next/image";
import google from "@/public/google.svg";

export default function AddConnected(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "addConnected" ? "block" : "none"}
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
        <Text ml={5}> / &nbsp; Add connected account </Text>
      </Group>
      <Title order={1} mt={40}>
        Add connected account
      </Title>
      <Text size="sm" mt={20}>
        Select a provider to connect your account.
      </Text>

      <Button
        variant="outline"
        color="grey"
        radius={0}
        mt={20}
        fullWidth
        justify="flex-start"
        size="md"
        leftSection={<Image src={google} alt="Google" width={20} height={20} />}
      >
        Connect google account
      </Button>
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
      </Group>
    </Paper>
  );
}
