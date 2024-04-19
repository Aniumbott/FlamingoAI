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
  Badge,
  Box,
  Button,
  Group,
  HoverCard,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  createCheckoutSession,
  createSubscription,
} from "../controllers/payment";
import {
  IconCheck,
  IconChevronDown,
  IconInfoCircle,
  IconPlus,
} from "@tabler/icons-react";

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

  return (
    <div className="w-full flex flex-col gap-10 p-10">
      <Group justify="space-between">
        <Text fz={"h2"}>
          Upgrade your plan for workspace{" "}
          <span className="font-semibold">AniketRana's Workspace</span>
        </Text>
        <Button variant="default">Back to Dashboard</Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        padding={0}
        size={"100%"}
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
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

      <Group gap={50} align="strech" justify="center">
        <Box
          className="bg-white text-black flex flex-col gap-8 justify-between p-5 rounded-lg transform transition-transform duration-500 hover:shadow-lg hover:scale-105 w-[330px] relative"
          style={{ border: "2px solid teal" }}
        >
          <Badge
            className="absolute inset-0 -top-3 left-3"
            variant="filled"
            color="teal"
          >
            Your Plan
          </Badge>
          <Stack>
            <Stack gap={5} align="center" justify="center">
              <Title order={2}>Free</Title>
              <Text>Free collaboration</Text>
              <Text>(upto 2 users)</Text>
            </Stack>

            <Stack gap={5} align="flex-start">
              <Group>
                <IconCheck size={20} />
                <Text>Up to 2 users</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>Shared chats & prompts</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>No model training on data</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>No credit card required</Text>
              </Group>
            </Stack>
            <Group gap={5} align="center" c={"var(--mantine-color-gray-6)"}>
              <IconPlus size={15} />
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
          </Stack>
        </Box>

        <Box
          className="bg-white text-black flex flex-col gap-8 justify-between p-5 rounded-lg transform transition-transform duration-500 hover:shadow-lg hover:scale-105 relative"
          style={{ border: "2px solid teal" }}
        >
          {/* <Badge
            className="absolute inset-0 -top-3 left-3"
            variant="filled"
            color="teal"
          >
            Your Plan
          </Badge> */}
          <Stack>
            <Stack gap={5} align="center" justify="center">
              <Title order={2}>Pro</Title>
              <Text>Best for small teams looking to adopt AI</Text>
              <Text>(3-500 users)</Text>
            </Stack>

            <Stack gap={5} align="flex-start">
              <Group>
                <IconCheck size={20} />
                <Text>Chat Collaboration</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>Folders and Subfolders</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>Prompt Library</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>Member roles and permissions</Text>
              </Group>
              <Group>
                <IconCheck size={20} />
                <Text>Usage Reports</Text>
              </Group>
            </Stack>
            <Stack gap={5}>
              <Title order={3}>20 INR</Title>
              <Text>per month / per 10 members </Text>
              <Group gap={5} align="center" c={"var(--mantine-color-gray-6)"}>
                <IconPlus size={15} />
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
          </Stack>

          <Stack>
            <Select
              label="Members"
              variant="default"
              color="teal"
              defaultValue={"10"}
              data={numbers.map((num) => num.toString())}
              rightSection={<IconChevronDown />}
            />
            <Button
              color="teal"
              onClick={() => {
                setOpened(true);
                createCheckoutSession().then((res) =>
                  setClientSecret(res.session.client_secret)
                );
              }}
            >
              Upgrade Now
            </Button>
          </Stack>
        </Box>
      </Group>
    </div>
  );
}
