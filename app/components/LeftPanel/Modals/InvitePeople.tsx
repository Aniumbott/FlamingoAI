import { OrganizationProfile } from "@clerk/nextjs";
import {
  ActionIcon,
  Avatar,
  Breadcrumbs,
  Button,
  Divider,
  Group,
  MenuDropdown,
  Modal,
  NativeSelect,
  Pill,
  PillsInput,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDots,
  IconUser,
  IconUserPlus,
  IconUsersPlus,
} from "@tabler/icons-react";
import React, { use, useState } from "react";

const MembersData = [
  {
    user: { name: "Aniket Rana", email: "aniket@gmail.com" },
    dateJoined: "15/07/2021",
    role: "Admin",
  },
  {
    user: { name: "Poorvank Shah", email: "poorvank@gmail.com" },
    dateJoined: "13/05/2020",
    role: "Admin",
  },
];

const InvitationData = [
  {
    email: "hello@gmail.com",
    dateInvited: "15/07/2021",
    role: "Admin",
  },
  {
    email: "test@gmail.com",
    dateInvited: "15/07/2021",
    role: "Member",
  },
];

const InvitePeople = (props: { opened: boolean; setOpened: any }) => {
  const [active, setActive] = useState("members");
  return (
    <Modal
      opened={props.opened}
      onClose={() => props.setOpened(false)}
      centered
      withCloseButton={false}
      radius={"md"}
      // padding={20}
      size={"80%"}
    >
      <OrganizationProfile  />
    </Modal>

    // <Modal
    //   opened={props.opened}
    //   onClose={() => props.setOpened(false)}
    //   centered
    //   radius={"md"}
    //   padding={20}
    //   size={"80%"}
    // >
    //   {active === "inviteform" ? (
    //     <InviteForm setActive={setActive} />
    //   ) : (
    //     <Stack gap={15} h={"70vh"}>
    //       <Stack gap={1}>
    //         <Title>Members</Title>
    //         <Text>View and manage workspace members</Text>
    //       </Stack>
    //       <Stack gap={0}>
    //         <Group>
    //           <Button
    //             variant="transparent"
    //             onClick={() => setActive("members")}
    //             style={
    //               active === "members"
    //                 ? { borderBottom: "2px solid white", color: "white" }
    //                 : { color: "#C9C9C9" }
    //             }
    //             radius={0}
    //           >
    //             Members
    //           </Button>
    //           <Button
    //             variant="transparent"
    //             onClick={() => setActive("invitations")}
    //             style={
    //               active === "invitations"
    //                 ? { borderBottom: "2px solid white", color: "white" }
    //                 : { color: "#C9C9C9" }
    //             }
    //             radius={0}
    //           >
    //             Invitation
    //           </Button>
    //         </Group>
    //         <Divider />
    //       </Stack>
    //       {active === "members" ? (
    //         <MembersTable />
    //       ) : (
    //         <InvitationsTable setActive={setActive} />
    //       )}
    //     </Stack>
    //   )}
    // </Modal>
  );
};

const InviteForm = (props: { setActive: any }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState<string>("Member");
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };
  const isValidEmail = (email: string) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  };

  return (
    <Stack gap={15} h={"70vh"}>
      <Breadcrumbs>
        <Button
          variant="default"
          c={"#C9C9C9"}
          px={5}
          onClick={() => props.setActive("members")}
        >
          <IconUser />
          Members
        </Button>
        <Button variant="subtle" c={"white"} p={0}>
          Invite Members
        </Button>
      </Breadcrumbs>
      <Stack gap={1}>
        <Title>Invite members</Title>
        <Text fz={"sm"}>Invite new members to this workspace</Text>
      </Stack>
      <PillsInput
        label="Email addresses"
        description="Enter or paste one or more email addresses, separated by spaces or commas"
        multiline={true}
        error={error}
        // inputMode="email"
      >
        <Pill.Group>
          {emails.map((email, index) => (
            <Pill
              key={index}
              withRemoveButton={true}
              onRemove={() => handleRemoveEmail(index)}
            >
              {email}
            </Pill>
          ))}
          <PillsInput.Field
            pointer={true}
            placeholder="Enter email"
            inputMode="email"
            value={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (isValidEmail(inputValue)) {
                  setEmails([...emails, inputValue]);
                  setInputValue("");
                  setError(null);
                } else {
                  setError("Invalid email format");
                }
              }
            }}
          />
        </Pill.Group>
      </PillsInput>
      <NativeSelect
        label="Role"
        value={role}
        data={["Member", "Admin"]}
        onChange={(event) => setRole(event.currentTarget.value)}
        w={"30%"}
      />
      <Group gap={5} justify="flex-end">
        <Button variant="default" onClick={() => props.setActive("members")}>
          Cancel
        </Button>
        <Button
          variant="filled"
          disabled={emails.length === 0}
          color="teal"
          onClick={() => {
            // Add any additional logic for the Button click here
          }}
        >
          <Text fz={"xs"}>SEND INVITATION</Text>
        </Button>
      </Group>
    </Stack>
  );
};

const MembersTable = () => {
  return (
    <>
      <Table layout="auto">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={"50%"}>Users</Table.Th>
            <Table.Th>Date Joined</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th align="center">Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {MembersData.map((member, index) => (
            <Table.Tr key={index}>
              <Table.Td>{User(member.user)}</Table.Td>
              <Table.Td>{member.dateJoined}</Table.Td>
              <Table.Td>
                <NativeSelect
                  data={["Admin", "Member"]}
                  defaultValue={member.role}
                />
              </Table.Td>
              <Table.Td align="center">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  aria-label="Sort"
                  color="#9CA3AF"
                  style={{
                    "--ai-hover-color": "white",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    // Add any additional logic for the ActionIcon click here
                  }}
                >
                  <IconDots />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Divider />
      <Group justify="space-between">
        <Text fz={"sm"}>
          Displaying <span className="font-medium text-white">1-2</span> of 2{" "}
        </Text>
        <Group gap={5} wrap="nowrap">
          <Button variant="default">Previous</Button>
          <Button variant="default" color="white">
            1
          </Button>
          <Button variant="default">Next</Button>
        </Group>
      </Group>
    </>
  );
};
const InvitationsTable = (props: { setActive: any }) => {
  return (
    <>
      <Group mt={10} justify="space-between">
        <Stack gap={3}>
          <Text fz={"lg"} c="white">
            Individual Invitation{" "}
          </Text>
          <Text>Manually invite members and manage existing invitations.</Text>
        </Stack>
        <Button
          variant="filled"
          color="teal"
          radius="sm"
          leftSection={<IconUserPlus />}
          onClick={() => props.setActive("inviteform")}
        >
          <Text fz={"xs"}>INVITE</Text>
        </Button>
      </Group>
      <Table layout="auto">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={"50%"}>User</Table.Th>
            <Table.Th>Invited</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {InvitationData.map((member, index) => (
            <Table.Tr key={index}>
              <Table.Td>{member.email}</Table.Td>
              <Table.Td>{member.dateInvited}</Table.Td>
              <Table.Td>{member.role}</Table.Td>
              <Table.Td align="center">
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  aria-label="Sort"
                  color="#9CA3AF"
                  style={{
                    "--ai-hover-color": "white",
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    // Add any additional logic for the ActionIcon click here
                  }}
                >
                  <IconDots />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Divider />
      <Group justify="space-between">
        <Text fz={"sm"}>
          Displaying <span className="font-medium text-white">1-2</span> of 2{" "}
        </Text>
        <Group gap={5} wrap="nowrap">
          <Button variant="default" size="sm">
            Previous
          </Button>
          <Button variant="default" color="white">
            1
          </Button>
          <Button variant="default">Next</Button>
        </Group>
      </Group>
    </>
  );
};

const User = (props: { name: string; email: string }) => (
  <Group>
    <Avatar style={{ margin: "0.3rem" }} color="green" radius="sm"></Avatar>
    <Stack gap={1}>
      <Text c="white" fw={600} fz={"md"}>
        {props.name}
      </Text>
      <Text>{props.email}</Text>
    </Stack>
  </Group>
);

export default InvitePeople;
