import {
  ActionIcon,
  Avatar,
  Container,
  Divider,
  Group,
  Stack,
  Switch,
  Textarea,
  ThemeIcon,
  Text,
  Title,
  Image,
  ScrollArea,
} from "@mantine/core";
import {
  IconBadgeHd,
  IconDownload,
  IconRectangle,
  IconRectangleVertical,
  IconRefresh,
  IconSend,
  IconSquare,
  IconTrash,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import capybarra from "./capybarra.png";
import {
  deleteImageGen,
  generateImage,
  getImageGen,
} from "@/app/controllers/imageGen";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { getCldImageUrl } from "next-cloudinary";
import { IImageGenDocument } from "@/app/models/ImageGen";

export default function ImageGenWindow(props: { imageGenId: string }) {
  const imageGenId = props.imageGenId;
  const [imageDescription, setImageDescription] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [isHD, setIsHD] = useState(false);
  const [imageGen, setImageGen] = useState<IImageGenDocument>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [participants, setParticipants] = useState<any>([]);
  const { userId, orgId } = useAuth();
  const { organization } = useOrganization();
  const pathname = usePathname();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `https://res.cloudinary.com/team-gpt/image/upload/fl_attachment/${imageGen?._id}.png`;
    link.click();
  };

  useEffect(() => {
    getImageGen(imageGenId).then((res) => {
      if (res.imageGen) {
        setImageGen(res.imageGen);
        setImageDescription(res.imageGen.prompt);
        setResolution(res.imageGen.resolution);
        setIsHD(res.imageGen.isHD);
      }
    });
  }, [imageGenId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const res =
        (await organization?.getMemberships())?.map(
          (member: any) => member.publicUserData
        ) || [];
      setParticipants(res);
    };
    fetchParticipants();
  }, [organization?.membersCount]);

  return (
    <ScrollArea mt="3rem" mah={"100vh"} scrollbarSize={0}>
      <Stack my={imageGenId ? "8rem" : "20rem"} w={"50rem"} mx="auto">
        <Container w="100%" p="0">
          <Group justify="space-between" w="100%" mb="sm">
            <Title order={4}>Generate image with DALL·E 3</Title>
            <Group>
              <Switch
                size="md"
                checked={isHD}
                onChange={(event) => {
                  setIsHD(event.currentTarget.checked);
                }}
              />
              <ThemeIcon variant={isHD ? "filled" : "default"}>
                <IconBadgeHd size={20} />
              </ThemeIcon>
              <ActionIcon
                variant={resolution == "1024x1024" ? "filled" : "default"}
                aria-label="1024x1024"
                onClick={() => {
                  setResolution("1024x1024");
                }}
              >
                <IconSquare size={20} />
              </ActionIcon>
              <ActionIcon
                variant={resolution == "1792x1024" ? "filled" : "default"}
                aria-label="1792x1024"
                onClick={() => {
                  setResolution("1792x1024");
                }}
              >
                <IconRectangle size={20} />
              </ActionIcon>
              <ActionIcon
                variant={resolution == "1024x1792" ? "filled" : "default"}
                aria-label="1024x1792"
                onClick={() => {
                  setResolution("1024x1792");
                }}
              >
                <IconRectangleVertical size={20} />
              </ActionIcon>
            </Group>
          </Group>
          <Textarea
            autosize
            minRows={2}
            maxRows={4}
            miw="100%"
            variant="default"
            size="lg"
            radius="0"
            placeholder="Enter image description..."
            value={imageDescription}
            disabled={isGenerating}
            rightSection={
              <ActionIcon
                variant="default"
                disabled={isGenerating}
                onClick={() => {
                  setIsGenerating(true);
                  generateImage(
                    userId || "",
                    imageDescription,
                    resolution,
                    isHD,
                    orgId || "",
                    "dall-e-3"
                  ).then((res) => {
                    if (res.imageGen) {
                      window.history.pushState(
                        {},
                        "",
                        pathname.split("/").slice(0, 3).join("/") +
                          `/gallery/${res.imageGen._id}`
                      );
                      setImageGen(res.imageGen);
                      setIsGenerating(false);
                    }
                  });
                }}
              >
                <IconSend size={20} />
              </ActionIcon>
            }
            onChange={(e) => {
              setImageDescription(e.currentTarget.value);
            }}
          />
        </Container>

        {imageGenId ? (
          <>
            <Divider mt="xl" />
            <Container w="100%" p="0" mt="lg">
              <Group justify="space-between" w="100%" mb="sm">
                {participants.map((participant: any) => {
                  if (participant.userId === imageGen?.createdBy) {
                    return participant.hasImage ? (
                      <Group>
                        <Avatar
                          size="md"
                          radius="sm"
                          src={participant?.imageUrl}
                        />
                        <Text size="sm" fw={700}>
                          {participant?.firstName +
                            " " +
                            participant?.lastName || "Unknown User"}
                        </Text>
                      </Group>
                    ) : (
                      <Group>
                        <Avatar size="md" radius="sm">
                          {participant?.firstName + participant?.lastName}
                        </Avatar>
                        <Text size="sm" fw={700}>
                          {participant?.firstName +
                            " " +
                            participant?.lastName || "Unknown User"}
                        </Text>
                      </Group>
                    );
                  }
                })}

                <Text size="sm" c="grey">
                  {new Date(imageGen?.createdAt || "").toLocaleDateString() ||
                    "now"}
                </Text>
              </Group>
              <div className="w-full flex items-center justify-center">
                <Image
                  src={
                    getCldImageUrl({
                      src: imageGen?._id || "",
                    }) || capybarra
                  }
                  alt="Generated Image"
                />
              </div>
              <Group mt="md" w="100%" justify="space-between">
                <Group>
                  <ActionIcon
                    variant="light"
                    disabled={isGenerating}
                    onClick={() => {
                      setIsGenerating(true);
                      generateImage(
                        userId || "",
                        imageDescription,
                        resolution,
                        isHD,
                        orgId || "",
                        "dall-e-3"
                      ).then((res) => {
                        if (res.imageGen) {
                          window.history.pushState(
                            {},
                            "",
                            pathname.split("/").slice(0, 3).join("/") +
                              `/gallery/${res.imageGen._id}`
                          );
                          setImageGen(res.imageGen);
                          setIsGenerating(false);
                        }
                      });
                    }}
                  >
                    <IconRefresh size={20} />
                  </ActionIcon>

                  <ActionIcon
                    variant="light"
                    disabled={isGenerating}
                    onClick={() => {
                      handleDownload();
                    }}
                  >
                    <IconDownload size={20} />
                  </ActionIcon>
                </Group>
                <ActionIcon
                  color="red"
                  variant="light"
                  disabled={isGenerating}
                  onClick={() => {
                    deleteImageGen(imageGenId, orgId || "").then(() => {
                      window.history.pushState(
                        {},
                        "",
                        pathname.split("/").slice(0, 3).join("/") + `/gallery`
                      );
                    });
                  }}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Group>
              <Container mt="xl" p="0">
                <Title order={4}>Prompt:</Title>
                <Text size="md">{imageDescription}</Text>
              </Container>
            </Container>
          </>
        ) : null}
      </Stack>
    </ScrollArea>
  );
}
