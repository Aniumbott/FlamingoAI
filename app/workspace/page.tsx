"use client";
// Modules
import { ClerkLoading, OrganizationList, useOrganization } from "@clerk/nextjs";
import { Loader, Stack, Title } from "@mantine/core";
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
    <Stack gap={20} justify="center" align="center" w="100%" h="100vh">
      <ClerkLoading>
        <div className="flex items-center justify-center gap-5 flex-row">
          <Title ta="center" order={3}>
            Loading you organization list.
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
