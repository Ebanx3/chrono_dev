import { useState } from "react";
import { Link } from "react-router-dom";

export const ProjectCard = ({ project }: { project: Project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [joinRequested, setJoinRequested] = useState(false);

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

      <div className="mt-4">
        <span className="text-slate-500 text-sm mr-4">Tecnologías:</span>
        {project.techs.map((tech) => (
          <span
            key={tech}
            className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded mr-2"
          >
            {tech}
          </span>
        ))}
      </div>

      {isExpanded && (
        <>
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
            {project.isPublic ? (
              <div className="flex gap-2 text-sm">
                <Link
                  to={`/proyectos/${project._id}`}
                  className="mt-4 rounded-md bg-slate-700 px-2 py-1 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-default disabled:opacity-70"
                >
                  Ver Proyecto
                </Link>
                <button className="mt-4 rounded-md bg-purple-700 px-2 py-1 font-medium text-white transition-colors hover:bg-purple-800 disabled:cursor-default disabled:opacity-70 cursor-pointer">
                  Unirse
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mt-4 rounded-md bg-purple-700 px-2 py-1 font-medium text-white transition-colors hover:bg-purple-800 disabled:cursor-default disabled:opacity-70 text-sm cursor-pointer"
                disabled={joinRequested}
                onClick={() => setJoinRequested(true)}
              >
                {joinRequested ? "Solicitud enviada" : "Solicitar unirse"}
              </button>
            )}
          </div>
        </>
      )}
    </article>
  );
};
