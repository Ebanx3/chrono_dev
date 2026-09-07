export const HelpIcon = ({content}:{content:string}) => {
  return (<>
    <div className="group relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-stone-400 font-bold hover:bg-slate-950">
      ?
      <div className="absolute bottom-full mb-2 w-48 bg-stone-800 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {content}
      </div>
    </div>
  </>);
};