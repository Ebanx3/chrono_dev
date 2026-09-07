export const EditUserInfoButton = ({showEditMenu}:{showEditMenu:VoidFunction}) => {
  return (
      <button
        onClick={showEditMenu}
        className="absolute top-0 right-0 px-2 text-xs font-medium text-slate-400 rounded-sm transition cursor-pointer hover:text-purple-500"
      >
        Editar perfil
      </button>
  );
};
