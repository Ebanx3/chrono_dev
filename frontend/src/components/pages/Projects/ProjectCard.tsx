import { useState } from "react";
import { Link } from "react-router-dom";
import { joinAsMember, joinAsPendingMember } from "../../../api/project";
import { toast } from "sonner";

export const ProjectCard = ({ project }: { project: Project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [joinRequested, setJoinRequested] = useState(project.iAmPendingMember);
  const [iAmMember, setIAmMember] = useState(project.iAmMember);

  const handleJoinAsMember = async () => {
    const res = await joinAsMember(project._id);
    if (!res.success) toast.error("No fue posible unirse al proyecto.");
    else {
      toast.success("Te uniste al proyecto correctamente!");
      setIAmMember(true);
    }
  };
  const handleJoinAsPendingMember = async () => {
    const res = await joinAsPendingMember(project._id);
    if (!res.success) toast.error("No fue posible unirse al proyecto.");
    else {
      toast.success("Solicitud enviada correctamente!");
      setJoinRequested(true);
    }
  };

  return (
    <article className="border border-slate-800 rounded-lg p-4 transition-all duration-300 ease-in-out">
      <button
        type="button"
        className="text-slate-300 text-2xl bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors hover:bg-slate-700 hover:text-white cursor-pointer float-right"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        {isExpanded ? "−" : "+"}
      </button>

      <div className="flex items-center mb-2 gap-2">
        <h2 className="font-bold text-lg text-slate-100">{project.name}</h2>
        <span
          className={`rounded-full py-1 px-2 bg-slate-900 text-xs ${project.isPublic ? "text-emerald-300" : " text-red-300 "}`}
        >
          {project.isPublic ? "Público" : "Privado"}
        </span>
      </div>
      <h3 className="text-slate-400 text-xs">
        Fundado por:{" "}
        <Link
          to={`/usuarios/${project.founder._id}`}
          className="font-bold text-slate-300 hover:text-slate-400"
        >
          {project.founder.username}
        </Link>
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-slate-500 text-sm ">Tecnologías:</span>
        {project.techs.map((tech) => (
          <span
            key={tech}
            className="bg-slate-900 text-slate-300 text-xs px-2 py-1 rounded mr-2"
          >
            {tech}
          </span>
        ))}
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <div className="mt-4">
              <span className="text-slate-500 font-medium text-sm">
                Descripción:
              </span>
              <p className="text-slate-400 text-sm mt-1 whitespace-pre-line">
                {project.details ||
                  "Este proyecto todavía no tiene una descripción."}
              </p>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="text-slate-300 text-xs px-2 py-1 rounded">
                {project.members.length}{" "}
                {project.members.length === 1 ? "miembro" : "miembros"}
              </span>
              <div className="flex gap-2 text-sm">
                {(project.isPublic || project.iAmMember) && (
                  <Link
                    to={`/proyectos/${project._id}`}
                    className="mt-4 rounded-md bg-slate-700 px-2 py-1 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-default disabled:opacity-70"
                  >
                    Ver Proyecto
                  </Link>
                )}

                {!iAmMember && (
                  <button
                    type="button"
                    className={`mt-4 rounded-md bg-purple-700 px-2 py-1 font-medium text-white transition-colors ${!joinRequested && "hover:bg-purple-800"} disabled:cursor-default disabled:opacity-70 text-sm cursor-pointer`}
                    disabled={joinRequested}
                    onClick={() =>
                      project.isPublic
                        ? handleJoinAsMember()
                        : handleJoinAsPendingMember()
                    }
                  >
                    {joinRequested ? "Solicitud enviada" : "Solicitar unirse"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
