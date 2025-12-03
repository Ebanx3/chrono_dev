import { useState } from "react";
import { Form } from "../../Forms/Form";
import { FormInput } from "../../Forms/FormInput";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { FormButton } from "../../Forms/FormButton";
import { EditUserLinks } from "./EditUserLinks";

interface Props {
    closeModal: () => void;
    user: User;
}

export const EditUserModal = ({ user, closeModal }: Props) => {
  const [title, setTitle] = useState(user.title || "");
  const [description, setDescription] = useState(user.description || "");
  const [links, setLinks] = useState<Link[]>(user.links || []);
  const [stack, setStack] = useState<string[]>(user.stack || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para manejar la edición del usuario
    setIsLoading(true);
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

        <label className="text-stone-500 font-medium text-sm">
          Descripción
        </label>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition mb-4 focus:outline-none resize-none field-sizing-content"
        ></textarea>

        <FormInput
          label="Stack"
          name="stack"
          type="text"
          placeholder="Ingresa tu stack separado por comas"
          inputValue={stack.join(", ")}
          setInputValue={(value) => setStack(value.split(",").map((tech) => tech.trim()))}
        />

        <EditUserLinks links={links} setLinks={setLinks} />

        {isLoading ? (
          <div className="self-center h-10">
            <LoaderSVG />
          </div>
        ) : (
          <div className="flex justify-between">
            <button className="bg-stone-200 p-2 rounded-md cursor-pointer hover:bg-stone-300" type="button" onClick={closeModal}>Cancelar</button>
            <FormButton label="Guardar cambios" />
          </div>
        )}
      </Form>
    </div>
  );
};
