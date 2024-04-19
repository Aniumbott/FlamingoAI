// Modules
import { useRouter } from "next/navigation";
import { Container, Title, Text, Button, Group } from "@mantine/core";

// Components
import classes from "./ErrorPage.module.css";
import { Illustration } from "./Illustration";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            It seems like chat you are trying to acess is either ristricted or
            does not exist.
          </Text>
          <Group justify="center">
            <Button
              size="md"
              onClick={() => {
                router.push("/");
              }}
            >
              Take me back to home page
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
