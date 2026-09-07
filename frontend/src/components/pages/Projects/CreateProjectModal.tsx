import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../ui/Forms/Form";
import { FormInput } from "../../ui/Forms/FormInput";
import { validateCreateProject } from "./ValidateCreateProject";
import { toast } from "sonner";
import { createProject } from "../../../api/project";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { FormButton } from "../../ui/Forms/FormButton";
import { HelpIcon } from "../../ui/HelpIcon";

export const CreateProjectModal = ({
  closeModal,
}: {
  closeModal: VoidFunction;
}) => {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [techs, setTechs] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = await validateCreateProject({
      name,
      details,
      isPublic: !isPrivate,
      techs: techs
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    });
    if (typeof validatedData === "string") {
      toast.error(validatedData, { style: { whiteSpace: "pre-line" } });
      return;
    }

    setIsLoading(true);
    const result = await createProject(validatedData);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Proyecto creado correctamente");
    nav(`/proyectos/${result.data}`);
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-screen bg-black/20 h-screen backdrop-blur-sm z-100 flex justify-center items-center">
      <Form handleSubmit={handleSubmit}>
        <FormInput
          label="Nombre del proyecto"
          name="name"
          type="text"
          placeholder="Ingresa un nombre para el proyecto"
          inputValue={name}
          setInputValue={setName}
        />
        <label
          htmlFor="project-details"
          className="text-slate-400 font-medium text-sm"
        >
          Detalles
        </label>
        <textarea
          id="project-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="border border-slate-700 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-slate-400 p-2 transition mb-4 focus:outline-none text-slate-300 resize-none h-40"
          placeholder="Agrega detalles del proyecto"
        />

        <FormInput
          label="Tecnologías"
          name="techs"
          type="text"
          placeholder="Ingresa tecnologías separadas por comas"
          helpIconContent="Lista de tecnologías utilizadas en el proyecto, separadas por comas."
          inputValue={techs}
          setInputValue={setTechs}
        />
        <label
            htmlFor="isPrivate"
          className="text-slate-400 font-medium text-sm flex justify-between items-center mb-4"
        >
          <span className="flex gap-3 items-center">
            Proyecto privado
            <HelpIcon content="Si está marcado, el contenido del proyecto no será visible para todos los usuarios." />
          </span>
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 rounded-full bg-stone-500 transition-colors peer-checked:bg-purple-900 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
        </label>

        {isLoading ? (
          <div className="self-center h-10">
            <LoaderSVG />
          </div>
        ) : (
          <div className="flex justify-between">
            <button
              className="bg-slate-700 p-2 rounded-md cursor-pointer text-slate-400 hover:bg-slate-600"
              type="button"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <FormButton label="Crear proyecto" />
          </div>
        )}
      </Form>
    </div>
  );
};
