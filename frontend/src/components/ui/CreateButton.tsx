export const CreateButton = ({
  label,
  onClickMethod,
}: {
  label: string;
  onClickMethod: VoidFunction;
}) => {
  return (
    <button
      className="self-end text-purple-400 py-1 px-2 rounded-md hover:bg-purple-800 hover:text-white cursor-pointer text-sm transition underline"
      onClick={onClickMethod}
    >
      {label}
    </button>
  );
};
