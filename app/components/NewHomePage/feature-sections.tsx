import React from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";
import Link from "next/link";
import { Icons } from "../icons";
import { buttonVariants } from "../ui/button";
import ReactPlayer from "react-player/lazy";

const features = [
  {
    id: "feature-work",
    header: "Work together, simply",
    name: "A no-nonsense AI workspace for your team",
    description:
      "Chat, prompt, and discuss in one place. See how your team actually uses AI to get work done.",
    icon: Icons.openai,
    video: "https://cdn.llm.report/openai-demo.mp4",
    cta: "Get Started",
    href: "/login",
    reverse: false,
  },
  {
    id: "feature-folders",
    header: "Folders that make sense",
    name: "Keep the good stuff, ditch the rest",
    description:
      "Organize chats that matter into simple folders. Find what you need without the clutter.",
    icon: List,
    video: "https://cdn.llm.report/logs-demo.mp4",
    cta: "Get Started",
    href: "/login",
    reverse: true,
  },
  {
    id: "feature-prompts",
    header: "Prompts that work",
    name: "Stop guessing, start doing",
    description: "Why reinvent the wheel? Use proven prompts that get results.",
    icon: Icons.user,
    video: "https://cdn.llm.report/users-demo.mp4",
    cta: "Get Started",
    href: "/login",
    reverse: false,
  },
  {
    id: "feature-prompts",
    header: "See if it's actually working",
    name: "Know if your team is using AI or just talking about it.",
    description:
      "See who's using it, how much, and if it's making a difference.",
    icon: Icons.user,
    video: "https://cdn.llm.report/users-demo.mp4",
    cta: "Get Started",
    href: "/login",
    reverse: true,
  },
];

const FeatureSections = () => {
  return (
    <>
      {features.map((feature) => (
        <section id={feature.id} key={feature.id}>
          <div className="mx-auto px-6 md:px-20 py-6 sm:py-2">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-16 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
              <div
                className={cn("m-auto lg:col-span-2", {
                  "lg:order-last": feature.reverse,
                })}
              >
                <h2 className="text-lg font-bold leading-7 text-purple-600">
                  {feature.header}
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {feature.name}
                </p>
                <p className="mt-6 text-xl leading-8 text-gray-600">
                  {feature.description}
                </p>
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "default",
                      size: "lg",
                    }),
                    "mt-8"
                  )}
                  href={feature.href}
                >
                  {feature.cta}
                </Link>
              </div>
              <div className="m-auto lg:col-span-3 rounded-xl border shadow-2xl overflow-hidden">
                <ReactPlayer
                  url={feature.video}
                  playing={true}
                  loop={true}
                  muted={true}
                  controls={false}
                  width="100%"
                  height="100%"
                  fallback={<div>Loading...</div>}
                  config={{
                    file: {
                      attributes: {
                        poster: "/logo.png",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default FeatureSections;
