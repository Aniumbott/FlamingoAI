"use client"
import { useState, useEffect } from 'react';

const AnimatedHeadline = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <h1 className="text-center font-plex-sans font-extrabold text-[3.5rem] leading-[75px] sm:text-[2.5rem] sm:leading-[1.3em] md:text-[3rem] lg:text-[3.5rem] mt-2 mb-4 px-">
      <span className="inline-block">Intuitive GPT chat for your</span>{' '}
      <span className="inline-block relative">
        <span className={`inline-block`}>
          whole
        </span>{' '}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" preserveAspectRatio="none" className='absolute top-[50%] left-[50%] w-[calc(100%+20px)] h-[calc(100%+20px)] transform translate-x-[-50%] translate-y-[-50%]'>
          <path d="M9.3,127.3c49.3-3,150.7-7.6,199.7-7.4c121.9,0.4,189.9,0.4,282.3,7.2C380.1,129.6,181.2,130.6,70,139c82.6-2.9,254.2-1,335.9,1.3c-56,1.4-137.2-0.3-197.1,9"
                stroke="#F1DA44" 
                strokeWidth="6" 
                fill="none" 
                className='animate-draww underline-path'
          />
        </svg>

      </span>
      {' '}<span className="inline-block">company</span>{' '}
    </h1>
  );
};

export default AnimatedHeadline;