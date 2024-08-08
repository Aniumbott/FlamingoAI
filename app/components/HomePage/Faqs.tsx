"use client"
import Spacer from "./Spacer";
import SpacerCustomColor from "./SpacerCustomColor";
import SpacerMain from "./SpacerMain";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const Faqs = () => {
    const faqItems = [
        {
          question: "Can I try Team-GPT for free?",
          answer: "Absolutely, Team-GPT is free for up to 2 people. Sign up and try it with another person to explore all the possibilities for collaboration. The platform is designed to facilitate collaboration for teams of any size."
        },
        {
            question: "Are there any training materials or resources available to help my team adopt Team-GPT?",
            answer: "Team-GPT is built to simplify the complexities of AI. With Team-GPT anyone can become an expert in AI and find value in it. Just send them an invite and Team-GPT will take care of onboarding them with out ChatGPT for Work interactive course. The course is FREE and is integrated into the Team-GPT platform. Thanks to it many non-technical users have discovered the magic of AI collaboration. We also provide an extensive Knowledge Base filled with various resources to help you onboard your whole team into Team-GPT."
        },
        {
            question: "No, you don't need a ChatGPT Plus subscription to use Team-GPT.",
            answer: "Instead, you need to obtain an API key from OpenAI, which you can get here. After connecting your API key to Team-GPT, you can use the system and pay OpenAI for your usage. You’ll be billed at the end of the month based on your actual usage, which can be more cost-effective, especially if you’re collaborating with other people"
        },
        {
            question: "Can I chat with more than one AI model?",
            answer: "You will not be able to use Team-GPT without setting an OpenAI API key.After signing into Team-GPT, go to the Set API key menu. From there, you can enter your API key in the appropriate field and save the changes. This will connect your OpenAI API key to Team-GPT, allowing you to use the platform."
        },{
            question: "Why should I use Team-GPT, instead of ChatGPT?",
            answer: "ChatGPT Plus doesn’t have a team plan. You can only use it individually. As a team owner, you can even pay for your colleagues’ ChatGPT Plus subscription. Full Team-GPT vs ChatGPT comparison table.Team-GPT is a platform that allows you to collaborate with your team using ChatGPT. If you have someone to collaborate with, Team-GPT can help you make better use of ChatGPT.The models used by Team-GPT are provided by OpenAI’s ChatGPT API. Therefore, all interactions made through Team-GPT are equivalent to those made through the ChatGPT UI available at https://chat.openai.com/The value that Team-GPT provides is related to human collaboration. The model output is 100% the same."
        }
      ];
    return (
        <div className="bg-[#F8F8FF] flex flex-col max-w-full ">
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-auto gap-[15px] pt-[4rem] pb-[6rem] pl-[1rem] pr-[1rem]">
                <div className="max-w-full relative h-full">
                    <div className="flex flex-col bg-[#f8f8ff] pb-[2rem] px-[1rem] pt-[1rem] basis-auto flex-shrink flex-grow-0 text-center justify-center md:justify-normal">
                        <SpacerMain height={30}/>
                        <div className="flex flex-col gap-[30px] py-[15px]">
                            <h2 className="text-[#052727] font-plex-sans text-[2.5rem] font-[700] leading-[2.6rem] text-center">
                                Frequently Asked Questions
                            </h2>
                            <p className="mb-[1rem] mt-0 font-plex-sans tracking-wide text-black">Can&apos;t find what you&apos;re looking for here? Feel free to reach out: <a className="no-underline text-[#1cab83] font-plex-sans font-[500] text-[1rem]" href="mailto:humans@team-gpt.com" target="_blank" rel="noopener">humans@team-gpt.com</a></p>
                        </div>
                        <SpacerMain height={30}/>
                        <div className="max-w-full">
                            {faqItems.map((item, index) => (
                                <FAQItem key={index} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                        <SpacerMain height={35}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
const FAQItem = ({ question, answer }:{question: string; answer:string;}) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
        <div className="bg-white max-w-4xl rounded-xl mb-4 w-full mx-auto text-black">
            <button
                className="flex justify-between items-center w-full py-[19px] px-6 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-black">{question}</span>
                <FontAwesomeIcon
                    icon={isOpen ? faMinus : faPlus}
                    className={`ml-2 transition-transform duration-200 text-black ${isOpen ? 'transform rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-6 pb-4 text-start ">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export default Faqs;