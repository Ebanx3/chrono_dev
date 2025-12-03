export const FormButton = ({ label }: { label: string }) => {
  return (
    <button className="bg-emerald-600 text-white font-semibold p-2 rounded-md transition duration-300 hover:brightness-110 hover:scale-[1.03] cursor-pointer">
      {label}
    </button>
  );
};
