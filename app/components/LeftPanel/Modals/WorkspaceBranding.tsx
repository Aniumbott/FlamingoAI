import {
  Avatar,
  Button,
  Divider,
  FileInput,
  Group,
  Input,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBuilding,
  IconCross,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";

const WorkspaceBranding = (props: { opened: boolean; setOpened: any }) => {
  const [active, setActive] = useState("workspaceBranding");
  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      centered
      radius={"md"}
      padding={20}
      size={"80%"}
    >
      <Group
        align="flex-start"
        wrap="nowrap"
        w={"100%"}
        gap={1}
        grow
        preventGrowOverflow={false}
      >
        <Stack w={"30%"}>
          <Group>
            <IconBuilding size={30} />
            <Text>Poorvank's Workspace</Text>
          </Group>
          <Button
            variant="transparent"
            color="white"
            fullWidth
            w={"fit-content"}
            leftSection={<IconSettings />}
          >
            Workspace Branding
          </Button>
        </Stack>
        <Divider orientation="vertical" w={"1"} />
        {active === "workspaceBranding" ? (
          <Stack gap={30} h={"70vh"}>
            <Stack gap={10}>
              <Title>Workspace Branding</Title>
              <Text>Manage workspace brand details</Text>
            </Stack>
            <Stack>
              <Title order={4}>Edit Workspace</Title>
              <Button
                justify="space-between"
                variant="transparent"
                size="lg"
                styles={{
                  label: {
                    flexGrow: 1,
                  },
                }}
                fullWidth
                leftSection={<IconBuilding color="white" size={50} />}
                color="#05a87a"
                onClick={()=>setActive("workspaceEdit")}
              >
                Poorvank Workspace
              </Button>
            </Stack>
            <Stack>
              <Title order={5}>Danger</Title>
              <Group gap={10} wrap="nowrap">
                <Button
                  variant="outline"
                  color="red"
                  fullWidth
                  w={"fit-content"}
                  leftSection={<IconX color="red" />}
                >
                  Leave Workspace
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  fullWidth
                  w={"fit-content"}
                  leftSection={<IconX color="red" />}
                >
                  Delete Workspace
                </Button>
              </Group>
            </Stack>
          </Stack>
        ) : (
          <EditWorkspace setActive={setActive} />
        )}
      </Group>
    </Modal>
  );
};

const EditWorkspace = (props: { setActive: any }) => {
  return (
    <Stack gap={25} w={'50%'} h={"70vh"}>
      <Title order={1}>
        Update Profile
      </Title>
      <Group>
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
      <Input.Wrapper size="xs" label="First Name">
        <Input
          placeholder="Enter first name"
          defaultValue="Aniket"
          mt={5}
          radius={0}
          autoFocus={true}
        />
      </Input.Wrapper>
      <Input.Wrapper size="xs" label="Last Name">
        <Input
          placeholder="Enter last name"
          defaultValue="Rana"
          mt={5}
          radius={0}
        />
      </Input.Wrapper>
      <Group w="100%" justify="flex-end" >
        <Button
          variant="subtle"
          radius={0}
          color="teal"
          onClick={() => {
            props.setActive("workspaceBranding");
          }}
        >
          CANCEL
        </Button>
        <Button color="teal" variant="filled" radius={0}>
          CONTINUE
        </Button>
      </Group>
    </Stack>
  );
};

export default WorkspaceBranding;
