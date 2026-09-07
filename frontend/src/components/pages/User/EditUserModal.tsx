import { useState } from "react";
import { Form } from "../../ui/Forms/Form";
import { FormInput } from "../../ui/Forms/FormInput";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { FormButton } from "../../ui/Forms/FormButton";
import { EditUserLinks } from "./EditUserLinks";
import { validateUpdateUserFields } from "./ValidateUpdateUserFields";
import { toast } from "sonner";
import { updateUser } from "../../../api/user";

interface Props {
  closeModal: () => void;
  user: User;
  refetchUser: () => void;
}

export const EditUserModal = ({ user, closeModal, refetchUser }: Props) => {
  const [title, setTitle] = useState(user.title || "");
  const [description, setDescription] = useState(user.description || "");
  const [links, setLinks] = useState<Link[]>(user.links || []);
  const [stack, setStack] = useState<string>(user.stack.join(", ") || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    const validatedData = await validateUpdateUserFields({
      title,
      description,
      links,
      stack: stack.split(",").map((tech) => tech.trim()).filter((tech) => tech !== ""),
    });
    if (typeof validatedData === "string") {
      toast.error(validatedData, { style: { whiteSpace: "pre-line" } });
      return;
    }

    setIsLoading(true);
    const result = await updateUser(validatedData);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Usuario actualizado correctamente");
    refetchUser();
    closeModal();
  };

  return (
    <div className="fixed top-0 left-0 w-screen bg-black/20 h-screen backdrop-blur-sm z-100 flex justify-center items-center">
      <Form handleSubmit={handleSubmit}>
        <FormInput
          label="Título"
          name="title"
          type="text"
          placeholder="Ingresa un título"
          inputValue={title}
          setInputValue={setTitle}
        />

        <label className="text-slate-400 font-medium text-sm">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border text-slate-300 border-slate-700 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-slate-400 p-2 transition mb-4 focus:outline-none resize-none field-sizing-content"
        ></textarea>

        <FormInput
          label="Stack"
          name="stack"
          type="text"
          placeholder="Ingresa tu stack separado por comas"
          inputValue={stack}
          setInputValue={setStack}
          helpIconContent="Lista de tecnologías separadas por comas. Ejemplo: React, Node.js, MongoDB"
        />

        <EditUserLinks links={links} setLinks={setLinks} />

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
            <FormButton label="Guardar cambios" />
          </div>
        )}
      </Form>
    </div>
  );
};
