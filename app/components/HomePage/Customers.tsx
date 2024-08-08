"use client"
import { useRef } from "react";
import Spacer from "./Spacer"
import { motion, useInView } from "framer-motion";

const companies = [
    "https://team-gpt.com/wp-content/uploads/2023/08/maersk-300x74.png","https://team-gpt.com/wp-content/uploads/2023/10/Logos-website-3-e1696253710359-300x56.png","https://team-gpt.com/wp-content/uploads/2023/08/polkastarter-300x40.png","https://team-gpt.com/wp-content/uploads/2023/08/medesk-300x94.png","https://team-gpt.com/wp-content/uploads/2023/08/Charles-Schwab-Logo-2001-present-e1692039826365-300x52.png","https://team-gpt.com/wp-content/uploads/2023/08/limechain-1-300x90.png","https://team-gpt.com/wp-content/uploads/2023/08/Logos-website-1-300x65.png"
]

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
const Customer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
    return (
        <div className="bg-gray-100 p-8">
            <div className="flex flex-col py-2.5 justify-center basis-auto flex-shrink flex-grow self-auto gap-[20px] items-normal mx-auto h-full w-full max-w-[1140px] text-center">
                <div className="text-center text-[2.5rem] font-[700] text-black leading-[2.6rem]">Companies that trust us</div>
                <Spacer height={25}/>
                <motion.div
                    className="flex flex-col md:flex-row gap-[30px] md:gap-[4%] basis-auto justify-evenly flex-shrink p-[10px] mx-auto"
                    variants={slideInUpVariants}
                    initial="hidden"
                    ref={ref}
                    animate={isInView ? "visible" : "hidden"}
                >
                    {companies.map((_,idx) => (
                        <motion.div 
                            key={idx} className="flex flex-row items-center max-w-full smb-[20px] text-center"
                            variants={itemVariants}
                        >
                            <div className="h-full">
                                <img decoding="async" width="300" height="74" src={companies[idx]} className="w-[50vw] h-auto md:w-full inline-block align-middle" alt=""/>
                            </div>
                    </motion.div>
                    ))}
                </motion.div>
                <Spacer height={30} />
            </div>
        </div>
    )
}
export default Customer