const Spacer = ({height, backgroundColor}:{height:number, backgroundColor?: string}) => {
    return (
        <div className={`px-[10px] bg-gray-100 flex flex-col w-[100%] justify-normal items-normal basis-auto flex-grow-0 flex-shrink p-2.5 mx-auto `}>
            <div className={`w-full h-[${height}px]`}></div>
        </div>
    )
}
export default Spacer