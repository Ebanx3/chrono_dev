import { useState } from "react";
import { Form } from "../../Forms/Form";
import { FormInput } from "../../Forms/FormInput";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { FormButton } from "../../Forms/FormButton";
import { validateCreatePost } from "./ValidateCreatePost";
import { toast } from "sonner";
import { createPost } from "../../../api/post";
import { useNavigate } from "react-router-dom";
import { ContentPreview } from "./ContentPreview";

export const CreatePostModal = ({
  closeModal,
}: {
  closeModal: VoidFunction;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const nav= useNavigate();

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    const validatedData = await validateCreatePost({
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()).filter((tag) => tag !== ""),
    });
    if (typeof validatedData === "string") {
      toast.error(validatedData, { style: { whiteSpace: "pre-line" } });
      return;
    }

    setIsLoading(true);
    const result = await createPost(validatedData);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Publicación creada correctamente");
    nav(`/publicacion/${result.data}`)
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

        <label
          htmlFor="post-content"
          className="text-stone-500 font-medium text-sm"
        >
          Contenido
        </label>
        <textarea
          id="post-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition mb-4 focus:outline-none resize-none field-sizing-content min-h-28"
          placeholder="Contenido de la publicación"
        />

        <FormInput
          label="Etiquetas"
          name="title"
          type="text"
          placeholder="Ingresa etiquetas separadas por comas"
          inputValue={tags}
          setInputValue={setTags}
        />

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
            <FormButton label="Publicar" />
          </div>
        )}
        <ContentPreview content={content}/>
      </Form>
    </div>
  );
};
