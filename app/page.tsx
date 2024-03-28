// Modules
import { ClerkLoading, OrganizationList } from "@clerk/nextjs";
import { Stack } from "@mantine/core";

export default function Page() {
  return (
    <Stack gap={20} justify="center" align="center" w="100%" h="100vh">
      <ClerkLoading>
        <div>Loading you organization list</div>
      </ClerkLoading>
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/workspace/:slug"
        afterSelectPersonalUrl="/user/:id"
        afterSelectOrganizationUrl="/workspace/:slug"
      />
      {/* </ClerkLoaded> */}
    </Stack>
  );
}
