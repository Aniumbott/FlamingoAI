import { IChatDocument } from "@/app/models/Chat";
import { useRouter, usePathname } from "next/navigation";
import { IconAlignJustified } from "@tabler/icons-react";
import { Text } from "@mantine/core";
import style from "../RightPanel/RightPanel.module.css";

export default function ChatItem(props: { item: IChatDocument }) {
  const router = useRouter();
  const pathname = usePathname();
  const { item } = props;
  return (
    <>
      <div
        className={style.prompt}
        onClick={() => {
          router.push(
            pathname.split("/").slice(0, 3).join("/") + "/" + item._id
          );
        }}
      >
        <IconAlignJustified
          color="gray"
          style={{
            width: "1rem",
            height: "1rem",
          }}
        />
        <Text size="sm" style={{ marginLeft: "0.5rem" }}>
          {item.name}
        </Text>
      </div>
    </>
  );
}
