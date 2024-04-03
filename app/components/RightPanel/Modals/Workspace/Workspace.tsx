import { Button, Modal, rem, Paper } from "@mantine/core";
import style from ".././Modals.module.css";

import { useState } from "react";
import ChatAuth from "./ChatAuth";
import WorkspaceSetup from "./WorkspaceSetup";
import AdvancedSetup from "./AdvancedSetup";

export default function Workspace(props: { opened: boolean; setOpened: any }) {
  const { opened, setOpened } = props;

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
      <div className={style.modal}>
        {/* Left Container */}
        <div className={style.leftContainer}>
          {tabs.map((tab) => (
            <Button
              mt={10}
              key={tab.value}
              justify="start"
              variant={activeTab === tab.value ? "filled" : "subtle"}
              onClick={() => {
                setActiveTab(tab.value);
              }}
              color="gray"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Right Container */}
        <div className={style.rightContainer}>
          <ChatAuth activeTab={activeTab} setActiveTab={setActiveTab} />
          <WorkspaceSetup activeTab={activeTab} setActiveTab={setActiveTab} />
          <AdvancedSetup activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      {/* Modal content */}
    </Modal>
  );
}
