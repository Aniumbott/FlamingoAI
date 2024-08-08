const SpacerMain = ({ height }: { height: number }) => {
    return (
      <div className="px-[10px] flex flex-col w-full justify-normal items-normal basis-auto flex-grow-0 flex-shrink p-2.5 mx-auto">
        <div style={{ height: `${height}px` }} className="w-full"></div>
      </div>
    );
  };
  
  export default SpacerMain;
  