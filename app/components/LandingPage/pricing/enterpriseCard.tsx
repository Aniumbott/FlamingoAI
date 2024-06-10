import {
  Box,
  Button,
  Card,
  Group,
  Image,
  List,
  ListItem,
  Text,
  Title,
} from "@mantine/core";

export default function EnterpriseCard() {
  return (
    <Card mt={"xl"} radius="md" w={1050} shadow="lg" withBorder>
      <Group justify="space-between">
        <Box maw={470}>
          <Title order={5} c="var(--mantine-primary-color-filled)">
            TEAM-GPT ENTERPRISE
          </Title>
          <Title mt="sm" mb="lg" order={3}>
            Our flagship product
          </Title>
          <Text mt="xl">
            Team-GPT Enterprise allows your organization to have the software:
          </Text>
          <List mt="lg">
            <ListItem>on premises or private cloud deployment</ListItem>
            <ListItem>private database, which only you can access</ListItem>
            <ListItem>
              OpenAI, Microsoft Azure, Google Gemini, Anthropic Claude, or any
              custom model (LLaMa, Mixtral, etc.)
            </ListItem>
          </List>
          <Text mt="lg">
            Talk to us for the best custom solution and pricing for your
            business!
          </Text>
          <Group mt="xl">
            <Button size="md">Lets Talk</Button>
            <Button variant="outline" size="md">
              Read More
            </Button>
          </Group>
        </Box>
        <Image
          w="500"
          alt=""
          radius="md"
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
        />
      </Group>
    </Card>
  );
}
