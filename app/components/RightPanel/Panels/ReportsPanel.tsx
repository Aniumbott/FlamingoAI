import {
  Box,
  Button,
  CloseButton,
  Divider,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import style from ".././RightPanel.module.css";
import { IconExternalLink } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { getChatsReportData } from "@/app/controllers/chat";
import { usePathname, useRouter } from "next/navigation";

export default function ReportsPanel(props: { toggleRight: () => void }) {
  const { toggleRight } = props;
  const { organization } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (organization) {
      const collectData = async () => {
        const data = await getChatsReportData(organization.id);
        setChats(data.chats);
      };
      collectData().then(() => setIsLoading(false));
    }
  }, [organization?.id]);
  return (
    <div className="mx-2">
      <div className={style.activeTitle}>
        <Text>REPORTS</Text>
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
      </div>
      <Divider my="md" />
      <Stack align="center">
        <Button
          mt="sm"
          variant="light"
          justify="space-between"
          rightSection={<IconExternalLink size="20px" />}
          onClick={() => {
            router.push(pathname.split("/").slice(0, 3).join("/") + "/reports");
          }}
        >
          Detailed Reports
        </Button>

        <Paper
          withBorder
          w="100%"
          h="250"
          p="2rem"
          mt="md"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title order={5} ta="center">
            Total number of Chats
          </Title>
          {isLoading ? (
            <Loader size="md" mt="sm" type="dots" />
          ) : (
            <Title order={1} mt="md">
              {chats.length}
            </Title>
          )}
        </Paper>

        <Paper
          withBorder
          w="100%"
          h="250"
          p="2rem"
          mt="md"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title order={5} ta="center">
            Total number of messages sent
          </Title>
          {isLoading ? (
            <Loader size="md" mt="sm" type="dots" />
          ) : (
            <Title order={1} mt="md">
              {chats.reduce((total: number, chat: any) => {
                return (
                  total +
                  chat.messages.filter((m: any) => m.type === "user").length
                );
              }, 0)}
            </Title>
          )}
        </Paper>
      </Stack>
    </div>
  );
}
