import { useState } from "react";

export const StartFreeTrial = () => {
  const [hover, setHover] = useState(false);

  return (
    <a
      data-testid="cta-link-start-free-trial"
      href="/pricing"
      target=""
      rel=""
      className="h-[3rem] px-3 md:px-[16px] rounded-[2rem] hover:bg-theme-hover hover:border-theme-hover border-theme border-[2px] bg-theme text-white flex relative justify-center items-center gap-[0.5rem] cursor-pointer"
      style={{ transition: "all 200ms" }}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className=" text-xs min-w-max md:text-[15px] font-bold leading-[127%]">
        Try For Free
      </span>
      <svg
        width={16}
        height={14}
        viewBox="0 0 16 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="jsx-3151099842 icon icon--functional icon--arrow-cta"
        style={{
          transform: hover ? "translateX(5px)" : "translateX(0px)",
          transition: "transform 0.1s ease-in-out",
        }}
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.4 1 15 6.6l-5.6 5.6M15 6.6H1"
        />
      </svg>
    </a>
  );
};
