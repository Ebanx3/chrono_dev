import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { acceptPendingMember, rejectPendingMember } from "../../../api/project";
import { XSVG } from "../../../assets/XSVG";
import { CheckSVG } from "../../../assets/CheckSVG";

export const PendingMembers = ({
  pendingMembers,
  refetchProject
}: {
  pendingMembers: PendingMember[];
  refetchProject:VoidFunction
}) => {
  const { projectId } = useParams();
  const [members, setMembers] = useState(pendingMembers);

  const handleReject = async (userId: string) => {
    if (!projectId) return;

    const response = await rejectPendingMember(projectId, userId);
    if (response.success) {
      setMembers((currentMembers) =>
        currentMembers.filter((member) => member._id !== userId),
      );
    }
  };

  const handleAccept = async (userId: string) => {
    if (!projectId) return;

    const response = await acceptPendingMember(projectId, userId);
    if (response.success) {
      setMembers((currentMembers) =>
        currentMembers.filter((member) => member._id !== userId),
      );
      refetchProject();
    }
  };

  return (
    <div className="mt-8 w-full">
      <h2 className=" font-semibold mb-2 text-slate-300">
        Pendientes de aprobación
      </h2>
      {members.length === 0 ? (
        <span className="text-slate-500 text-sm">
          No hay miembros pendientes.
        </span>
      ) : (
        members.map((member) => (
          <div key={member._id} className="flex items-center gap-4">
            <Link
              to={`/usuarios/${member._id}`}
              className="font-medium underline text-slate-300 hover:text-slate-400"
              target="__blank"
            >
              {member.username}
            </Link>
            <button
              className="text-red-700 cursor-pointer hover:text-red-400"
              type="button"
              onClick={() => void handleReject(member._id)}
              aria-label={`Rechazar a ${member.username}`}
            >
              <XSVG />
            </button>
            <button
              className="text-emerald-700 cursor-pointer hover:text-emerald-400"
              type="button"
              onClick={() => void handleAccept(member._id)}
              aria-label={`Aceptar a ${member.username}`}
            >
              <CheckSVG />
            </button>
          </div>
        ))
      )}
    </div>
  );
};
