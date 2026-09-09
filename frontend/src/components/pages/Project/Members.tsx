import { Link } from "react-router-dom";

export const Members = ({ members }: { members: ProjectMember[] }) => {
  return (
    <div className="flex flex-col gap-4 w-1/4">
      <h2 className="text-xl font-bold text-slate-200">Miembros</h2>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div
            key={member.user._id}
            className="flex items-center gap-2 text-slate-300  rounded-md text-sm"
          >
            <Link
              to={`/usuarios/${member.user._id}`}
              className="font-medium underline text-slate-300 hover:text-slate-400"
              target="__blank"
            >
              {member.user.username}
            </Link>
            <span className="text-slate-400">({member.role})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
