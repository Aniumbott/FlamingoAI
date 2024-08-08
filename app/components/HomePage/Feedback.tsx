"use client"
import Link from "next/link";
import SpacerCustomColor from "./SpacerCustomColor";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";


const fadeInUpVariants = {
    initial: {
        opacity: 0,
        y: "100%"
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
        duration: 2,
        ease: "easeOut"
        }
    }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1 }
    }
};
const slideInUpVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };
const Feedback = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: false });
    return (
        <>
            <motion.div
                variants={slideInUpVariants}
                initial="hidden"
                ref={ref}
                animate = {isInView ? "visible" : "hidden"}
            >
                <FeedbackHeading />
                <FeedbackContent />
                <FeedbackFooter />
            </motion.div>
        </>
    )
}

const FeedbackHeading = () => {
    return (
        <div className="bg-[#052727] flex flex-col rounded-t-[24px] -mt-6 mb-0 ml-0 mr-0">
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-auto sm:mx-[150px] gap-[20px] py-[10px]">
                <SpacerCustomColor backgroundColor={'#052727'} height={14}/>
                <div className="flex flex-row w-full h-full flex-grow self-stretch sm:flex-wrap justify-center items-center rounded-[20px] p-3 md:p-8 custom-bg-transition">
                    <div className="w-[76%] flex flex-row justify-center items-center text-center p-1 md:p-2.5">
                        <div className="max-w-full text-center relative">
                        <h2 className="font-plex-sans text-[#ffffff] text-[1.7rem] sm:text-[2.5rem] font-[700] leading-[2.6rem]">Why our users loves us?</h2>
                        </div>
                    </div>
                </div>
                <SpacerCustomColor backgroundColor={'#052727'} height={10}/>
            </div>
        </div>
    )
}
const FeedbackFooter = () => {
    return (
        <div className="bg-[#052727] flex flex-col rounded-b-[24px] -mt-6 mb-0 ml-0 mr-0">
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-[150px] gap-[20px] py-[10px]">
                <SpacerCustomColor backgroundColor={'#052727'} height={25}/>
            </div>
        </div>
    )
}
const feedbackDataFirst = [
    {
        name: "NG",
        image: "https://team-gpt.com/wp-content/uploads/2023/08/NG.jpeg",
        feedback: "All I can say is a huge Thank You for a streamlined way to keep my chat work and prompts organised... so now my team and I can work in the same GPT space... Perfect for team organisation, transparency & collaboration. Even if you’re a solopreneur, you will love the folder structure!"
    },
    {
        name: "Ludovic",
        image: "https://team-gpt.com/wp-content/uploads/2024/05/1-1.png",
        feedback: "We quickly set up Team GPT for our team, taking less than three minutes to start working. Now we enjoy collaboration, transparency, and the added benefit of usage reports which help us track adoption and expenses. Team-GPT has saved hundreds of hours to our team. I cannot imagine going back to a time without it."
    },
];
const feedbackDataSecond = [
    {
        name: "Amine Here",
        image: "https://team-gpt.com/wp-content/uploads/2023/08/download.jpeg",
        feedback: "UI of Team-GPT is very intuitive and easy to navigate creating folders and saving your prompts."
    },
    {
        name: "Duy Nguen",
        image: "https://team-gpt.com/wp-content/uploads/2023/08/duy-nguen-1.jpeg",
        feedback: "This actually makes a lot of sense for teams. I often need to show my team members how to use this prompt or that prompt. With a tool like this, I don’t need to show them long screenshots anymore to navigate creating folders and saving your prompts."
    },
    {
        name: "Carl Borg",
        image: "https://team-gpt.com/wp-content/uploads/2023/08/carl-borg.jpeg",
        feedback: "Makes interacting with GPT-4 super-easy and collaboration across the team, a breeze. I predict this will greatly boost our productivity by making it a lot easier for our company to start using AI in our day-to-day."
    }
]
const FeedbackContent = () => {
    return (
        <div className="bg-[#052727] flex flex-col p-[10px] w-full h-full">
            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-[20px] p-[10px] w-full">
                {feedbackDataFirst.map((item, index) => (
                    <div key={index} className={`bg-[#F8F8FF] rounded-xl flex flex-col justify-center items-center p-[25px] md:p-[20px] w-[95%] md:w-[49%]`}>
                        <div className="h-[52px] w-[52px] rounded-full flex flex-col justify-start items-center mr-auto">
                            <img className="rounded-full items-start w-full h-full"  decoding="async" src={item.image} />
                        </div>
                        <div className="text-[#4B4D4D] font-plex-sans font-[200]  leading-[1.4rem] text-[1rem] my-[15px]">
                            {item.feedback}
                        </div>
                        <div className="mr-auto">
                            <span className="text-[#052727] text-left font-plex-sans text-[1rem] font-[500]"></span>{item.name}
                        </div>
                    </div>
                ))}
                <div className="flex flex-col md:flex-row flex-wrap justify-center items-normal gap-[20px] p-[10px] w-full">
                {feedbackDataSecond.map((item, index) => (
                    <div key={index} className={`bg-[#F8F8FF] rounded-xl flex flex-col justify-center items-start p-[25px] md:p-[20px] w-[95%] md:w-[32%]`}>
                        <div className="h-[52px] w-[52px] rounded-full flex flex-col justify-start items-center mr-auto">
                            <img className="rounded-full items-start w-full h-full" width="1024" height="1024" decoding="async" src={item.image} />
                        </div>
                        <div className="text-[#4B4D4D] font-plex-sans font-[200]  leading-[1.4rem] text-[1rem] my-[15px]">
                            {item.feedback}
                        </div>
                        <div className="mr-auto">
                            <span className="text-[#052727] text-left font-plex-sans text-[1rem] font-[500]"></span>{item.name}
                        </div>
                    </div>
                ))}
            </div>
            </div>
            
        </div>
    )
}
export default Feedback;