import { Button, Modal, rem, Paper } from "@mantine/core";

import { useEffect, useState } from "react";
import ChatAuth from "./ChatAuth";
import WorkspaceSetup from "./WorkspaceSetup";
import AdvancedSetup from "./AdvancedSetup";

export default function WorkspaceSettings(props: {
  opened: boolean;
  setOpened: any;
  workspace: any;
}) {
  const { opened, setOpened, workspace } = props;

  const tabs = [
    { value: "chatAuth", label: "Chat Authentication" },
    { value: "workspaceSetup", label: "Workspace Setup" },
    { value: "advancedSetup", label: "Advanced Setup" },
  ];

  const [activeTab, setActiveTab] = useState("chatAuth");

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      size={750}
      padding={0}
      withCloseButton={false}
    >
      <div className="flex flex-row">
        {/* Left Container */}
        <div
          className="px-1 py-2 flex flex-col"
          style={{
            height: "700px",
            width: "28%",
            borderRight: "1px solid var(--mantine-color-default-border)",
          }}
        >
          {tabs.map((tab) => (
            <Button
              mt={10}
              key={tab.value}
              justify="start"
              variant={activeTab === tab.value ? "filled" : "subtle"}
              onClick={() => {
                setActiveTab(tab.value);
              }}
              color="grey"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Right Container */}
        <div
          className="w-full"
          style={{
            height: "700px",
          }}
        >
          <ChatAuth
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            workspace={workspace}
          />
          <WorkspaceSetup
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            workspace={workspace}
          />
          <AdvancedSetup
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            workspace={workspace}
          />
        </div>
      </div>
      {/* Modal content */}
    </Modal>
  );
}
