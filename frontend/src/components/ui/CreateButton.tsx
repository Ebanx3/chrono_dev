export const CreateButton = ({
  label,
  onClickMethod,
}: {
  label: string;
  onClickMethod: VoidFunction;
}) => {
  return (
    <button
      className="relative isolate self-end my-2 overflow-hidden rounded-md px-2 py-1 text-sm text-stone-200 cursor-pointer transition-colors hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:-z-10 after:h-0.5 after:bg-purple-700 after:transition-[height] after:duration-300 after:ease-out hover:after:h-full"
      onClick={onClickMethod}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
};
