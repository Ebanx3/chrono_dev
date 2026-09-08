import { useState } from "react";
import { toast } from "sonner";
import { addResourceToProject } from "../../../api/project";
import { Form } from "../../ui/Forms/Form";
import { FormInput } from "../../ui/Forms/FormInput";

interface AddResourceModalProps {
  closeModal: VoidFunction;
  projectId: string;
  onAddResource: (resource: Link) => void;
}

export const AddResourceModal = ({
  closeModal,
  projectId,
  onAddResource,
}: AddResourceModalProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName) {
      toast.error("El nombre del recurso es obligatorio.");
      return;
    }

    if (!trimmedUrl) {
      toast.error("La URL del recurso es obligatoria.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      toast.error("La URL no tiene un formato válido.");
      return;
    }

    setIsLoading(true);

    const result = await addResourceToProject({
      projectId,
      name: trimmedName,
      url: trimmedUrl,
    });

    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    onAddResource({ name: trimmedName, url: trimmedUrl });
    toast.success("Recurso agregado correctamente");
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
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white font-semibold p-2 rounded-md transition duration-300 hover:brightness-110 hover:scale-[1.03] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </Form>
    </div>
  );
};