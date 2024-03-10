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
import qr from "@/public/demoQR.png";
import Image from "next/image";

export default function AddTwoFactor(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "addTwoFactor" ? "block" : "none"}
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
        <Text ml={5}> / &nbsp; Add authenticator application </Text>
      </Group>
      <Title order={1} mt={40}>
        Add authenticator application
      </Title>
      <Text size="sm" mt={20}>
        Set up a new sign-in method in your authenticator app and scan the
        following QR code to link it to your account.
      </Text>
      <Image
        src={qr}
        alt="QR code"
        height={200}
        style={{ marginTop: "1rem" }}
      />

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
