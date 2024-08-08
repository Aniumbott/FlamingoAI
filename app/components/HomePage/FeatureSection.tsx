import React from 'react';

const FeatureSection = () => {
    return (
        <div className="flex flex-col bg-gray-100 w-full mx-auto p-[10px] relative overflow-visible h-auto justify-normal items-normal">
            <div className="self-auto flex-shrink flex-grow basis-auto justify-center items-center mx-auto">
                <div className="flex flex-col sm:flex-row gap-[1px] pr-0 pl-[1rem] bg-white pb-[1rem] pt-[1rem] rounded-2xl shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-center items-center basis-auto flex-1 self-auto mx-auto my-0 text-center py-[10px]">
                        <div className="flex flex-row items-center justify-center w-full sm:w-[7%] p-[1%] mb-4 sm:mb-0">
                            <div className="w-full text-center">
                                <div className="h-full box-border">
                                    <img decoding="async" width="133" height="158" src="https://team-gpt.com/wp-content/uploads/2023/08/Group-18.png" className="h-[10vh] md:h-full w-auto md:max-w-full inline-block align-middle" alt="" data-lazy-src="https://team-gpt.com/wp-content/uploads/2023/08/Group-18.png" data-ll-status="loaded"/>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center text-center w-full sm:w-[65%] items-center mb-4 sm:mb-0 pl-0 md:pl-4">
                            <div className="w-full relative">
                                <h3 className="text-center font-plex-sans font-semibold text-[20px] md:text-[32px] leading-[1.2]">
                                    <div className="inline-block text-center overflow-hidden relative h-20 opacity-100">
                                        <ul className="m-0 p-0 list-none animate-text-slide text-black">
                                            <li className="h-20 text-center flex items-center justify-center">
                                                We are helping teams and individuals adopt AI
                                            </li>
                                            <li className="h-20 text-center flex items-center justify-center">
                                                We are teaching teams and individuals how to use AI
                                            </li>
                                        </ul>
                                    </div>
                                </h3>
                            </div>
                        </div>
                        <div className="flex flex-col items-center mb-4 mt-4 w-full sm:w-[26%]">
                            <div className="text-[#1CAB83] text-center font-plex-sans font-semibold text-[28px] sm:text-[32px] leading-[1.2]">
                                <div className="inline-block text-center overflow-hidden relative h-20">
                                    <ul className="m-0 pt-[1.25rem] pb-9 list-none animate-text-slide">
                                        <li className="flex items-center justify-center">35,400</li>
                                        <li className="flex pt-8 items-center justify-center">1,326,267</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="text-md md:text-xl mt-2">
                                <div className="inline-block text-center overflow-hidden relative h-[46px] md:h-[41.5px]">
                                    <ul className="m-0 p-0 list-none animate-text-slide text-black">
                                        <li className="h-10 md:h-8 flex mb-2 items-center justify-center text-lg">Teams use Team-GPT</li>
                                        <li className="h-10 md:h-8 text-lg md:text-xl leading-[1.5rem] md:leading-[1.75rem] flex items-center justify-center">Students taught</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeatureSection;