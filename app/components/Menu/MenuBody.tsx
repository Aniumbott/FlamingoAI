import React from "react";
import { Menu, Button, Text, rem, Popover } from "@mantine/core";
import MyButton from "./MenuButton";

type MenuBodyProps = {
  children: [
    {
      title: string;
      description: string;
      icon: React.ReactNode;
    }
  ];
  target: React.ReactNode;
};

const MenuBody = (props: MenuBodyProps) => {
  return (
    <Menu
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
      <Menu.Target>
        {props.target}
      </Menu.Target>

      <Menu.Dropdown>
        {props.children.map((item, index) => (
          <Menu.Item key={index}>
            <MyButton properties={item} />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

export default MenuBody;
