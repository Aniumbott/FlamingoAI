import Link from "next/link"
import Spacer from "./Spacer"
import SpacerCustomColor from "./SpacerCustomColor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const footerColumns = [
    {
      items: [
        { text: "Product", color: "#1CAB83", href: "/" },
        { text: "Pricing", href: "/" },
        { text: "Private Team-GPT", href: "/" },
        { text: "For Educators", href: "/" },
        { text: "Deploy on your own server",  href: "/", color: "#f1da44"},
        { text: "Use Cases", href: "/", color: '#1CAB83'},
        { text: "Marketing", href: "/" },
        { text: "Education", href: "/" },
        { text: "Data science", href: "/" },
        { text: "Sales", href: "/" }
      ]
    },
    {
      items: [
        { text: "Features", color: "#1CAB83", href: "/" },
        { text: "Team-GPT Enterprise", href: "/" },
        { text: "Collaborative AI", href: "/" },
        { text: "Use prompt templates", href: "/" },
        { text: "Share chat results", href: "/" },
        { text: "Edit & Delete messages", href: "/" },
        { text: "Fork conversations", href: "/" }
      ]
    },
    {
      items: [
        { text: "Resources", color: "#1CAB83", href: "/" },
        { text: "How to Setup Microsoft Azure OpenAI Service", href: "/" },
        { text: "Blog", href: "/" },
        { text: "FAQ", href: "/" },
        { text: "Knowledge base", href: "/" }
      ]
    },
    {
      items: [
        { text: "Popular Articles", color: "#1CAB83", href: "/" },
        { text: "10 Best AI Tools for Education", href: "/" },
        { text: "10 Best AI Marketing Tools", href: "/" },
        { text: "Team-GPT vs ChatGPT", href: "/" },
        { text: "Team-GPT vs Microsoft Copilot", href: "/" },
        { text: "Team-GPT vs Google Gemini", href: "/" },
        { text: "Team-GPT vs Perplexity Enterprise", href: "/" }
      ]
    },
    {
      items: [
        { text: "Company", color: "#1CAB83", href: "/" },
        { text: "Get in touch", href: "/" },
        { text: "Careers", href: "/" },
        { text: "Legal", color: "#1CAB83", href: "/" },
        { text: "Privacy policy", href: "/" },
        { text: "Terms of use", href: "/" },
        { text: "Cookie notice", href: "/" }
      ]
    }
  ];
  const Footer = () => {
    return (
        <>
            <FooterHeading />
            <FooterMain />
            <FooterEnd />
        </>
    )
}

const FooterHeading = () => {
    return (
        <div className="bg-[#052727] flex flex-col rounded-t-[24px] -mt-6 mb-0 ml-0 mr-0">
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-auto md:mx-[150px] gap-[20px] py-[10px]">
                <SpacerCustomColor backgroundColor={'#052727'} height={14}/>
                <div className="flex flex-col md:flex-row w-[90vw] md:w-full h-full flex-grow self-stretch sm:flex-wrap border-[3px] border-solid border-[#AFAFAF] rounded-[20px] p-4 md:p-8 custom-bg-transition">
                    <div className="w-full md:w-[76%] flex flex-row justify-center md:justify-start items-center text-center p-2.5 mb-4 md:mb-0">
                        <div className="max-w-full text-center md:text-left relative">
                            <h2 className="font-plex-sans text-[#ffffff] text-[1.5rem] md:text-[2.5rem] font-[700] leading-[2rem] md:leading-[2.6rem]">Can you afford to skip on AI adoption?</h2>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end text-center">
                        <Link
                            href="/"
                            className="bg-[#F1DA44] text-black px-[24px] md:px-[36px] py-[12px] md:py-[15px] rounded-xl text-[1.2rem] md:text-[1.5rem] leading-[1.4rem] md:leading-[1.6rem] font-[500] inline-flex font-plex-sans items-center transition-transform duration-300 hover:scale-90 focus:scale-90 active:scale-90"
                            >
                                Start Free
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <SpacerCustomColor backgroundColor={'#052727'} height={10}/>
            </div>
        </div>
    )
}

const FooterMain = () => {
    return (
        <div className="bg-[#052727]">
            <div className="flex flex-col md:flex-row flex-wrap justify-start items-start basis-auto flex-grow flex-shrink self-auto relative mx-auto md:mx-[150px] gap-[15px] py-[10px] px-[10px] md:px-0">
                {footerColumns.map((section, idx) => (
                    <div key={idx} className="flex flex-col basis-auto gap-y-1 flex-shrink flex-grow px-[30px] md:px-[10px] py-[10px] w-full sm:w-1/2 md:w-[18%]">
                        {section.items.map((item, idx) => (
                            <div key={idx}>
                                <span 
                                    className="font-plex-sans text-[1rem] md:text-[1rem] font-[500]"
                                    style={{ color: item.color || '#ffffff' }}
                                    >
                                    <a className="no-underline" href={item.href} target="_blank">{item.text}</a>
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
const FooterEnd = () => {
    return (
        <div className="bg-[#052727] flex flex-col">
            <div className="flex flex-col flex-wrap justify-center items-center basis-auto flex-grow flex-shrink self-auto relative mx-4 md:mx-[150px] gap-[20px] py-[30px]">
                <div className="flex flex-col md:flex-row justify-end w-full border-b-[2px] py-[20px]">
                    <div className="max-w-full relative text-center h-full mb-4 md:mb-0">
                        <img width="122" height="29" src="https://team-gpt.com/wp-content/uploads/2023/04/Frame-1.svg" className="inline-block align-middle h-auto max-w-full" alt="" data-lazy-src="https://team-gpt.com/wp-content/uploads/2023/04/Frame-1.svg" data-ll-status="loaded"/>
                    </div>
                    <div className="max-w-full relative text-center h-full">
                        <a href="https://camplight.net/" target="_blank" rel="nofollow" className="no-underline">
                            <img width="3258" height="811" src="https://team-gpt.com/wp-content/uploads/2023/04/logo_horizontal_white-1.png" className="h-[26px] inline-block align-middle w-[130px] md:w-full" alt=""/>
                        </a>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row w-full justify-between basis-auto flex-shrink">
                    <div className="flex flex-row justify-center md:justify-start w-full md:w-[50%] items-center basis-auto flex-shrink flex-grow-0 mb-4 md:mb-0">
                        <div className="justify-start max-w-full relative text-left">
                            <a href="https://team-gpt.com" className="no-underline" target="_blank">
                                <img src="https://team-gpt.com/wp-content/uploads/2023/09/Rectangle-White-Transparent-Border.svg" className="w-[160px] inline-block align-middle h-auto" alt=""/>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center md:justify-end w-full md:w-[50%] items-center basis-auto flex-shrink flex-grow-0">
                        <div className="justify-end max-w-full relative text-right">
                            <SocialIcons />
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}

const SocialIcons = () => {
    return (
      <div className="grid grid-flow-col gap-4">
        <Link href="https://www.linkedin.com/company/teamgpt/" target="_blank" rel="noopener noreferrer"
          className="text-[#1CFFC3] hover:text-[#1CAB83] transition-colors duration-300">
          <span className="sr-only">LinkedIn</span>
          <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
        </Link>
        <Link href="https://twitter.com/team_gpt" target="_blank" rel="noopener noreferrer"
          className="text-[#1CFFC3] hover:text-[#1CAB83] transition-colors duration-300">
          <span className="sr-only">Twitter</span>
          <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
        </Link>
        <Link href="https://www.youtube.com/@Team-GPT" target="_blank" rel="noopener noreferrer"
          className="text-[#1CFFC3] hover:text-[#1CAB83] transition-colors duration-300">
          <span className="sr-only">YouTube</span>
          <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
        </Link>
      </div>
    );
};
export default Footer