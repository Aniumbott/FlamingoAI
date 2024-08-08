// MobileHeader.tsx
"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useCycle } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faUsers } from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { title: "Product", path: "/", submenu: true },
  { title: "Learn", path: "/learn", submenu: true },
  { title: "Enterprise", path: "/enterprise" },
  { title: "Pricing", path: "/pricing" },
];

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const MobileHeader = () => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`md:hidden fixed inset-0 z-50 w-full ${
        isOpen ? "" : "pointer-events-none"
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-[#0d2327]"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16 max-h-screen overflow-y-auto"
      >
        {NAV_ITEMS.map((item, idx) => (
          <div key={idx}>
            {item.submenu ? (
              <MenuItemWithSubMenu item={item} toggleOpen={toggleOpen} />
            ) : (
              <MenuItem className="mt-2">
                <Link
                  href={item.path}
                  onClick={() => toggleOpen()}
                  className={`flex w-full text-[1rem] font-plex-sans text-white`}
                >
                  {item.title}
                </Link>
              </MenuItem>
            )}
            {idx < NAV_ITEMS.length - 1 && (
              <MenuItem className="my-3 h-px w-full bg-gray-600" />
            )}
          </div>
        ))}
        <MenuItem className="my-2">
          <Link
            href="/login"
            className="flex w-full text-[1rem] font-plex-sans text-white"
          >
            Log in
          </Link>
        </MenuItem>
        <MenuItem className="my-2">
          <Link
            href="/signup"
            className="bg-[#f1da44] text-black text-[1.2rem] font-plex-sans font-[500] px-8 py-4 rounded-xl transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90 hover:bg-[#f0d940]"
          >
            Start free
          </Link>
        </MenuItem>
      </motion.ul>
      <div className="flex flex-row justify-between items-center bg-[#0d2327] h-[50px] py-6 pr-4">
        <div className="p-4">
          <img
            src="https://team-gpt.com/wp-content/uploads/2023/09/Rectangle-White-Transparent-Border.svg"
            className="w-[135px] inline-block align-middle h-auto"
            alt=""
          />
        </div>
        <MenuToggle toggle={toggleOpen} />
      </div>
    </motion.nav>
  );
};

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-4 top-[14px] z-30"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 100%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemWithSubMenu = ({ item, toggleOpen }: any) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem className="mt-2">
        <button
          className="flex w-full text-1[rem] text-white font-plex-sans bg-transparent border-none"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className="flex flex-row justify-between w-full items-center">
            <span className="">{item.title}</span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-4 h-4 ${subMenuOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>
      </MenuItem>
      <div className="mt-2 ml-2 flex flex-col space-y-2">
        {subMenuOpen && item.title === "Product" && (
          <div className="bg-white shadow-xl rounded-xl ">
            {/* Add your submenu items here */}
            <MenuItem className="">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white list-none">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[20px] bg-white rounded-xl justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white list-none">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white list-none">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white list-none">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white list-none">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
          </div>
        )}
        {subMenuOpen && item.title === "Learn" && (
          <div className="bg-white shadow-xl rounded-xl">
            {/* Add your submenu items here */}
            <MenuItem className="">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[20px] bg-white rounded-xl justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
            <MenuItem className="bg-white rounded-xl shadow-xl">
              <li className="flex flex-row gap-[15px] rounded-xl bg-white justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
                <FontAwesomeIcon icon={faUsers} />
                <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
              </li>
            </MenuItem>
          </div>
        )}
      </div>
    </>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

export default MobileHeader;
