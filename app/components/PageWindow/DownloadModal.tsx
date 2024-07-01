import React from "react";
import { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  Select,
  Group,
  TextInput,
  Button,
  Alert,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

const DownloadModal = (props: {
  open: boolean;
  setOpen: (value: boolean) => void;
  fileName: string;
  page: any;
}) => {
  const { open, setOpen, fileName, page } = props;
  const [downloadType, setDownloadType] = useState<string | null>("html");
  const [name, setName] = useState<string | null>(fileName || "page");

  function handleDownload(type: string | null) {
    if (type === "html") {
      const element = document.createElement("a");
      const file = new Blob([page.content.join("\n")], { type: "text/html" });
      element.href = URL.createObjectURL(file);
      element.download = `${name}.html`;
      document.body.appendChild(element);
      element.click();
    } else {
      return;
    }
  }

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title="Download as File"
      size="md"
      withCloseButton
      centered
    >
      <Stack gap="md">
        <Select
          data={[
            { value: "html", label: "HTML" },
            { value: "pdf", label: "PDF" },
          ]}
          value={downloadType}
          onChange={(value) => setDownloadType(value)}
          label="Export Format"
        />

        <TextInput
          label="File Name"
          value={name || ""}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <Alert variant="light" title="Note" icon={<IconInfoCircle />}>
          Always save before download to ensure you have the latest version.
        </Alert>

        <Group gap={"sm"} justify="flex-end" mt={"lg"}>
          <Button variant="default" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="filled"
            onClick={() => {
              handleDownload(downloadType);
            }}
          >
            Download
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DownloadModal;
