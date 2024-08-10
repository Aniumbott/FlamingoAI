"use client"
import {motion} from "framer-motion"
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spacer from './Spacer';
import Link from 'next/link';
import { useRef } from 'react';
import { useInView } from 'framer-motion';


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
const testimonialsData = [
  {
    title: "Folders and Subfolders",
    heading: "Reduce clutter and organize knowledge",
    description: [
      "Most chats are trash… but not all.",
      "Categorize the good ones, order them in folders and subfolders, and reduce clutter.",
      "A well-organized ChatGPT workspace enhances accessibility, knowledge sharing, and team collaboration.",
    ],
    features: [
      { text: "Organize chats in folders" },
      { text: "Organize chats in folders" },
      { text: "Organize chats in folders" },
    ],
    buttonText: "Start free",
    buttonLink: "/signup",
    mainImage: {
      src: "https://team-gpt.com/wp-content/uploads/2023/09/Folders-and-Subfolders.png",
      alt: "Folders and Subfolders in ChatGPT",
    },
    testimonials: [
      {
        text: "Perfect for team organisation, transparency & collaboration.",
        author: "George Willson",
        image: "https://team-gpt.com/wp-content/uploads/2023/10/download-10.jpeg",
      },
    ],
  },
  {
    title: "Prompt Library",
    heading: "Learn ChatGPT as a team and reach the next level of productivity",
    description: [
      "Learn by example.",
      "Never start from scratch with our tried-and-tested converstaion starters.",
      "Explore how your own team is engaging with ChatGPT to expedite your journey to AI adoption.",
    ],
    features: [
      { text: "100+ ready-to-use prompt templates" },
      { text: "50+ Tips and Tricks to help you master GPT" },
      { text: "Learn and improve by having group chats with the AI" },
    ],
    buttonText: "Start free",
    buttonLink: "/signup",
    mainImage: {
      src: "https://team-gpt.com/wp-content/uploads/2023/08/Learn-ChatGPT.png",
      alt: "Folders and Subfolders in ChatGPT",
    },
    testimonials: [
      {
        text: "I purchased Team-GPT and so far, love it! The interface is incredibly user-friendly, making it easy for me to generate high-quality content quickly",
        author: "Lori N",
        image:
          "https://team-gpt.com/wp-content/uploads/2023/08/lori-newman-2021.webp",
      },
    ],
  },
  {
    title: "Cost Savings",
    heading: "10x cheaper and faster than ChatGPT aaand... collaborative",
    description: [
      "Pay only for what you use.",
      "Eliminate the wait limits of ChatGPT Plus with priority access to the OpenAI API.",
      "Example for a team of 20:",
      "ChatGPT Plust cost $20X20 = $400/m, while Team-GPT would cost ~ $40 + $110(of API usage) /m",
    ],
    features: [
      { text: "Pay only for what you use" },
      { text: "Priority access to the OpenAI API" },
      { text: "Team-GPT handles company billing and invoices" },
    ],
    buttonText: "Start free",
    buttonLink: "/signup",
    mainImage: {
      src: "https://team-gpt.com/wp-content/uploads/2023/08/10x-Cheaper-than-ChatGPT.png",
      alt: "Folders and Subfolders in ChatGPT",
    },
    testimonials: [
      {
        text: "6 hours of constant prompting cost me .33 cents. Kudos to the developers of Team-GPT. This is a great app and is WORTH ITS WEIGHT IN GOLD!",
        author: "Tim Man",
        image:
          "https://team-gpt.com/wp-content/uploads/2023/08/Tim_Beauty_001_SQUARE.webp",
      },
    ],
  },
  {
    title: "Adoption Reports",
    heading:
      "Measure your AI adoption rate and ensure your team is taking to the AI",
    description: [
      "Team-GPT really wants you to add AI to your team.",
      "Gain invaluable insights into your team's adoption rate and engagement level with ChatGPT.",
    ],
    features: [
      { text: "Ranking of the top users" },
      { text: "Number of chats and messages" },
      { text: "Adoption rate of the whole company" },
    ],
    buttonText: "Start free",
    buttonLink: "/signup",
    mainImage: {
      src: "https://team-gpt.com/wp-content/uploads/2023/09/Adoption-Reports.png",
      alt: "Folders and Subfolders in ChatGPT",
    },
    testimonials: [
      {
        text: "Within an hour of activating it, I was able to get my yeam using it and getting immediate value. I highly recomment Team-GPT.",
        author: "Derek",
        image:
          "https://team-gpt.com/wp-content/uploads/elementor/thumbs/Derek-qc2helug6n3jsrdxpoacplt31lpvygnume1r74dzhk.jpeg",
      },
    ],
  },
];

const Testimonials = () => {
  return (
    <>
      {testimonialsData.map((testimonial, idx) =>
        idx % 2 === 0 ? (
          <TestimonialEven key={idx} testimonial={testimonial} idx={idx} />
        ) : (
          <TestimonialOdd key={idx} testimonial={testimonial} idx={idx} />
        )
      )}
    </>
  );
};

const TestimonialEven = ({
  testimonial,
  idx,
}: {
  testimonial: any;
  idx?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  return (
    <div
      className={`flex flex-row w-auto h-full flex-grow self-stretch flex-wrap gap-0 transition-all duration-300 pl-0 pr-0 mx-auto pb-4 justify-normal items-normal ${
        idx && idx === 0 ? "pt-24 pl-0" : "pt-10"
      }`}
    >
      <div className="flex flex-col  md:flex-row flex-basis-auto flex-wrap justify-center items-center w-full h-full mx-auto md:mx-[150px] my-0 flex-grow flex-shrink self-auto py-8">
        <div className="flex flex-col w-auto h-auto flex-grow-0 min-h-[100px] gap-[20px] self-auto flex-wrap items-center transition-all duration-300 pt-8 pb-8 pl-8 pr-8 md:w-1/2 basis-auto flex-shrink max-w-[1140px]">
          <div className="p-2.5 bg-gray-300 rounded-md h-full justify-start mr-auto">
            <div className="font-plex-sans text-[1rem] font-[500] text-black leading-[1rem]">
              {testimonial.title}
            </div>
          </div>
          <div className="w-full mb-0 mt-2 relative">
            <div className="max-w-full text-left">
              <div className="h-full">
                <h2 className="text-[#052727] font-plex-sans text-[2.5rem] font-[700] leading-[2.6rem]">
                  {testimonial.heading}
                </h2>
              </div>
            </div>
          </div>
          <div className="max-w-[100%] font-plex-sans text-[1rem] font-[500] text-[#052727]">
            <div className="h-full box-border">
              {testimonial.description.map((para: string, idxx: number) => (
                <p
                  key={idxx}
                  className="mt-0 mb-[0.9rem] text-[#052727] text-[1rem] font-plex-sans font-[500] box-border"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
          <div className="max-w-[100%] font-plex-sans text-[1rem] font-[500] text-[#052727] relative mr-auto">
            <div className="h-full box-border">
              <ul className="list-none">
                {testimonial.features.map((feature: any, idx: any) => (
                  <li
                    key={idx}
                    className="flex flex-row justify-start items-center text-left mb-[2px]"
                  >
                    <span className="font-plex-sans items-start text-left h-[20px] w-[20px]">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="h-full w-full"
                      />
                    </span>
                    <span className="font-plex-sans text-[1rem] font-[500] pl-[5px]">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Spacer height={33} />
          <div className="max-w-full relative mr-auto font-plex-sans flex flex-col flex-wrap justify-start items-start content-start gap-0 basis-auto grow-0 shrink-0 order-0 self-auto">
            <Link
              href={testimonial.buttonLink}
              className="bg-[#F1DA44] text-black px-8 py-3 rounded-xl text-[1.25rem] font-[500] inline-flex items-center transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90"
            >
              {testimonial.buttonText}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <Spacer height={25} />
        </div>
        <div className="flex flex-col w-auto h-auto flex-grow-0 min-h-[100px] gap-[20px] self-auto flex-wrap items-center transition-all duration-300 pt-8 pb-8 pl-8 pr-8 md:w-1/2 basis-auto flex-shrink max-w-[1140px]">
          <motion.div
            className="flex max-w-full justify-center items-center text-center w-full relative"
            initial="hidden"
            ref={ref}
            variants={slideInUpVariants}
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="h-full">
              <img
                decoding="async"
                width="2556"
                height="1434"
                src={testimonial.mainImage.src}
                className="inline-block align-middle h-auto max-w-full"
                alt={testimonial.mainImage.alt}
              />
            </div>
          </motion.div>
          <Spacer height={17} />
          {testimonial.testimonials.map((singleTestimonial: any, idx: any) => (
            <div
              key={idx}
              className="flex flex-row w-full h-full flex-grow self-stretch flex-wrap items-start transition-all duration-300 rounded-[20px] mt-[2px] mb-[2px] ml-[2px] mr-[2px] max-w-[1140px]"
            >
              <div className="w-full flex flex-row basis-auto gap-[23px]">
                <motion.div className="max-w-full text-center relative h-fit w-[20%] p-[10px]">
                  <img
                    decoding="async"
                    width="800"
                    height="800"
                    src={singleTestimonial.image}
                    className="rounded-[10px] inline-block align-middle h-auto w-full"
                    alt=""
                  />
                </motion.div>
                <div className="w-[76.4%] flex flex-col max-w-[1140px] gap-[20px] p-[5px]">
                  <div className="w-full relative h-full">
                    <div className="text-[#052727] font-plex-sans text-[1rem] font-[400]">
                      <b>{singleTestimonial.text}</b>
                    </div>
                  </div>
                  <div className="w-full relative h-full">
                    <div className="text-[#052727] font-plex-sans text-[1rem] font-[300] tracking-tight">
                      {singleTestimonial.author}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const TestimonialOdd = ({
  testimonial,
  idx,
}: {
  testimonial: any;
  idx?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  return (
    <div
      className={`flex flex-row w-auto h-full flex-grow self-stretch flex-wrap gap-0 transition-all duration-300 pl-0 pr-0 mx-auto pb-4 justify-normal items-normal ${
        idx && idx === 0 ? "pt-24 pl-0" : "pt-10"
      }`}
    >
      <div className="flex flex-col md:flex-row flex-basis-auto flex-wrap justify-center items-center w-full h-full mx-auto md:mx-[150px] my-0 flex-grow flex-shrink self-auto py-8">
        <div className="flex flex-col w-auto h-auto flex-grow-0 min-h-[100px] gap-[20px] self-auto flex-wrap items-center transition-all duration-300 pt-8 pb-8 pl-8 pr-8 md:w-1/2 basis-auto flex-shrink max-w-[1140px]">
          <motion.div
            ref={ref}
            className="flex max-w-full justify-center items-center text-center w-full relative"
            variants={slideInUpVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="h-full">
              <img
                decoding="async"
                width="2556"
                height="1434"
                src={testimonial.mainImage.src}
                className="inline-block align-middle h-auto max-w-full"
                alt={testimonial.mainImage.alt}
              />
            </div>
          </motion.div>
          <Spacer height={17} />
          {testimonial.testimonials.map((singleTestimonial: any, idx: any) => (
            <div
              key={idx}
              className="flex flex-row w-full h-full flex-grow self-stretch flex-wrap items-start transition-all duration-300 rounded-[20px] mt-[2px] mb-[2px] ml-[2px] mr-[2px] max-w-[1140px]"
            >
              <div className="w-full flex flex-row basis-auto gap-[23px]">
                <motion.div className="max-w-full text-center relative h-fit w-[20%] p-[10px]">
                  <img
                    decoding="async"
                    width="800"
                    height="800"
                    src={singleTestimonial.image}
                    className="rounded-[10px] inline-block align-middle h-auto w-full"
                    alt=""
                  />
                </motion.div>
                <div className="w-[76.4%] flex flex-col max-w-[1140px] gap-[20px] p-[5px]">
                  <div className="w-full relative h-full">
                    <div className="text-[#052727] font-plex-sans text-[1rem] font-[400]">
                      <b>{singleTestimonial.text}</b>
                    </div>
                  </div>
                  <div className="w-full relative h-full">
                    <div className="text-[#052727] font-plex-sans text-[1rem] font-[300] tracking-tight">
                      {singleTestimonial.author}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col w-auto h-auto flex-grow-0 min-h-[100px] gap-[20px] self-auto flex-wrap items-center transition-all duration-300 pt-8 pb-8 pl-8 pr-8 md:w-1/2 basis-auto flex-shrink max-w-[1140px]">
          <div className="p-2.5 bg-gray-300 rounded-md h-full justify-start mr-auto">
            <div className="font-plex-sans text-[1rem] font-[500] text-black leading-[1rem]">
              {testimonial.title}
            </div>
          </div>
          <div className="w-full mb-0 mt-2 relative">
            <div className="max-w-full text-left">
              <div className="h-full">
                <h2 className="text-[#052727] font-plex-sans text-[2.5rem] font-[700] leading-[2.6rem]">
                  {testimonial.heading}
                </h2>
              </div>
            </div>
          </div>
          <div className="max-w-[100%] font-plex-sans text-[1rem] font-[500] text-[#052727]">
            <div className="h-full box-border">
              {testimonial.description.map((para: any, idxx: any) => (
                <p
                  key={idxx}
                  className="mt-0 text-[#052727] text-[1rem] font-plex-sans font-[500] mb-[0.9rem] box-border"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
          <div className="max-w-[100%] font-plex-sans text-[1rem] font-[500] text-[#052727] relative mr-auto">
            <div className="h-full box-border">
              <ul className="list-none">
                {testimonial.features.map((feature: any, idx: any) => (
                  <li
                    key={idx}
                    className="flex flex-row justify-start items-center text-left mb-[2px]"
                  >
                    <span className="font-plex-sans items-start text-left h-[20px] w-[20px]">
                      <img
                        src="/tick.png"
                        alt="tick"
                        className="h-full w-full"
                      />
                    </span>
                    <span className="font-plex-sans text-[1rem] font-[500] pl-[5px]">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Spacer height={33} />
          <div className="max-w-full relative mr-auto font-plex-sans flex flex-col flex-wrap justify-start items-start content-start gap-0 basis-auto grow-0 shrink-0 order-0 self-auto">
            <Link
              href={testimonial.buttonLink}
              className="bg-[#F1DA44] text-black px-8 py-3 rounded-xl text-[1.25rem] font-[500] inline-flex items-center transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90"
            >
              {testimonial.buttonText}
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <Spacer height={25} />
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
