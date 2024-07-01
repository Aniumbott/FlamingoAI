// Modules
import { useEffect, useState } from "react";
import {
  ActionIcon,
  CloseButton,
  Text,
  Divider,
  useMantineColorScheme,
  Paper,
  Tooltip,
} from "@mantine/core";
import {
  IconCategory,
  IconTrendingUp,
  IconMessages,
  IconHelp,
  IconSun,
  IconMoon,
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
} from "@tabler/icons-react";

// Components
import style from "./RightPanel.module.css";
import { Protect, UserButton } from "@clerk/nextjs";
import PromptsPanel from "./Panels/PromptsPanel/PromptsPanel";
import CommentsPanel from "./Panels/CommentsPanel";
import ReportsPanel from "./Panels/ReportsPanel";
import NavigationBar from "./NavigationBar";

export default function RightPanel(props: {
  rightOpened: boolean;
  toggleRight: () => void;
}) {
  const { rightOpened, toggleRight } = props;
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [active, setActive] = useState(0);

  return (
    <>
      {/* RightPanel Navigation */}
      <NavigationBar
        active={active}
        setActive={setActive}
        rightOpened={rightOpened}
        toggleRight={toggleRight}
      />
      {/* Ralaven Content */}
      {active == 0 ? <PromptsPanel toggleRight={toggleRight} /> : null}
      {active == 1 ? <ReportsPanel toggleRight={toggleRight} /> : null}
      {active == 2 ? <CommentsPanel toggleRight={toggleRight} /> : null}
      {active == 3 ? help(toggleRight) : null}
    </>
  );
}

const reports = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>REPORTS</Text>
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
      </div>
      <Divider my="md" />
    </>
  );
};

const help = (toggleRight: () => void) => {
  return (
    <>
      <div className={style.activeTitle}>
        <Text>HELP</Text>
        <Tooltip label="Close" position="left" fz="xs">
          <CloseButton onClick={toggleRight} />
        </Tooltip>
      </div>
      <Divider my="md" />
    </>
  );
};
