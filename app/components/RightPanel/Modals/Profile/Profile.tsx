import { Button, Modal, rem, useMantineColorScheme } from "@mantine/core";
import { IconUser, IconShieldCheckFilled } from "@tabler/icons-react";
import style from ".././Modals.module.css";
import { useState } from "react";
import { useScrollIntoView } from "@mantine/hooks";

import EditProfile from "./EditProfile";
import AddEmail from "./AddEmail";
import RemoveEmail from "./RemoveEmail";
import RemoveConnected from "./RemoveConnected";
import AddConnected from "./AddConnected";
import SetPassword from "./SetPassword";
import AddTwoFactor from "./AddTwoFactor";
import DeleteAccount from "./DeleteAccount";
import Home from "./Home";
import { UserProfile } from "@clerk/nextjs";
import { root } from "postcss";
import { dark } from "@clerk/themes";

export default function Profile(props: { opened: boolean; setOpened: any }) {
  const { opened, setOpened } = props;
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({
    offset: 60,
    duration: 500,
  });
  const [activeTab, setActiveTab] = useState(
    "account" as "account" | "security"
  );
  const [active, setActive] = useState("home");
  const { colorScheme } = useMantineColorScheme();
  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      centered
      size={"auto"}
      padding={0}
      withCloseButton={false}
      radius={"lg"}
    >
      <UserProfile
        appearance={{
          baseTheme: colorScheme === "dark" ? dark : undefined,
        }}
      />
    </Modal>
    // <Modal
    //   opened={opened}
    //   onClose={() => setOpened(false)}
    //   centered
    //   size={900}
    //   padding={0}
    //   withCloseButton={false}
    // >
    //   <div className={style.modal}>
    //     {/* Left Container */}
    //     <div className={style.leftContainer}>
    //       <Button
    //         leftSection={
    //           <IconUser style={{ width: rem(14), height: rem(14) }} />
    //         }
    //         justify="start"
    //         variant={activeTab === "account" ? "filled" : "subtle"}
    //         onClick={() => {
    //           setActiveTab("account");
    //           setActive("home");
    //           scrollIntoView();
    //         }}
    //         color="gray"
    //       >
    //         Account
    //       </Button>
    //       <Button
    //         mt={10}
    //         leftSection={
    //           <IconShieldCheckFilled
    //             style={{ width: rem(14), height: rem(14) }}
    //           />
    //         }
    //         justify="start"
    //         variant={activeTab === "security" ? "filled" : "subtle"}
    //         onClick={() => {
    //           setActiveTab("security");
    //           setActive("home");
    //           scrollIntoView();
    //         }}
    //         color="gray"
    //       >
    //         Security
    //       </Button>
    //     </div>

    //     {/* Right Container */}
    //     <div className={style.rightContainer}>
    //       <Home
    //         activeTab={activeTab}
    //         active={active}
    //         setActive={setActive}
    //         targetRef={targetRef}
    //         scrollableRef={scrollableRef}
    //       />
    //       <EditProfile active={active} setActive={setActive} />
    //       <AddEmail active={active} setActive={setActive} />
    //       <RemoveEmail active={active} setActive={setActive} />
    //       <RemoveConnected active={active} setActive={setActive} />
    //       <AddConnected active={active} setActive={setActive} />
    //       <SetPassword active={active} setActive={setActive} />
    //       <AddTwoFactor active={active} setActive={setActive} />
    //       <DeleteAccount active={active} setActive={setActive} />
    //     </div>
    //   </div>
    //   {/* Modal content */}
    // </Modal>
  );
}
