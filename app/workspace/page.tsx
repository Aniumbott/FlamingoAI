"use client";
// Modules
import { ClerkLoading, OrganizationList, useOrganization } from "@clerk/nextjs";
import { Loader, Stack, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { organization } = useOrganization();
  const router = useRouter();
  useEffect(() => {
    if (organization?.slug) {
      router.push("workspace/" + organization.slug);
    }
  }, [organization]);
  return (
    <Stack gap={20} justify="center" align="center" w="100%" h="100vh">
      <ClerkLoading>
        <div className="flex flex-row items-center justify-center">
          <Title order={3} mr="md">
            Loading you organization list.
          </Title>
          <Loader size="md" type="bars" />
        </div>
      </ClerkLoading>
      {organization?.slug ? (
        <div className="flex flex-row items-center justify-center">
          <Title order={3} mr="md">
            You have been redirected to your organization.
          </Title>
          <Loader size="md" />
        </div>
      ) : (
        <OrganizationList
          hidePersonal
          afterCreateOrganizationUrl="/workspace/:slug"
          afterSelectPersonalUrl="/user/:id"
          afterSelectOrganizationUrl="/workspace/:slug"
        />
      )}
      {/* </ClerkLoaded> */}
    </Stack>
  );
}
