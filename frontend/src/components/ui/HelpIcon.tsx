export const HelpIcon = ({content}:{content:string}) => {
  return (<>
    <div className="group relative flex items-center justify-center w-5 h-5 rounded-full bg-stone-200 text-stone-600 font-bold cursor-pointer hover:bg-stone-300">
      ?
      <div className="absolute bottom-full mb-2 w-48 bg-stone-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {content}
      </div>
    </div>
  </>);
};