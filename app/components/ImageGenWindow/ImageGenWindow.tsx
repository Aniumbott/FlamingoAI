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
  Highlight,
  Card,
  Button,
  Tooltip,
  Box,
  LoadingOverlay,
  Loader,
  Affix,
  Paper,
} from "@mantine/core";
import {
  IconBadgeHd,
  IconDownload,
  IconInfoCircle,
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
import { StaticImageData } from "next/image";
import ErrorPage from "../ChatWindow/ErrorPage/ErrorPage";
import { useMediaQuery } from "@mantine/hooks";

export default function ImageGenWindow(props: {
  imageGenId: string;
  productId: string;
}) {
  const { imageGenId, productId } = props;
  const [imageDescription, setImageDescription] = useState("");
  const [resolution, setResolution] = useState("1024x1024");
  const [isHD, setIsHD] = useState(false);
  const [imageGen, setImageGen] = useState<IImageGenDocument>({
    createdBy: "",
    prompt: "",
    resolution: "",
    isHD: false,
    workspaceId: "",
    modelName: "",
    createdAt: new Date(),
  } as IImageGenDocument);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePath, setImagePath] = useState<string | StaticImageData>("");
  const [participants, setParticipants] = useState<any>([]);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 48em)`);
  const { userId, orgId } = useAuth();
  const { organization } = useOrganization();
  const pathname = usePathname();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/fl_attachment/${imageGen?._id}.png`;
    link.click();
  };

  useEffect(() => {
    const user = participants.find(
      (participant: any) => participant.userId === userId
    );
    if (user) {
      setIsAllowed(
        user?.id === imageGen?.createdBy || user.role === "org:admin"
      );
    }
  }, [participants, imageGen]);

  useEffect(() => {
    if (imageGenId) {
      setImagePath("");
      getImageGen(imageGenId).then((res) => {
        setImageGen(res.imageGen);
        setImageDescription(res.imageGen.prompt);
        setResolution(res.imageGen.resolution);
        setIsHD(res.imageGen.isHD);
        setImagePath(
          getCldImageUrl({
            src: `workspaces/${orgId}/${res.imageGen?._id}` || "",
          }) || ""
        );
      });
    } else {
      setImageDescription("");
      setResolution("1024x1024");
      setIsHD(false);
    }
  }, [imageGenId]);

  useEffect(() => {
    console.log(imagePath);
    if (imagePath === "") {
      setLoadingImage(true);
    } else {
      setLoadingImage(false);
    }
  }, [imagePath]);

  useEffect(() => {
    const fetchParticipants = async () => {
      const res =
        (await organization?.getMemberships())?.map((member: any) => {
          return { ...member.publicUserData, role: member.role };
        }) ?? [];
      setParticipants(res);
    };
    fetchParticipants();
  }, [organization?.membersCount]);

  return productId === process.env.NEXT_PUBLIC_MAX_PLAN ? (
    !imageGen ? (
      <Affix top={0} left={0} right={0} bottom={0} zIndex={1000} bg="dark">
        <ErrorPage />
      </Affix>
    ) : (
      <ScrollArea mah={"100vh"} scrollbarSize={0}>
        <Paper
          mih="calc(100vh - 10rem)"
          py={imageGenId ? (isMobile ? "1rem" : "8rem") : "20rem"}
        >
          <Stack w="calc(min(92vw,50rem))" m="auto">
            <Container w="100%" p="0">
              <Group justify="space-between" w="100%" mb="sm">
                <Title order={4}>Generate image with DALL·E 3</Title>
                <Group>
                  <ActionIcon
                    variant={isHD ? "filled" : "default"}
                    onClick={() => {
                      setIsHD(!isHD);
                    }}
                  >
                    <IconBadgeHd size={20} />
                  </ActionIcon>
                  <Divider orientation="vertical" />
                  <Tooltip label="1024x1024" fz="xs">
                    <ActionIcon
                      variant={resolution == "1024x1024" ? "filled" : "default"}
                      aria-label="1024x1024"
                      onClick={() => {
                        setResolution("1024x1024");
                      }}
                    >
                      <IconSquare size={20} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="1792x1024" fz="xs">
                    <ActionIcon
                      variant={resolution == "1792x1024" ? "filled" : "default"}
                      aria-label="1792x1024"
                      onClick={() => {
                        setResolution("1792x1024");
                      }}
                    >
                      <IconRectangle size={20} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="1024x1792" fz="xs">
                    <ActionIcon
                      variant={resolution == "1024x1792" ? "filled" : "default"}
                      aria-label="1024x1792"
                      onClick={() => {
                        setResolution("1024x1792");
                      }}
                    >
                      <IconRectangleVertical size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              <Textarea
                autosize
                minRows={2}
                maxRows={4}
                miw="100%"
                variant="default"
                size="lg"
                placeholder="Enter image description..."
                value={imageDescription}
                disabled={isGenerating}
                rightSection={
                  <Tooltip label="Generate Image" fz="xs">
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
                  </Tooltip>
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
                      {new Date(
                        imageGen?.createdAt || ""
                      ).toLocaleDateString() || "now"}
                    </Text>
                  </Group>
                  <div className="w-full flex items-center justify-center">
                    <Group pos="relative" align="center" justify="center">
                      {loadingImage && <Loader my="480px" size="xl" />}
                      {imagePath !== "" && (
                        <Image
                          radius="sm"
                          src={imagePath}
                          alt="Generated Image"
                        />
                      )}
                    </Group>
                  </div>
                  <Group mt="md" w="100%" justify="space-between">
                    <Group>
                      <Tooltip label="Regenerate" fz="xs">
                        <Button
                          variant="light"
                          size="xs"
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
                          rightSection={<IconRefresh size={15} />}
                        >
                          Regenerate
                        </Button>
                      </Tooltip>
                      <Tooltip label="Download" fz="xs">
                        <Button
                          variant="light"
                          size="xs"
                          disabled={isGenerating}
                          onClick={() => {
                            handleDownload();
                          }}
                          rightSection={<IconDownload size={15} />}
                        >
                          Download
                        </Button>
                      </Tooltip>
                    </Group>
                    {isAllowed && (
                      <Tooltip label="Delete" fz="xs">
                        <Button
                          color="red"
                          variant="light"
                          disabled={isGenerating}
                          size="xs"
                          onClick={() => {
                            deleteImageGen(imageGenId, orgId || "").then(() => {
                              window.history.pushState(
                                {},
                                "",
                                pathname.split("/").slice(0, 3).join("/") +
                                  `/gallery`
                              );
                            });
                          }}
                          rightSection={<IconTrash size={15} />}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    )}
                  </Group>
                  <Container mt="xl" p="0">
                    <Title order={4}>Prompt:</Title>
                    <Text size="md">{imageDescription}</Text>
                  </Container>
                </Container>
              </>
            ) : null}
          </Stack>
        </Paper>
      </ScrollArea>
    )
  ) : (
    <Stack align="center" justify="center">
      <Card withBorder radius="md" p="lg">
        <Group gap={"xs"}>
          <IconInfoCircle size="24px" />
          <Title order={3}>Upgrade required !!!</Title>
        </Group>
        <Text size="md" c="dimmed" mt="md">
          Image generation feature is availabe for workspaces with{" "}
          <span
            style={{
              fontWeight: 700,
              color: "var(--mantine-primary-color-filled)",
            }}
          >
            MAX
          </span>{" "}
          plan only.
        </Text>
      </Card>
    </Stack>
  );
}
