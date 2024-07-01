"use client";
// Modules
import {
  ClerkLoaded,
  ClerkLoading,
  OrganizationList,
  useOrganization,
} from "@clerk/nextjs";
import {
  Anchor,
  Box,
  Button,
  Divider,
  Loader,
  Stack,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { organization } = useOrganization();
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  useEffect(() => {
    if (organization?.slug) {
      router.push("workspace/" + organization.slug);
    }
  }, [organization]);
  return (
    <Stack gap={20} justify="center" align="center" w="100vw" h="100vh">
      <ClerkLoading>
        <div className="flex items-center justify-center gap-5 flex-row">
          <Title ta="center" order={3}>
            Loading your workspaces
          </Title>
          <Loader size="md" type="bars" />
        </div>
      </ClerkLoading>
      {organization?.slug ? (
        <div
          className={`flex items-center justify-center gap-5 ${
            isMobile ? "flex-col" : "flex-row"
          }`}
        >
          <Title ta="center" order={3}>
            You have been redirected to your organization.
          </Title>
          <Loader size="md" />
        </div>
      ) : (
        <Box
          maw="100vw"
          p={0}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <OrganizationList
            hidePersonal
            afterCreateOrganizationUrl="/workspace/:slug"
            afterSelectPersonalUrl="/user/:id"
            afterSelectOrganizationUrl="/workspace/:slug"
          />
          <ClerkLoaded>
            <Anchor href="/onboarding">
              <Button size="md" radius={"md"} variant="outline" mt="lg">
                Create a new Workspace
              </Button>
            </Anchor>
          </ClerkLoaded>
        </Box>
      )}
    </Stack>
  );
}
