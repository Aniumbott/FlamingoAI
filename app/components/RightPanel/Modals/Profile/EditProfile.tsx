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

export default function EditProfile(props: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <Paper
      className="h-100"
      p={30}
      display={props.active == "profileUpdate" ? "block" : "none"}
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
        <Text ml={5}> / &nbsp; Update Profile </Text>
      </Group>
      <Title order={1} mt={40}>
        Update Profile
      </Title>
      <Group mt={40}>
        <Avatar size={50} color="green" radius="xl">
          AR
        </Avatar>
        <div>
          <Text size="sm" fw={600}>
            Profile Image
          </Text>
          <FileInput
            accept="image/png,image/jpeg"
            placeholder="Upload Image"
            variant="unstyled"
          />
        </div>
      </Group>
      <Input.Wrapper mt={20} size="xs" label="First Name">
        <Input
          placeholder="Enter first name"
          defaultValue="Aniket"
          mt={5}
          radius={0}
        />
      </Input.Wrapper>
      <Input.Wrapper mt={20} size="xs" label="Last Name">
        <Input
          placeholder="Enter last name"
          defaultValue="Rana"
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
