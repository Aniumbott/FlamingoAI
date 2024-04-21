"use client";
import React, { useState, useEffect } from "react";
import {
  Appearance,
  StripeElementsOptions,
  loadStripe,
} from "@stripe/stripe-js";
import {
  Elements,
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import CheckoutForm from "./components/CheckoutForm";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  HoverCard,
  List,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
  Container,
  BackgroundImage,
  CloseButton,
} from "@mantine/core";
import { createCheckoutSession } from "../../../controllers/payment";
import {
  IconCheck,
  IconChevronDown,
  IconCross,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useOrganization } from "@clerk/nextjs";
import { getWorkspace } from "../../../controllers/workspace";
import { IWorkspaceDocument } from "../../../models/Workspace";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export default function App() {
  const [clientSecret, setClientSecret] = useState(null);
  const [opened, setOpened] = useState(false);

  const numbers = Array.from({ length: 50 }, (_, i) => (i + 1) * 10);
  const [membersQuantity, setMembersQuantity] = useState("10");
  const [proQuantity, setProQuantity] = useState<string | number>(10);
  const [maxQuantity, setMaxQuantity] = useState<string | number>(10);
  const { organization } = useOrganization();
  const [workspace, setWorkspace] = useState<IWorkspaceDocument | null>(null);
  useEffect(() => {
    const collectWorkspace = async () => {
      const res = await getWorkspace(organization?.id || "");
      setWorkspace(res.workspace);
    };
    collectWorkspace();
  }, [organization?.id]);

  useEffect(() => {
    if (workspace?.customerId) {
      console.log("customer id", workspace.customerId);
    }
  }, [workspace?.customerId]);

  return (
    <div className="w-full flex flex-col gap-10 p-10">
      <Group justify="space-between">
        <Title order={2}>
          Upgrade your plan for workspace{" "}
          <span className="font-semibold">
            {organization?.name || "Workspace"}
          </span>
        </Title>
        <Button variant="default">Back to Dashboard</Button>
      </Group>

      <Modal
        onClose={() => setOpened(false)}
        padding={0}
        opened={opened}
        withCloseButton={false}
        size={"100%"}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <CloseButton
          onClick={() => setOpened(false)}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 1000,
          }}
        />
        {clientSecret ? (
          <div className="py-10 mx-auto self-center bg-black">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        ) : (
          <div className="h-[50vh] flex justify-center items-center">
            loading again .....{" "}
          </div>
        )}
      </Modal>

      <Group gap={65} align="strech" justify="center" mt="6rem" wrap="wrap">
        {/* Free */}
        <Card
          h={590}
          radius="md"
          w={330}
          shadow="lg"
          withBorder
          style={{
            outline: !workspace?.subscription
              ? "1px solid var(--mantine-primary-color-filled)"
              : "none",
          }}
        >
          <Stack gap={10} align="center" justify="center">
            <Title order={3}>Free</Title>
            <div className="w-full">
              <Text size="xs" c="dimmed" fw={700} ta="center">
                Free collaboration
              </Text>
              <Text size="xs" c="dimmed" fw={700} ta="center">
                (up to 2 users)
              </Text>
            </div>
            <List icon={<IconCheck size={20} />} size="sm" w="100%">
              <List.Item mt={6}>Up to 2 users</List.Item>
              <List.Item mt={6}>Everything from Max plan</List.Item>
              <List.Item mt={6}>Shared chats & prompts</List.Item>
              <List.Item mt={6}>Powered by OpenAI API</List.Item>
              <List.Item mt={6}>No model training on data</List.Item>
              <List.Item mt={6}>No credit card required</List.Item>
            </List>
            <Group
              gap={5}
              align="center"
              c={"var(--mantine-color-gray-6)"}
              w="100%"
              mt={10}
            >
              <IconPlus size={20} />
              <Text>AI usage costs</Text>
              <HoverCard width={300} shadow="md">
                <HoverCard.Target>
                  <IconInfoCircle size={15} />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm">
                    Since you are utilizing an API infrastructure to power your
                    AI interactions through Team-GPT, the service provider you
                    choose will charge for their services based on usage. You
                    will be billed for that separately by your GPT service
                    provider.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
            <Text
              p={20}
              py={10}
              mt={20}
              w="100%"
              size="xs"
              bg="var(--mantine-primary-color-light)"
              style={{
                borderRadius: "8px",
                color: "var(--mantine-primary-color-filled)",
              }}
            >
              2 Users (Free)
            </Text>
          </Stack>
        </Card>

        {/* Pro */}
        <Card
          mih={500}
          radius="md"
          w={330}
          shadow="lg"
          withBorder
          style={{
            outline:
              workspace?.subscription?.product_name.toLocaleLowerCase() == "pro"
                ? "1px solid var(--mantine-primary-color-filled)"
                : "none",
          }}
        >
          <div className="h-full flex flex-col justify-between">
            <Stack gap={10} align="center" justify="center">
              <Title order={3}>Pro</Title>
              <div className="w-full">
                <Text size="xs" c="dimmed" fw={700} ta="center">
                  Best for small teams looking to adopt AI
                </Text>
                <Text size="xs" c="dimmed" fw={700} ta="center">
                  (3 to 500 users)
                </Text>
              </div>
              <List icon={<IconCheck size={20} />} size="sm" w="100%">
                <List.Item mt={6}>Chat Collaboration</List.Item>
                <List.Item mt={6}>Folders and Subfolders</List.Item>
                <List.Item mt={6}>Prompt Library</List.Item>
                <List.Item mt={6}>Member roles and permissions</List.Item>
                <List.Item mt={6}>Azure OpenAI Integration</List.Item>
                <List.Item mt={6}>Usage Reports</List.Item>
              </List>
              <div className="w-full mt-5">
                <Title order={3}>20 INR</Title>
                <Text size="xs" c="dimmed">
                  per month / per 10 seats
                </Text>
              </div>
              <Group
                gap={5}
                align="center"
                c={"var(--mantine-color-gray-6)"}
                w="100%"
              >
                <IconPlus size={20} />
                <Text>AI usage costs</Text>
                <HoverCard width={300} shadow="md">
                  <HoverCard.Target>
                    <IconInfoCircle size={15} />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">
                      Since you are utilizing an API infrastructure to power
                      your AI interactions through Team-GPT, the service
                      provider you choose will charge for their services based
                      on usage. You will be billed for that separately by your
                      GPT service provider.
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            </Stack>
            {workspace?.subscription?.product_name.toLocaleLowerCase() ==
            "pro" ? (
              <Button fullWidth mt="xs" variant="outline">
                Manage
              </Button>
            ) : (
              <>
                <Text w="100%" mt="md">
                  Members
                </Text>
                <QunatityInput
                  quantity={proQuantity}
                  setQuantity={setProQuantity}
                />
                <Button
                  fullWidth
                  mt="xs"
                  onClick={() => {
                    setOpened(true);
                    createCheckoutSession(
                      "price_1P6RMSSEu7527fI69AjpXVxM",
                      String(proQuantity),
                      workspace?.customerId || ""
                    ).then((res) => setClientSecret(res.session.client_secret));
                  }}
                >
                  Upgrade
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Max */}
        <Card
          mih={500}
          radius="md"
          w={330}
          shadow="lg"
          withBorder
          style={{
            outline:
              workspace?.subscription?.product_name.toLocaleLowerCase() == "max"
                ? "1px solid var(--mantine-primary-color-filled)"
                : "none",
          }}
        >
          <div className="h-full flex flex-col justify-between">
            <Stack gap={10} align="center" justify="center">
              <Title order={3}>Max</Title>
              <div className="w-full">
                <Text size="xs" c="dimmed" fw={700} ta="center">
                  Best for mid-sized teams embracing AI
                </Text>
                <Text size="xs" c="dimmed" fw={700} ta="center">
                  (3 to 500 users)
                </Text>
              </div>
              <List icon={<IconCheck size={20} />} size="sm" w="100%">
                <List.Item mt={6}>All features from Pro</List.Item>
                <List.Item mt={6}>
                  <b>AI Editing with Pages (beta)</b>
                </List.Item>
                <List.Item mt={6}>
                  <b>Image generation with DALL·E 3</b>
                </List.Item>
                <List.Item mt={6}>
                  <b>Recognise images with Vision</b>
                </List.Item>
                <List.Item mt={6}>
                  <b>Claude 3 integration (Opus, Sonnet, Haiku)</b>
                </List.Item>
                <List.Item mt={6}>
                  Anyscale integration (Llama, Mixtral...)
                </List.Item>
              </List>
              <div className="w-full mt-5">
                <Title order={3}>50 INR</Title>
                <Text size="xs" c="dimmed">
                  per month / per 10 seats
                </Text>
              </div>
              <Group
                gap={5}
                align="center"
                c={"var(--mantine-color-gray-6)"}
                w="100%"
              >
                <IconPlus size={20} />
                <Text>AI usage costs</Text>
                <HoverCard width={300} shadow="md">
                  <HoverCard.Target>
                    <IconInfoCircle size={15} />
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm">
                      Since you are utilizing an API infrastructure to power
                      your AI interactions through Team-GPT, the service
                      provider you choose will charge for their services based
                      on usage. You will be billed for that separately by your
                      GPT service provider.
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
            </Stack>
            {workspace?.subscription?.product_name.toLocaleLowerCase() ==
            "max" ? (
              <Button fullWidth mt="xs" variant="outline">
                Manage
              </Button>
            ) : (
              <>
                <Text w="100%" mt="md">
                  Members
                </Text>
                <QunatityInput
                  quantity={maxQuantity}
                  setQuantity={setMaxQuantity}
                />
                <Button
                  fullWidth
                  mt="xs"
                  onClick={() => {
                    setOpened(true);
                    createCheckoutSession(
                      "price_1P7ukaSEu7527fI6NHzykqSY",
                      String(maxQuantity),
                      workspace?.customerId || ""
                    ).then((res) => setClientSecret(res.session.client_secret));
                  }}
                >
                  Upgrade
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Enterprise */}
        <Card
          mih={500}
          radius="md"
          w={330}
          shadow="lg"
          withBorder
          style={{
            outline:
              workspace?.subscription?.product_name.toLocaleLowerCase() == "max"
                ? "1px solid var(--mantine-primary-color-filled)"
                : "none",
          }}
        >
          <div className="h-full flex flex-col justify-between">
            <Stack gap={10} align="center">
              <Title order={3}>Enterprise</Title>
              <div className="w-full">
                <Text size="xs" c="dimmed" fw={700} ta="center">
                  Large organization
                </Text>
                <Text size="xs" c="dimmed" fw={700} ta="center">
                  (&gt;500 users)
                </Text>
              </div>
              <List icon={<IconCheck size={20} />} size="sm" w="100%">
                <List.Item mt={6}>Private Cloud Deployment</List.Item>
                <List.Item mt={6}>Dedicated Database</List.Item>
                <List.Item mt={6}>Deploy custom GPT models</List.Item>
                <List.Item mt={6}>Custom domain & branding</List.Item>
              </List>
              <div className="w-full mt-5">
                <Text size="sm">Have more than 500 team members?</Text>

                <Text size="sm" mt="md">
                  Talk to us for the best custom solution and pricing for your
                  business!
                </Text>
              </div>
            </Stack>
            <Button fullWidth mt="xs" variant="outline">
              Talk to us
            </Button>
          </div>
        </Card>
      </Group>
    </div>
  );
}

const QunatityInput = (props: {
  quantity: string | number;
  setQuantity: (quantity: string | number) => void;
}) => {
  const { quantity, setQuantity } = props;
  return (
    <Group justify="space-between">
      <ActionIcon
        size="lg"
        onClick={() => {
          setQuantity(Math.max(10, (quantity as number) - 10));
        }}
      >
        <IconMinus size="20px" />
      </ActionIcon>
      <NumberInput
        ta="center"
        hideControls
        variant="filled"
        onChange={setQuantity}
        value={quantity}
        min={1}
        max={500}
        step={10}
        className="input"
      />
      <ActionIcon
        size="lg"
        onClick={() => {
          setQuantity(Math.min(500, (quantity as number) + 10));
        }}
      >
        <IconPlus size="20px" />
      </ActionIcon>
    </Group>
  );
};
