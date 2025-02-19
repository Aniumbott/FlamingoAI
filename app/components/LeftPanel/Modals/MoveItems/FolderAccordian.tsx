import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  ScrollArea,
} from "@mantine/core";
import { IChatFolderDocument } from "@/app/models/ChatFolder";
import style from "../../LeftPanel.module.css";
import { IconCaretRightFilled } from "@tabler/icons-react";

const FolderAccordian = (props: {
  folder: IChatFolderDocument;
  breadcrumb: { id: string; name: string }[];
  setBreadcrumb: (value: { id: string; name: string }[]) => void;
  currentId: string;
}) => {
  const { folder, breadcrumb, setBreadcrumb, currentId } = props;
  const handleBreadcrumb = (value: string | null) => {
    if (value === null) {
      breadcrumb.pop();
    } else {
      while (breadcrumb[breadcrumb.length - 1].id !== folder._id) {
        breadcrumb.pop();
      }
      const id = value.split(":")[0];
      const name = value.split(":")[1];
      breadcrumb.push({ id, name });
    }
    setBreadcrumb([...breadcrumb]);
  };
  return (
    <AccordionItem
      style={{
        color: "var(--mantine-color-scheme-primary)",
      }}
      value={folder._id + ":" + folder.name}
      key={folder._id}
    >
      <Accordion.Control
        style={{
          color:
            breadcrumb[breadcrumb.length - 1].id === folder._id
              ? "var(--mantine-primary-color-filled)"
              : "",
        }}
        variant="subtle"
        disabled={folder._id === currentId}
      >
        {folder.name}
      </Accordion.Control>

      <AccordionPanel>
        {folder.subFolders?.length > 0 && (
          //   folder.subFolders.map((subFolder, subIndex) => (
          <Accordion
            chevronPosition="left"
            className="border-none"
            classNames={{ chevron: style.chevron }}
            chevron={<IconCaretRightFilled className={style.icon} />}
            onChange={(value) => handleBreadcrumb(value)}
          >
            {folder.subFolders.map((subFolder, subIndex) => (
              <FolderAccordian
                folder={subFolder as IChatFolderDocument}
                breadcrumb={breadcrumb}
                setBreadcrumb={setBreadcrumb}
                key={subIndex}
                currentId={currentId}
              />
              // </Accordion>
            ))}
          </Accordion>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};

export default FolderAccordian;
