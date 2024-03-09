import React from "react";
import { Button } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type MenuButtonProps = {
  properties: {
    title: string;
    description: string;
    icon: React.ReactNode;
  };
};

const MyButton = (props: MenuButtonProps) => {
  const { hovered, ref } = useHover();
  return (
    <div ref={ref}>
      <Button
        leftSection={props.properties.icon}
        fullWidth
        {...(hovered
          ? { color: "green", variant: "outline" }
          : { color: "black", variant: "transparent" })}
        justify="flex-start"
        styles={{
          root: {
            padding: "6px",
            height: "auto",
          },
        }}
      >
        <div className="flex flex-col text-left text-sm">
          <p className="font-semibold ">{props.properties.title}</p>
          <p className="text-gray-500 text-xs font-medium ">
            {props.properties.description}
          </p>
        </div>
      </Button>
    </div>
  );
};

export default MyButton;
