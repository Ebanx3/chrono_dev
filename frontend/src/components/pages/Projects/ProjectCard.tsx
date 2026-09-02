import { Link } from "react-router-dom";

export const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link to={`/proyectos/${project._id}`} className="bg-white p-4 rounded border hover:scale-[1.02] hover:shadow-md transition-transform duration-200">
      <h2 className="font-bold text-lg">{project.name}</h2>
      <h3 className="text-stone-500 text-sm">Fundado por: <span className="font-medium">{project.founderUsername}</span></h3>
      <div className="mt-4"><span className="text-stone-500 text-sm mr-4">Tecnologías: </span>{project.techs.map((tech) => <span key={tech} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">{tech}</span>)}</div>
    </Link>
  );
};
