export const CreateButton = ({
  label,
  onClickMethod,
}: {
  label: string;
  onClickMethod: VoidFunction;
}) => {
  return (
    <button
      className="self-end border text-emerald-700 py-1 px-2 rounded-md hover:bg-emerald-700 hover:text-white cursor-pointer"
      onClick={onClickMethod}
    >
      {label}
    </button>
  );
};
