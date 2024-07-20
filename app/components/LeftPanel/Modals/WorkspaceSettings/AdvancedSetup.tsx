import { updateWorkspace } from "@/app/controllers/workspace";
import { Group, Paper, Text, Button, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

export default function AdvancedSetup(props: {
  activeTab: string;
  setActiveTab: (value: string) => void;
  workspace: any;
}) {
  const { activeTab, setActiveTab, workspace } = props;
  const [areaValue, setAreaValue] = useState(
    "You are a large language model trained to provide helpful and informative responses. Please follow the user's instructions carefully and generate responses using markdown. Be specific, provide context when needed, and support your answers with sources or explanations when requested. If the initial response doesn't meet the user's expectations, iterate and try again. Avoid sharing personal, identifying, or sensitive information in your responses. Stay focused on providing accurate and reliable information to the best of your abilities."
  );

  useEffect(() => {
    if (workspace?.instructions) {
      setAreaValue(workspace?.instructions);
    }
  }, [workspace]);

  return (
    <Paper
      style={{ height: "100%", overflowY: "scroll" }}
      display={activeTab === "advancedSetup" ? "block" : "none"}
    >
      <div style={{ padding: "3rem 2rem" }}>
        <Text size="lg" fw={600}>
          Custom Instructions (workspace wide)
        </Text>

        <Text mt={20} size="xs" c="dimmed">
          Use this initial message to establish the framework for your prompts,
          providing necessary context or background information to guide the
          subsequent responses.
        </Text>
        <Text mt={10} size="xs" c="dimmed">
          The custom instructions are applied only for <b>new chats</b>.
        </Text>
        <Textarea
          mt={10}
          value={areaValue}
          onChange={(event) => setAreaValue(event.currentTarget.value || "")}
          required
        />
        <Group mt={20} justify="space-between">
          {areaValue.length == 0 ? (
            <Button
              variant="outline"
              onClick={() => {
                setAreaValue(
                  "You are a large language model trained to provide helpful and informative responses. Please follow the user's instructions carefully and generate responses using markdown. Be specific, provide context when needed, and support your answers with sources or explanations when requested. If the initial response doesn't meet the user's expectations, iterate and try again. Avoid sharing personal, identifying, or sensitive information in your responses. Stay focused on providing accurate and reliable information to the best of your abilities."
                );
              }}
            >
              Reset
            </Button>
          ) : null}
          <Button
            onClick={() => {
              updateWorkspace({ ...workspace, instructions: areaValue });
            }}
          >
            Save
          </Button>
        </Group>
      </div>
    </Paper>
  );
}
