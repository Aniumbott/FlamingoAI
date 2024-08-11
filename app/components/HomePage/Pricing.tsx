//@ts-nocheck
"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Spacer from "./Spacer"
import SpacerMain from "./SpacerMain"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import {
  Group,
  Text,
  Switch,
} from "@mantine/core";

const Pricing = () => {
    return (
        <>
            <PricingHeading />
            <PricingSection />
        </>
    )
}
const PricingHeading = () => {
    return (
        <div
            className="bg-[#052727] rounded-t-[24px] rounded-b-none flex flex-col w-full h-auto self-auto flex-wrap transition-all duration-300 basis-auto flex-shrink flex-grow-0 p-[10px]"
            >
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto mx-auto my-0 h-full w-full gap-[20px] mt-10">
                <SpacerMain height={40} />
                <div
                className="w-full flex flex-row justify-center items-center pl-5 md:pl-0">
                    <div className="h-full ">
                        <h2 className="text-[#F8F8FF] font-plex-sans text-[2.5rem] font-[700] leading-[2.6rem]">
                        A small price to pay.. to truly{" "}
                        <span
                            style={{
                                background: "linear-gradient(to right, rgba(1, 132, 97, 0.46), rgba(28, 255, 195, 0.50))",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent", 
                                backgroundClip: "text",
                                color: "transparent", 
                            }}
                            >
                            Adopt AI
                            </span>
                        <p></p>
                        </h2>
                    </div>
                </div>
                {/* <SpacerMain height={20}/> */}
            </div>
            </div>
    )
}
//@ts-ignore
const Slider = ({ min, max, step, value, onChange }) => {

  return (
    <div className="relative w-full bg-[#052727] h-[23px]  accent-zinc-700 rounded-full text-[#f1da44]  cursor-pointer border-[#afafaf] border-2">
      <input
          id="price-range"
          name="price-range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full  rounded-lg appearance-none cursor-pointer bg-[#052727] dark:bg-zinc-700"
        />
      
    </div>
  );
};

//@ts-ignore
const PricingTier = ({ tier, monthly }) => {
  const [userCount, setUserCount] = useState(tier.minUsers || 0);
  const calculatePrice = (users: number) => {
    
    if (tier.hasSlider) {
      return (tier.basePrice + (users - tier.minUsers) * tier.pricePerUser) * (monthly ? 1 : 10);
    }

    return tier.price;
  };

  const handleSliderChange = (e: { target: { value: any } }) => {
    setUserCount(Number(e.target.value));
  };

  return (
    <div className="flex flex-col w-[70vw] sm:w-full mx-auto border justify-between bg-custom-gradient hover:shadow-top-right border-[#1cffc3] rounded-[24px] shadow-xl p-6">
      <div>
        <h2 className="text-lg leading-6 font-medium text-[#21EFB8]">{tier.name}</h2>
        <p className="font-plex-sans font-[700] text-[2rem] text-white">{tier.title}</p>
        <p className="flex flex-row justify-end font-plex-sans font-[500] text-[1rem] text-[#AFAFAF] tracking-tight">Billed {monthly? "Monthly" : "Yearly"}</p>
        <div className="mt-4 w-full mb-4">
          <span className="text-[3.5rem] font-[800] text-white font-plex-sans">
            {tier.name !== 'FLAGSHIP' ? '$' : ''}{tier.hasSlider ? calculatePrice(userCount)  : tier.price}
          </span>
          <br/>
          {tier.period && <p className="text-white font-plex-sans block md:inline text-[1rem] text-[500] w-full">/{monthly? "month" : "year"}/10 members</p>}
        </div>
        <p className="text-[1rem] font-plex-sans font-[500] text-white">{tier.description}</p>
        
        {tier.hasSlider && (
          <div className="mt-4">
            <Slider
              min={tier.minUsers}
              max={tier.maxUsers}
              step={10}
              value={userCount}
              onChange={handleSliderChange}
            />
            <p className="mt-2 text-white">{userCount} users</p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <ul className="space-y-2">
          {tier.features.map((feature: any, index: any) => (
            <li key={index} className="flex items-center text-[#AFAFAF] text-[1rem] font-plex-sans font-[500]">
              <FontAwesomeIcon icon={faCheck} className="mr-2 text-[#21EFB8]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8">
        {tier.note && (
          <p className="text-[#afafaf] font-plex-mono font-[300] text-[0.9rem] text-center mb-2">
            {tier.note}
          </p>
        )}
        <button className={`w-full  border border-transparent rounded-xl py-4 px-4 text-[1.20rem] tracking-wide font-plex-mono font-medium text-black transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90 bg-[${tier.buttonText === 'Buy Now' ? '#F8F8FF' : '#F1DA44'}]`}
        onClick={()=>window.location.href="/workspace"}
        >
          {tier.buttonText}
        </button>
      </div>
    </div>
  );
};

const PricingSection = () => {
  const pricingTiers = [
    {
      name: "FREE",
      title: "Try it out",
      subtitle: "Up to 2 People",
      price: "0",
      description: "+ AI usage costs",
      features: ["Shared chats", "Prompt library", "Folders and subfolders", "Collaborate in ChatGPT", "Pay-per-use of OpenAI API"],
      note: "No Credit Card Required",
      buttonText: "Start free"
    },
    {
      name: "PRO",
      title: "Collaborate",
      subtitle: "Billed Monthly",
      basePrice: 20,
      pricePerUser: 0.5,
      minUsers: 10,
      maxUsers: 500,
      period: "/team/month",
      description: "+ AI usage costs",
      features: [
        "Everything in Free",
        "Up to 500 people",
        "Personal OpenAPI Keys",
        "Azure OpenAI Integration",
        "Member roles and permissions"
      ],
      buttonText: "Buy Now",
      hasSlider: true
    },
    {
      name: "MAX",
      title: "Step Up",
      subtitle: "Billed Monthly",
      basePrice: 50,
      pricePerUser: 5,
      minUsers: 10,
      maxUsers: 500,
      period: "/team/month",
      description: "+ AI usage costs",
      features: [
        "Everything in Pro",
        "AI Editing with Pages",
        "Image generation with DALL-E 3",
        "Anthropic Claude Integration",
        "Custom models LLaMa, Mixtral"
      ],
      buttonText: "Buy Now",
      hasSlider: true
    },
    {
      name: "FLAGSHIP",
      title: "Enterprise",
      subtitle: "",
      price: "",
      description: "Maximize safety and productivity with a robust enterprise-ready plan.",
      features: [
        "Everything in MAX",
        "Deploy on Private cloud or on Premises",
        "No training on your data",
        "Custom models",
        "Key account management"
      ],
      note: "Talk to us for the best custom solution and pricing for your business!",
      buttonText: "Get in touch"
    }
  ];
  const [isMonthly, setIsMonthly] = useState(false);

  return (
    <div className="bg-[#052727] flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Group justify="center" w="100%">
        <Text c={isMonthly ? "white" : "green" }>
          Yearly
        </Text>
        <Switch
          size="md"
          checked={isMonthly}
          onClick={() => {
            setIsMonthly(!isMonthly);
          }}
          color={isMonthly ? "green" : "gray"}
        />
        <Text c={isMonthly ? "green" : "white"}>
          Monthly
        </Text>
      </Group>
      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-4">
        {pricingTiers.map((tier) => (
          <PricingTier key={tier.name} tier={tier} monthly={isMonthly}/>
        ))}
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-300 text-[1.5rem] font-[400] font-plex-sans leading-[1.65rem]">
          Have pricing questions? Contact us at{' '}
          <a href="mailto:contact@flamingo.ai" className="text-[#1CFFC3] hover:underline">
            contact@flamingo.ai
          </a>
        </p>
      </div>
      <SpacerMain height={25} />
    </div>
  );
};
export default Pricing;