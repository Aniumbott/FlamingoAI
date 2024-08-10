import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  { id: "getting-started", name: "Getting Started" },
  { id: "features", name: "Features" },
  { id: "pricing", name: "Pricing" },
  { id: "enterprise", name: "Enterprise" },
  { id: "support", name: "Support" },
];

const faqs = [
  {
    category: "getting-started",
    question: "What is Flamingo.ai?",
    answer:
      "Flamingo.ai is an all-in-one AI workspace for teams. It provides access to multiple AI models, enables group discussions, and streamlines your workflow—all in one intuitive platform. Whether you're a small team or a large organization, Flamingo.ai is designed to make AI collaboration efficient and cost-effective.",
  },
  {
    category: "getting-started",
    question: "Is there a free plan available?",
    answer:
      "Absolutely! We offer a free plan with no credit card required. This plan includes collaboration for up to 2 users, chat collaboration, folders and subfolders, a prompt library, member roles and permissions, usage reports, unlimited shared chats & prompts, and access to OpenAI models. It's a great way to experience the power of Flamingo.ai without any commitment.",
  },
  {
    category: "getting-started",
    question: "How do I get started with Flamingo.ai?",
    answer:
      "Getting started is easy! Simply sign up for our free plan to explore the platform. You can immediately start collaborating, organizing your chats into folders, and using our prompt library. If you need more features or users, you can easily upgrade to our Pro or Max plans. For larger organizations, our Enterprise plan offers custom solutions.",
  },
  {
    category: "features",
    question: "What AI models does Flamingo.ai support?",
    answer:
      "Flamingo.ai offers a wide range of AI models. Our free plan includes access to OpenAI models. The Pro plan adds support for Azure OpenAI, Anthropic Claude (Opus, Sonnet, Haiku), Meta Llama, Mistral, and OpenRouter (200+ LLMs) through API key integrations. This gives you the flexibility to choose the best AI model for your specific needs.",
  },
  {
    category: "features",
    question: "Can I collaborate with my team using Flamingo.ai?",
    answer:
      "Absolutely! Collaboration is at the heart of Flamingo.ai. Even our free plan supports collaboration for up to 2 users. You can engage in group chats with AI models, share prompts, and organize your work into folders and subfolders. Our Pro and Max plans support larger teams of up to 500 users, making it easy to collaborate on AI projects regardless of your team size.",
  },
  {
    category: "features",
    question: "What are AI Pages in Flamingo.ai?",
    answer:
      "AI Pages is an exciting feature available in our Max plan. Think of it like a smart document for editing text. You write, the AI helps, and together you create something great.",
  },
  {
    category: "features",
    question: "Does Flamingo.ai support image generation and recognition?",
    answer:
      "Yes, our Max plan includes image generation capabilities using DALL·E 3, allowing you to create stunning visuals directly within your workspace. Additionally, it features image recognition powered by Vision AI, enabling you to analyze and extract information from images. These visual AI capabilities can greatly enhance your team's creative and analytical processes.",
  },
  {
    category: "pricing",
    question: "How does Flamingo.ai's pricing work?",
    answer:
      "We offer flexible pricing to suit teams of all sizes. Our Pro plan starts at $20 per month for 10 seats, ideal for small teams of 3 to 500 users. The Max plan, which includes additional features like AI Pages and image generation, is $50 per month for 10 seats. Both plans are designed to grow with your team. For organizations with over 500 users, we offer custom Enterprise solutions. All plans have additional AI usage costs based on your actual usage of the AI models.",
  },
  {
    category: "pricing",
    question: "What's included in the Enterprise plan?",
    answer:
      "Our Enterprise plan is tailored for large organizations with over 500 users. It includes all features from the Max plan, plus private cloud deployment, a dedicated database, the ability to deploy custom GPT models, and custom domain & branding options. We work closely with enterprise clients to provide the best custom solution and pricing for their specific needs.",
  },
  {
    category: "pricing",
    question: "How do the AI usage costs work?",
    answer:
      "AI usage costs are separate from the base subscription price and are based on your actual usage of the AI models. This pay-as-you-go model ensures you're only paying for what you use. The specific costs can vary depending on the AI models you're using and the volume of your usage. We provide detailed usage reports to help you track and manage these costs effectively.",
  },
  {
    category: "features",
    question: "Can I organize my work within Flamingo.ai?",
    answer:
      "Definitely! Flamingo.ai offers robust organizational features. You can create folders and subfolders to structure your work logically. Our prompt library allows you to save and categorize useful prompts for easy access. Plus, with unlimited shared chats and prompts, you can keep all your AI interactions organized and accessible to your team.",
  },
  {
    category: "features",
    question: "How does Flamingo.ai handle team permissions?",
    answer:
      "Flamingo.ai provides flexible member roles and permissions, available even in our free plan. This allows you to control access to different features and content within your workspace. You can assign roles to team members, ensuring that sensitive information and powerful features are only accessible to those who need them.",
  },
  {
    category: "enterprise",
    question: "Can Flamingo.ai be customized for my organization's branding?",
    answer:
      "Absolutely! Our Enterprise plan offers custom domain and branding options. This means you can have Flamingo.ai match your organization's look and feel, providing a seamless experience for your team. It's like having your own branded AI workspace.",
  },
  {
    category: "enterprise",
    question: "Is it possible to deploy custom GPT models with Flamingo.ai?",
    answer:
      "Yes, this is a feature available in our Enterprise plan. You can deploy custom GPT models tailored to your organization's specific needs and knowledge base. This allows you to create AI interactions that are uniquely suited to your industry, terminology, and use cases.",
  },
  {
    category: "security",
    question: "How secure is Flamingo.ai?",
    answer:
      "Security is a top priority at Flamingo.ai. We offer private cloud deployment for our Enterprise customers, ensuring that your data and AI interactions are kept within your controlled environment. All plans benefit from our robust security measures, including encrypted communications and secure data storage. We're committed to protecting your information and intellectual property.",
  },
  {
    category: "support",
    question: "What kind of support does Flamingo.ai offer?",
    answer:
      "We provide comprehensive support for all our users. This includes detailed documentation, video tutorials, and responsive customer service. Our Pro and Max plan users benefit from priority support. Enterprise customers receive dedicated support, including personalized onboarding and training sessions. We're here to ensure you get the most out of Flamingo.ai.",
  },
  {
    category: "features",
    question: "Can Flamingo.ai integrate with other tools we use?",
    answer:
      "While we don't currently offer direct integrations with other tools, Flamingo.ai is designed to be a central hub for your AI workflows. You can easily copy and paste content between Flamingo.ai and other applications. For Enterprise customers, we can explore custom integrations based on your specific needs.",
  },
  {
    category: "getting-started",
    question: "How does Flamingo.ai compare to using individual AI services?",
    answer:
      "Flamingo.ai offers significant advantages over using individual AI services. Instead of paying $20 per user per month for each service like OpenAI, Claude, and Gemini, you get access to multiple AI models starting at just $2 per user per month (based on our Pro plan for 10 users). Plus, you benefit from our collaboration features, organizational tools, and unified interface. It's like having a premium AI suite at a fraction of the cost!",
  },
];
const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const filteredFAQs = faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 sm:py-20 lg:py-24">
      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Can&apos;t find the answer you&apos;re looking for?{" "}
            <Link
              href="mailto:support@flamingo.ai"
              className="text-purple-600 hover:text-purple-500 transition-colors duration-300"
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 sm:mt-16"
        >
          <div className="flex justify-center space-x-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="flex w-full text-left px-6 py-4 text-lg font-medium text-gray-900 hover:text-purple-600">
            <span className="mr-4">{question}</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-base text-gray-600">
            {answer}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default FAQ;
