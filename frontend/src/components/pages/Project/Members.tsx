import { useState } from "react";
import { Link } from "react-router-dom";
import { OptionsSVG } from "../../../assets/OptionsSVG";
import { MemberOptionsModal } from "./MemberOptionsModal";

interface MembersProps {
  projectId: string;
  members: ProjectMember[];
  canEditOptions: boolean;
  canRemoveMember: boolean;
  refetchProject: () => void;
}

export const Members = ({ projectId, members, canEditOptions, canRemoveMember, refetchProject }: MembersProps) => {
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-slate-200">Miembros</h2>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div
            key={member.user._id}
            className="flex items-center justify-between rounded-md text-sm w-full"
          >
            <div className="flex gap-2 ">
              <Link
                to={`/usuarios/${member.user._id}`}
                className="font-medium underline text-slate-300 hover:text-slate-400"
                target="__blank"
              >
                {member.user.username}
              </Link>
              <span className="text-slate-400">{member.role}</span>
            </div>
            {(canEditOptions || canRemoveMember) && <button
              type="button"
              onClick={() => setSelectedMember(member)}
              className="text-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label={`Editar opciones de ${member.user.username}`}
            >
              <OptionsSVG />
            </button>}
          </div>
        ))}
      </div>
      {selectedMember && (
        <MemberOptionsModal
          projectId={projectId}
          member={selectedMember}
          canEditOptions={canEditOptions}
          canRemoveMember={canRemoveMember}
          closeModal={() => setSelectedMember(null)}
          refetchProject={refetchProject}
        />
      )}
    </div>
  );
};
