// Modules
import { useHover, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, Group, Text, ActionIcon, TextInput } from "@mantine/core";

// Components
import { IPageDocument } from "@/app/models/Page";
import { updatePage } from "@/app/controllers/pages";
import style from "../LeftPanel.module.css";
import { IconDots } from "@tabler/icons-react";
import PageMenu from "../Menu/PageMenu";

export default function PageItem(props: { page: IPageDocument }) {
  const pathname = usePathname();
  const { page } = props;
  const { hovered, ref } = useHover();
  const [menuOpen, setMenuOpen] = useState(false);
  const [rename, setRename] = useState(false);
  let actionIconVisible = hovered || menuOpen;

  useEffect(() => {
    actionIconVisible = hovered || menuOpen;
  }, [hovered, menuOpen]);

  function isActive(pathname: string, id: string) {
    return pathname.split("/")[4] === id;
  }

  return (
    <div
      className={style.prompt}
      onClick={() => {
        const newUrl =
          pathname?.split("/").slice(0, 3).join("/") + "/page/" + page._id;
        window.history.pushState({}, "", newUrl);
        console.log(pathname.split("/")[4]);
      }}
    >
      <div ref={ref} className="flex flex-row justify-between w-full">
        {rename ? (
          <TextInput
            autoFocus
            variant="filled"
            placeholder="Rename"
            onClick={(event) => {
              event.stopPropagation();
            }}
            onBlur={() => setRename(false)}
            onKeyDown={(event) => {
              event.stopPropagation();
              if (event.key === "Enter") {
                updatePage(page._id, {
                  name: event.currentTarget.value,
                }).then((res) => {
                  setRename(false);
                });
              }
            }}
          />
        ) : (
          <div className="grow max-w-[210px]">
            <Text
              truncate="end"
              size="sm"
              style={{
                marginLeft: "0.1rem",
                color: isActive(pathname, page._id)
                  ? "var(--mantine-primary-color-filled)"
                  : "",
              }}
            >
              {page.name}
            </Text>
          </div>
        )}

        {actionIconVisible && !rename && (
          <ActionIcon
            size="20px"
            variant="subtle"
            aria-label="Dots"
            color="#9CA3AF"
            // {...(hovered ? { opacity: "1" } : { opacity: "0" })}
            style={{
              "--ai-hover-color": "white",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PageMenu
              page={page}
              open={menuOpen}
              setRename={setRename}
              setOpen={setMenuOpen}
            />
          </ActionIcon>
        )}
      </div>
    </div>
  );
}
