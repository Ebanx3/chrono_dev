import { Link } from "react-router-dom";
import { ProjectResources } from "./ProjectResources";

export const ProjectDetails = ({ project }: { project: Project }) => {
  return (
    <div className="flex flex-col gap-4 w-3/4">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-100">{project.name}</h1>
        <span
          className={`rounded-full py-1 px-2 bg-slate-900 text-sm ${project.isPublic ? "text-emerald-300" : " text-red-300 "}`}
        >
          {project.isPublic ? "Público" : "Privado"}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-slate-400 text-sm">
          Creado por:{" "}
          <Link
            to={`/usuarios/${project.founder._id}`}
            className="font-bold text-slate-400 hover:text-slate-600"
          >
            {project.founder.username}
          </Link>
        </span>
        <span className="text-xs text-slate-500">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h2 className="mt-10 text-xl font-bold text-slate-200">Descripción</h2>
      <p className=" whitespace-pre-line text-slate-400 text-sm">
        {project.details}
      </p>
      <h2 className="mt-10 text-xl font-bold text-slate-200">Tecnologías</h2>
      <div>
        {project.techs.map((tech) => (
          <span
            key={tech}
            className="inline-block bg-slate-700 text-slate-300 px-2 py-1 rounded-md text-sm mr-2 mb-2"
          >
            {tech}
          </span>
        ))}
      </div>
      <ProjectResources resources={project.resources} />
    </div>
  );
};
