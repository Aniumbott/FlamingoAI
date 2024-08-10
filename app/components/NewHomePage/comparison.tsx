import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const Comparison = () => {
  return (
    <section className="relative py-12 lg:py-20 bg-gray-50">
      <div className="relative max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BeforeCard />
          <AfterCard />
        </div>
      </div>
    </section>
  );
};

const BeforeCard = () => {
  return (
    <div className="transition-all duration-300 bg-white shadow-lg ring-1 ring-gray-200 rounded-2xl hover:shadow-xl">
      <div className="p-8 sm:p-12">
        <CardHeader
          icon={<AlertCircle className="text-red-500" />}
          text="Before: Multiple AI Services"
        />
        <h4 className="mt-4 text-xl font-semibold tracking-tight text-gray-900 font-display sm:text-2xl">
          Juggling multiple AI services is costly and inefficient
        </h4>
        <ul className="mt-6 space-y-3 text-base text-gray-700 sm:text-lg">
          <ListItem icon={<CrossIcon />}>
            💸 $20 per user/month for OpenAI
          </ListItem>
          <ListItem icon={<CrossIcon />}>
            💸 $20 per user/month for Claude
          </ListItem>
          <ListItem icon={<CrossIcon />}>
            💸 $20 per user/month for Gemini
          </ListItem>
          <ListItem icon={<CrossIcon />}>
            🔀 Switching between multiple platforms
          </ListItem>
          <ListItem icon={<CrossIcon />}>
            🔍 Lack of centralized workspace for team collaboration
          </ListItem>
          <ListItem icon={<CrossIcon />}>
            📊 No unified management of prompts and chat history
          </ListItem>
        </ul>
      </div>
    </div>
  );
};

const AfterCard = () => {
  return (
    <div className="transition-all duration-300 shadow-lg bg-gradient-to-r from-purple-600 to-pink-400 rounded-2xl hover:shadow-xl">
      <div className="p-8 sm:p-12">
        <CardHeader
          icon={<CheckCircle2 className="text-white" />}
          text="After: Flamingo.ai All-in-One Workspace"
          textColor="text-white"
        />
        <h4 className="mt-4 text-xl font-semibold tracking-tight text-white font-display sm:text-2xl">
          Streamline your AI workflow and boost team productivity
        </h4>
        <ul className="mt-6 space-y-3 text-base text-white sm:text-lg">
          <ListItem icon={<CheckIcon />}>
            💰 Only $2 per user/month + API usage costs
          </ListItem>
          <ListItem icon={<CheckIcon />}>
            🚀 Access to OpenAI, Claude, Gemini, and more in one place
          </ListItem>
          <ListItem icon={<CheckIcon />}>
            👥 Group chats with LLMs for team collaboration
          </ListItem>
          <ListItem icon={<CheckIcon />}>
            📂 Organize chats into folders for easy management
          </ListItem>
          <ListItem icon={<CheckIcon />}>
            💬 Add comments for enhanced team communication
          </ListItem>
          <ListItem icon={<CheckIcon />}>
            📚 Shared prompts and proven prompt templates
          </ListItem>
        </ul>
      </div>
    </div>
  );
};

const CardHeader = ({
  icon,
  text,
  textColor = "text-gray-700",
}: {
  icon: React.ReactNode;
  text: string;
  textColor?: string;
}) => (
  <div className="inline-flex items-center gap-2">
    {icon}
    <p className={`text-base font-semibold ${textColor}`}>{text}</p>
  </div>
);

const ListItem = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <li className="flex items-start gap-3 font-display">
    <div className="pt-1 shrink-0">{icon}</div>
    {children}
  </li>
);

const CrossIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default Comparison;
