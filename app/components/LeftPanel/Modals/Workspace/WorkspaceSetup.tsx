import { updateWorkspace } from "@/app/controllers/workspace";
import { useOrganization } from "@clerk/nextjs";
import { Group, Paper, Text, Switch } from "@mantine/core";
import { useEffect, useState } from "react";

export default function WorkspaceSetup(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  workspace: any;
}) {
  const { activeTab, setActiveTab, workspace } = props;
  return (
    <Paper
      style={{ height: "100%", overflowY: "scroll" }}
      display={activeTab === "workspaceSetup" ? "block" : "none"}
    >
      <div style={{ padding: "3rem 2rem" }}>
        <Text size="lg" fw={600}>
          Global chat settings
        </Text>
        <Group mt={30} justify="space-between">
          <div>
            <Text size="md" fw={600}>
              Personal Chat
            </Text>
            <Text size="xs" c="dimmed">
              Allow team members to creat personal chat
            </Text>
          </div>
          <Switch
            color="teal"
            size="md"
            defaultChecked={workspace?.allowPersonal}
            onChange={(e) => {
              updateWorkspace({
                ...workspace,
                allowPersonal: e.currentTarget.checked,
              });
            }}
          />
        </Group>
        <Group mt={20} justify="space-between">
          <div>
            <Text size="md" fw={600}>
              Public Chat
            </Text>
            <Text size="xs" c="dimmed">
              Allow team members to share chats publicaly.
            </Text>
          </div>
          <Switch
            color="teal"
            size="md"
            defaultChecked={workspace?.allowPublic}
            onChange={(e) => {
              updateWorkspace({
                ...workspace,
                allowPublic: e.currentTarget.checked,
              });
            }}
          />
        </Group>
      </div>
    </Paper>
  );
}
