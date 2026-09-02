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
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validatedData = await validateCreateProject({
      name,
      details,
      isPublic,
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
          className="text-stone-500 font-medium text-sm"
        >
          Detalles
        </label>
        <textarea
          id="project-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition mb-4 focus:outline-none resize-none field-sizing-content min-h-28"
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
          htmlFor="isPublic"
          className="text-stone-500 font-medium text-sm flex justify-between items-center mb-4"
        >
          <span className="flex gap-3 items-center">Proyecto privado <HelpIcon content="Si está marcado, el contenido del proyecto no será visible para todos los usuarios." /></span>
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="appearance-none border-2 border-stone-400 rounded-md size-6 focus:outline-none checked:bg-emerald-500 checked:border-emerald-500 cursor-pointer"
          />
        </label>

        {isLoading ? (
          <div className="self-center h-10">
            <LoaderSVG />
          </div>
        ) : (
          <div className="flex justify-between">
            <button
              className="bg-stone-200 p-2 rounded-md cursor-pointer hover:bg-stone-300"
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
