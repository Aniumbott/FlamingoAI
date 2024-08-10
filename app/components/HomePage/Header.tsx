// components/Header.js
"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { faChevronDown, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Group,
  Button,
  Divider,
  Anchor,
} from "@mantine/core";
import {SignInButton, SignUpButton, UserButton, useUser} from "@clerk/nextjs";
import { IconArrowUpRight } from "@tabler/icons-react";

const ChevronDownIcon = () => {
  return (
    <FontAwesomeIcon 
      icon={faChevronDown} 
      className="w-3 h-3" 
    />
  );
};

const Menu = () => {
  return (
    <ul className="py-[10px]">
      <li className="flex flex-row gap-[20px] justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/team-gpt-enterprise">Team-GPT Enterprise</Link>
      </li>
      <li className="flex flex-row gap-[20px] border-y-2 border-gray-400 justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#1CAB83] py-[14px] hover:bg-[#147a5d] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/deploy-on-your-own-server">Deploy on Your Own Server</Link>
      </li>
      <li className="flex flex-row gap-[20px] justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/collaborative-ai">Collaborative AI</Link>
      </li>
      <li className="flex flex-row gap-[20px] justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/pages-and-edit-with-ai">Pages and Edit with AI</Link>
      </li>
      <li className="flex flex-row gap-[20px] justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/ai-driven-workflows">AI-Driven Workflows</Link>
      </li>
      <li className="flex flex-row gap-[20px] justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/guaranteed-adoption">Guaranteed Adoption</Link>
      </li>
      <li className="flex flex-row gap-[20px] justify-start px-4 items-center font-plex-sans text-[1rem] font-[500] text-[#052727] py-[14px] hover:bg-[#052727] hover:text-white">
        <FontAwesomeIcon icon={faUsers} />
        <Link href="/faq">FAQ</Link>
      </li>
    </ul>
  );
};

const ProductMenu = () => {
  return (
    <div className="absolute top-20 left-[23%] mt-1 bg-white text-black shadow-xl rounded-xl py-4 w-74">
      <Menu />
    </div>
  );
};

const LearnMenu = () => {
  return (
    <div className="absolute top-20 left-[40%] mt-1 bg-white text-black shadow-xl rounded-xl py-4 w-74">
      <Menu />
    </div>
  );
};

export default function Header() {
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showLearnMenu, setShowLearnMenu] = useState(false);
  const productMenuRef = useRef<HTMLDivElement>(null);
  const productButtonRef = useRef<HTMLDivElement>(null);
  const learnMenuRef = useRef<HTMLDivElement>(null);
  const learnButtonRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productMenuRef.current &&
        productButtonRef.current &&
        !(productMenuRef.current as Node).contains(event.target as Node) &&
        !(productButtonRef.current as Node).contains(event.target as Node)
      ) {
        setShowProductMenu(false);
      }
      if (
        learnMenuRef.current &&
        learnButtonRef.current &&
        !(learnMenuRef.current as Node).contains(event.target as Node) &&
        !(learnButtonRef.current as Node).contains(event.target as Node)
      ) {
        setShowLearnMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductMouseEnter = () => {
    setShowProductMenu(true);
  };

  const handleProductMouseLeave = () => {
    setShowProductMenu(false);
  };

  const handleLearnMouseEnter = () => {
    setShowLearnMenu(true);
  };

  const handleLearnMouseLeave = () => {
    setShowLearnMenu(false);
  };

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-[#0d2327] text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="no-underline" target="_blank">
          <img
            src="https://team-gpt.com/wp-content/uploads/2023/09/Rectangle-White-Transparent-Border.svg"
            className="w-[130px] inline-block align-middle h-auto"
            alt=""
          />
        </a>
        <nav>
          <ul className="flex flex-row gap-[15px] no-underline p-[10px]">
            <div
              className="p-[15px] text-[1rem] font-[500] font-plex-sans flex flex-row items-center justify-center gap-x-1 hover:cursor-pointer hover:text-[#f1da44]"
              onMouseEnter={handleProductMouseEnter}
              onMouseLeave={handleProductMouseLeave}
            >
              <div>Product</div>
              <ChevronDownIcon />
              {showProductMenu && (
                <div
                  ref={productMenuRef}
                  onMouseEnter={handleProductMouseEnter}
                  onMouseLeave={handleProductMouseLeave}
                >
                  <ProductMenu />
                </div>
              )}
            </div>
            <div
              className="p-[15px] text-[1rem] font-[500] font-plex-sans flex flex-row items-center justify-center gap-x-1 hover:cursor-pointer hover:text-[#f1da44]"
              onMouseEnter={handleLearnMouseEnter}
              onMouseLeave={handleLearnMouseLeave}
            >
              <div>Learn</div>
              <ChevronDownIcon />
              {showLearnMenu && (
                <div
                  ref={learnMenuRef}
                  onMouseEnter={handleLearnMouseEnter}
                  onMouseLeave={handleLearnMouseLeave}
                >
                  <LearnMenu />
                </div>
              )}
            </div>
            <div className="p-[15px] text-[1rem] font-[500] font-plex-sans flex flex-row items-center justify-center gap-x-1 hover:cursor-pointer hover:text-[#f1da44]">
              <div>Enterprise</div>
            </div>
            <div className="p-[15px] text-[1rem] font-[500] font-plex-sans flex flex-row items-center justify-center gap-x-1 hover:cursor-pointer hover:text-[#f1da44]">
              <Link href='/pricing'>Pricing</Link>
            </div>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {/* <Link href="/login" className="hover:underline">
            Log in
          </Link>
          <Link href="/signup" className="bg-[#f1da44] text-black text-[1rem] font-plex-sans font-[500] px-6 py-2 rounded-xl transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90 hover:bg-[#f0d940]">
            Start free
          </Link> */}
          {isSignedIn ? (
            <Group>
              { (
                <>
                  <UserButton afterSignOutUrl="/" />
                  <Divider orientation="vertical" />
                </>
              )}
              <Anchor href="/workspace">
                <Button
                  variant="outline"
                  rightSection={<IconArrowUpRight size={20} />}
                >
                  Workspace
                </Button>
              </Anchor>
            </Group>
          ) : (
            <Group visibleFrom="sm">
              <SignInButton>
                {/* <Button variant="default">Log in</Button> */}
                <Link href="/login" className="hover:underline">
                Log in
              </Link>
              </SignInButton>
              <SignUpButton>
                {/* <Button>Sign up</Button> */}
                <Link href="/signup" className="bg-[#f1da44] text-black text-[1rem] font-plex-sans font-[500] px-6 py-2 rounded-xl transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90 hover:bg-[#f0d940]">
                  Start free
                </Link>
              </SignUpButton>
            </Group>
          )}
        </div>
      </div>
    </header>
  );
}
