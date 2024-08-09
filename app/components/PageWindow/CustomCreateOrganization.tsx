import { CreateOrganization, useUser, useOrganizationList } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { getWorkspace } from "@/app/controllers/workspace";
import {
    Anchor,
    Button,
    Card,
    Group,
    Text,
    Title,
  } from "@mantine/core";

const CustomCreateOrganization = () => {
  const { user } = useUser();
  const [canCreateOrg, setCanCreateOrg] = useState(false);
  const {  organizationList, isLoaded } = useOrganizationList();

  useEffect(() => {
    const checkUserPlan = async () => {
      if(!isLoaded){
        return <p>Loading ...</p>
      }
      
      if (user) {
        const isAllowed = await checkIfUserCanCreateOrg(organizationList);
        setCanCreateOrg(isAllowed);
      }
    };

    checkUserPlan();
  }, [isLoaded]);

  if (!canCreateOrg) {
    // return <p>Your current plan does not allow organization creation.</p>;
    return(
        <Card radius={"lg"} shadow="md" p="md">
            <Title order={3}>
              You already have a workspace in{" "}
              <span
                style={{
                  color: "var(--mantine-primary-color-filled)",
                }}
              >
                Free plan
              </span>{" "}
              , upgrade it to create a new organization.
            </Title>
            <Group mt="xl" justify="flex-end">
              <Anchor
                target="_blank()"
                href={`/workspace`}
              >
                <Button
                  size="md"
                  radius="md"
                  onClick={() => {
                    window.history.pushState({}, "", "/workspace");
                  }}
                >
                  Upgrade
                </Button>
              </Anchor>
            </Group>
          </Card>
    )
  }

  return (
    <CreateOrganization
      skipInvitationScreen
      afterCreateOrganizationUrl={"/onboarding?step=1"}
    />
  );
};

async function checkIfUserCanCreateOrg(organizationList: any[]) {
    for (const organization of organizationList) {
      const workspaceData = await getWorkspace(organization.organization.id);
      
      if (workspaceData?.workspace?.subscription === null) {
        return false;
      }
    }
    
    return true;
}

export default CustomCreateOrganization;