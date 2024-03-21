"use client";
import { Container, Title, Text, Button, Group } from "@mantine/core";
import { Illustration } from "./components/Illustration";
import classes from "./NothingFoundBackground.module.css";
import { useRouter } from "next/navigation";

export default function NothingFoundBackground() {
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
            It seems like the workspace or chat you are trying to acess is
            either ristricted or does not exist.
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
