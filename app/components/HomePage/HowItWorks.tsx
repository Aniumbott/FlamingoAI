'use client'
import {motion, useInView} from "framer-motion"
import Spacer from "./Spacer"
import SpacerCustomColor from "./SpacerCustomColor"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey, faUsers, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { useRef } from "react";

const HowItWorks = () => {
    
    return (
        <>
            <SectionHeading />
            <Cards />
            <SpacerCustomColor backgroundColor={'#F8F8FF'} height={50}/>
        </>
    )
}   
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
const SectionHeading = () => {
    return (
        <div
            className="bg-[#F8F8FF] flex flex-col ml-auto mx-auto p-[10px]"
            >
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-auto md:mx-[150px] gap-[20px] ">
            <SpacerCustomColor backgroundColor={'#F8F8FF'} height={20} />
            <div
                className="max-w-full text-center"
            >
                <div className="h-full">
                <h2 className="text-[#000E14] font-plex-sans text-[2.5rem] font-[700] leading-[2.6rem]">How it works?</h2>
                </div>
            </div>
            <SpacerCustomColor backgroundColor={'#F8F8FF'} height={20} />
            </div>
        </div>
    )
}
const Cards = () => {
    const steps = [
        {
          icon: faUser,
          title: 'Create a completely free account for your team.',
          number: 1,
        },
        {
          icon: faKey,
          title: 'Add your OpenAI API key.',
          subtitle: "Don't have one? Get yours here.",
          number: 2,
        },
        {
          icon: faPeopleGroup,
          title: 'Collaborate with your team on chats and prompts!',
          number: 3,
        },
      ];
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
    return (
        <div
            className="bg-[#F8F8FF] flex flex-col ml-auto mx-auto p-[10px]"
        >
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-auto md:mx-[150px] gap-[15px] ">

            {/* comp */}
            <motion.div 
                className="flex flex-col md:flex-row justify-center gap-[20px] items-center p-[10px] bg-[#F8F8FF]"
                variants={slideInUpVariants}
                initial="hidden"
                ref={ref}
                animate={isInView ? "visible" : "hidden"}
            >
            {steps.map((step) => (
                <motion.div key={step.number} className="bg-[#0d2327] text-white pt-[3rem] pb-[2rem] px-[2rem] rounded-[20px] w-[97%] md:w-[33%] h-full flex flex-col gap-[15px] justify-between "
                variants={itemVariants}
                >
                    <div className="flex justify-center items-center mx-auto  text-[#1CAB83] h-[25px] w-[20px] mb-4">
                        <FontAwesomeIcon icon={step.icon} className="w-[50px] h-[40px]"/>
                    </div>
                    <div>
                        <p className="text-center font-plex-sans text-[1rem] font-[500] mb-1">{step.number}. {step.title}</p>
                        {step.subtitle && (
                        <p className="text-center font-plex-sans text-[1rem] italic font-[500] text-[#1CAB83]">{step.subtitle}</p>
                        )}
                    </div>
                </motion.div>
            ))}
        </motion.div>
        </div>
        </div>
    )
}
export default HowItWorks