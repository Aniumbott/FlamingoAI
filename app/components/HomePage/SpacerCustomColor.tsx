const SpacerCustomColor = ({height, backgroundColor}:{height:number, backgroundColor?: string}) => {
    return (
        <div className={`px-[10px] flex flex-col w-[100%] justify-normal items-normal basis-auto flex-grow-0 flex-shrink p-2.5 mx-auto bg-[${backgroundColor}]`}>
            <div className={`w-full h-[${height}px]`}></div>
        </div>
    )
}
export default SpacerCustomColor