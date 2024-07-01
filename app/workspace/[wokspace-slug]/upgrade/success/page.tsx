"use client";

import { getCheckoutSession } from "@/app/controllers/payment";
import { useOrganization } from "@clerk/nextjs";
import {
  Stack,
  ThemeIcon,
  Text,
  Table,
  Box,
  Button,
  Card,
  Title,
  Divider,
  Group,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Success() {
  const pathname = usePathname();
  const searchParamans = useSearchParams();
  const router = useRouter();
  const sessionId = searchParamans.get("session_id");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const collectSession = async () => {
      const res = await getCheckoutSession(sessionId || "");
      let newSesssion = {
        product: res.session.data[0].price.product,
        quantity: res.session.data[0].quantity,
        total: res.session.data[0].amount_total,
      };

      newSesssion.product =
        process.env.NEXT_PUBLIC_PRO_PLAN == newSesssion.product
          ? "Pro"
          : process.env.NEXT_PUBLIC_MAX_PLAN == newSesssion.product
          ? "Max"
          : "";
      setSession(newSesssion);
    };
    collectSession();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <Stack align="center" mt={70} mx={20} maw={500}>
        <div
          style={{
            padding: "0.5rem",
            borderRadius: "100%",
            border: "10px solid var(--mantine-primary-color-light)",
          }}
        >
          <ThemeIcon size="150" radius="100">
            <IconCheck size="70px" />
          </ThemeIcon>
        </div>
        <Text ta="center" size="24px" fw={700} lh="h5" mt={30}>
          Your workspace has been upgraded successfully!
        </Text>
        <Card w="100%" radius="md" mt="2rem" withBorder>
          <Table
            horizontalSpacing="xl"
            verticalSpacing="md"
            // maw={500}
            style={{
              borderRadius: "10px",
            }}
            // withRowBorders={false}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Title order={4} ta="center">
                    Transection Details
                  </Title>
                </Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w="50%">
                  <Text size="sm" fw={700}>
                    Plan
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="right">
                    {session?.product || "Free"}
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td w="50%">
                  <Text size="sm" fw={700}>
                    Max Members
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="right">
                    {session?.quantity || 0}
                  </Text>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td w="50%">
                  <Text size="sm" fw={700}>
                    Price
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" ta="right">
                    ₹ {session?.total / 100 || 0}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Card>
        <Text mt="md" size="sm" w="100%" c="dimmed">
          Note: You will shortly recieve a mail regarding your transection.
        </Text>
        <Group>
          <Button
            mt="3rem"
            size="lg"
            radius="xl"
            variant="outline"
            onClick={() => {
              router.push(pathname.split("/").slice(0, 3).join("/"));
            }}
          >
            Go to workspace
          </Button>
        </Group>
      </Stack>
    </div>
  );
}
