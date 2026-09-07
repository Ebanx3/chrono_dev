import { useState } from "react";
import { Form } from "../../ui/Forms/Form";
import { FormButton } from "../../ui/Forms/FormButton";
import { FormInput } from "../../ui/Forms/FormInput";

interface AddResourceModalProps {
  closeModal: VoidFunction;
  onAddResource: (resource: Link) => void;
}

export const AddResourceModal = ({
  closeModal,
  onAddResource,
}: AddResourceModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAddResource({ name: name.trim(), url: url.trim() });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <Form handleSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl font-bold text-slate-100">Agregar recurso</h2>

        <FormInput
          label="Nombre"
          name="resource-name"
          type="text"
          placeholder="Documentación del proyecto"
          inputValue={name}
          setInputValue={setName}
        />

        <label htmlFor="resource-url" className="text-slate-400 font-medium text-sm">
          URL
        </label>
        <input
          id="resource-url"
          name="url"
          type="url"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://ejemplo.com"
          className="border border-slate-700 rounded-md focus:ring-2 focus:ring-slate-400 focus:border-slate-400 p-2 transition mb-4 focus:outline-none text-slate-300"
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-slate-700 p-2 rounded-md cursor-pointer text-slate-400 hover:bg-slate-600"
          >
            Cancelar
          </button>
          <FormButton label="Agregar" />
        </div>
      </Form>
    </div>
  );
};