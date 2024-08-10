"use client";

import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import BackedBy from "./backed-by";
import ShimmerButton from "../magicui/shimmer-button";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 flex flex-col items-center gap-6 md:gap-8 lg:gap-10">
          <m.h1
            className="flex flex-col md:mt-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <span className="leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">
                All-in-one AI workspace for teams
              </span>
            </span>
          </m.h1>

          <m.p
            className="text-gray-800 leading-relaxed text-lg sm:text-xl max-w-2xl text-center"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            Access all AI models, engage in group discussions, and streamline
            your workflow—all in one intuitive workspace.
          </m.p>

          <m.div
            className="flex flex-col items-center justify-center w-full max-w-md"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <ShimmerButton
              className="w-full sm:w-auto shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_8px_rgba(147,51,234,0.5)]"
              background="radial-gradient(ellipse 80% 70% at 50% 120%, #D53F8C, #9333EA)"
              onClick={() => {
                router.push("/login");
              }}
            >
              <span className="whitespace-pre-wrap text-center text-sm sm:text-base lg:text-lg font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                Get started for free
              </span>
              <ChevronRight className="h-5 w-5 duration-300 ease-in-out transform group-hover:translate-x-1 ml-2" />
            </ShimmerButton>
          </m.div>

          <m.div
            className="mt-8 w-full max-w-xl"
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { type: "spring" } },
            }}
          >
            <BackedBy />
          </m.div>
        </div>
      </div>

      <div className="w-full px-4 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <m.div
          className="mx-auto max-w-[90%] lg:max-w-[1200px]"
          variants={{
            hidden: { opacity: 0, y: -10 },
            show: { opacity: 1, y: 0, transition: { type: "spring" } },
          }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <div className="aspect-w-16 aspect-h-9">
              <video
                src="https://cdn.llm.report/openai-demo.mp4"
                autoPlay
                loop
                muted
                className="rounded-xl border shadow-2xl object-cover"
              />
            </div>
          </Suspense>
        </m.div>
      </div>
    </div>
  );
};

export default Hero;
