export const EditUserInfoButton = ({showEditMenu}:{showEditMenu:VoidFunction}) => {
  return (
      <button
        onClick={showEditMenu}
        className="absolute top-0 right-0 px-2 text-sm font-medium text-emerald-700 rounded-sm border transition cursor-pointer hover:bg-emerald-700 hover:text-white"
      >
        Editar usuario
      </button>
  );
};
