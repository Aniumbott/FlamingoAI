import React from "react";
import { Menu, Button, Stack, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type MenuButtonProps = {
  properties: {
    title: string;
    icon: React.ReactNode;
    // onClickAction?: () => void;
  };
};

type SingleMenuProps = {
  children: [
    {
      title: string;
      icon: React.ReactNode;
      onClickAction?: () => void;
    }
  ];
  target: React.ReactNode;
};

const SingleMenu = (props: SingleMenuProps) => {
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
          color: "#0F172A",
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
          section: {},
        }}
        // onClick={props.properties.onClickAction}
      >
        <Text fz={"sm"}>{props.properties.title}</Text>
      </Button>
    </div>
  );
};

export default SingleMenu;
