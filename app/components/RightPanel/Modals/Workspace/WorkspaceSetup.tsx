import { getWorkspace, updateWorkspace } from "@/app/controllers/Workspace";
import { useOrganization } from "@clerk/nextjs";
import { Group, Paper, Text, Switch } from "@mantine/core";
import { useEffect, useState } from "react";

export default function WorkspaceSetup(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const [workspace, setWorkspace] = useState<any>(null);
  const { organization } = useOrganization();
  const { activeTab, setActiveTab } = props;

  useEffect(() => {
    if (organization?.id) {
      const fetchWorkspace = async () => {
        const res = await getWorkspace(organization.id);
        // console.log(res);
        setWorkspace(res.workspace);
      };
      fetchWorkspace();
    }
  }, [organization?.id]);

  useEffect(() => {
    if (workspace?._id) {
      const update = async () => {
        await updateWorkspace(workspace._id, workspace);
        // console.log(res);
      };
      update();
    }
  }, [workspace]);

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
            defaultChecked={workspace?.allowPersonal || true}
            onChange={(e) => {
              setWorkspace({
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
            defaultChecked={workspace?.allowPublic || true}
            onChange={(e) => {
              setWorkspace({
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
