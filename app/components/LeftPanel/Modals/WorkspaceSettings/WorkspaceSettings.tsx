import { Button, Modal, rem, Paper, Text, Title } from "@mantine/core";

import { useEffect, useState } from "react";
import ChatAuth from "./ChatAuth";
import WorkspaceSetup from "./WorkspaceSetup";
import AdvancedSetup from "./AdvancedSetup";
import { createPortalSession } from "@/app/controllers/payment";
import { useRouter } from "next/navigation";
import { IconExternalLink } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

export default function WorkspaceSettings(props: {
  opened: boolean;
  setOpened: any;
  workspace: any;
}) {
  const { opened, setOpened, workspace } = props;
  const isMobile = useMediaQuery(`(max-width: 48em)`);

  const tabs = [
    { value: "chatAuth", label: "Chat Authentication" },
    { value: "workspaceSetup", label: "Workspace Setup" },
    { value: "advancedSetup", label: "Advanced Setup" },
  ];

  const [activeTab, setActiveTab] = useState("chatAuth");
  const router = useRouter();

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      size={750}
      padding={0}
      withCloseButton={false}
    >
      <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
        {/* Left Container */}
        <div
          className={`"px-1 py-2 flex ${isMobile ? "flex-row" : "flex-col"}`}
          style={{
            height: isMobile ? "auto" : "700px",
            width: isMobile ? "90%" : "28%",
            margin: "auto",
            borderRight: !isMobile
              ? "1px solid var(--mantine-color-default-border)"
              : "none",
            borderBottom: isMobile
              ? "1px solid var(--mantine-color-default-border)"
              : "none",
          }}
        >
          {tabs.map((tab) => (
            <Button
              size={isMobile ? "compact-xs" : "sm"}
              maw={isMobile ? "100%" : "700px"}
              mt={10}
              key={tab.value}
              justify="start"
              variant={activeTab === tab.value ? "outline" : "subtle"}
              onClick={() => {
                setActiveTab(tab.value);
              }}
              color={activeTab === tab.value ? "" : "grey"}
            >
              <Text fw={700} size={isMobile ? "xs" : "sm"} truncate>
                {tab.label}
              </Text>
            </Button>
          ))}
          <Button
            size={isMobile ? "compact-xs" : "sm"}
            mt={10}
            justify="start"
            variant="subtle"
            color="grey"
            onClick={async () => {
              const res = await createPortalSession(workspace.customerId);
              window.open(res.portalSession.url, "_blank");
            }}
            rightSection={
              <IconExternalLink size={isMobile ? "15px" : "20px"} />
            }
          >
            Billing
          </Button>
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
