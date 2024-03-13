import React from "react";
import { Menu, Button, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type MenuButtonProps = {
  properties: {
    title: string;
    description: string;
    icon: React.ReactNode;
    // onClickAction?: () => void;
  };
};

type MenuBodyProps = {
  children: [
    {
      title: string;
      description: string;
      icon: React.ReactNode;
      onClickAction?: () => void;
    }
  ];
  target: React.ReactNode;
};

const MenuBody = (props: MenuBodyProps) => {
  return (
    <Menu
      position="top-start"
      width={300}
      styles={{
        dropdown: {
          backgroundColor: "#ffffff",
        },
        item: {
          backgroundColor: "#ffffff",
          color: "#000000",
          hover: {
            backgroundColor: "#000000",
          },
          height: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          padding: "0px",
        },
      }}
    >
      <Menu.Target>{props.target}</Menu.Target>
      <Menu.Dropdown>
        {props.children.map((item, index) => (
          <Menu.Item key={index} onClick={item.onClickAction}>
            <MyButton properties={item} />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

const MyButton = (props: MenuButtonProps) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline", fz: "xl" }
          : { color: "0F172A", variant: "transparent" })}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
        }}
        // onClick={props.properties.onClickAction}
      >
        <Stack gap={1} align="start">
          <Text fw={"600"} fz={"sm"}>
            {props.properties.title}
          </Text>
          {props.properties.description && (
            <Text fz={"xs"} fw={"500"} c={"gray.7"}>
              {props.properties.description}
            </Text>
          )}
        </Stack>
      </Button>
    </div>
  );
};

export default MenuBody;
