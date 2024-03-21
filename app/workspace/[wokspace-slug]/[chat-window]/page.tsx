"use client";

import React, { useState } from "react";
import Workspace from "../page";
import { usePathname } from "next/navigation";
import { Text } from "@mantine/core";

export default function ChatWindow() {
  const pathname = usePathname();
  const [currentChat, setCurrentChat] = useState<String>(
    pathname.split("/")[3]
  );
  return (
    <Workspace>
      <Text>{currentChat}</Text>
    </Workspace>
  );
}
