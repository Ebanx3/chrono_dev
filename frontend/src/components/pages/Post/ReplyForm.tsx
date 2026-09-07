import { useState } from "react";
import { addPostReply } from "../../../api/post";
import { toast } from "sonner";

interface Props {
  postId: string;
  onReplyAdded: () => void;
  close: () => void;
}

export const ReplyForm = ({ postId, onReplyAdded, close }: Props) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (content.trim() === "") {
      toast.error("El contenido de la respuesta no puede estar vacío.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await addPostReply({ postId, content });
      if (response.success) {
        toast.success("Respuesta agregada con éxito.");
        onReplyAdded();
        setContent("");
      } else {
        toast.error("Error al agregar la respuesta.");
      }
    } catch (error) {
      toast.error("Error al agregar la respuesta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex gap-2 items-center">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu respuesta..."
          className="border border-slate-700 rounded-md focus:ring-2 focus:ring-slate-600 focus:border-slate-400 p-2 transition focus:outline-none text-slate-300 flex-1 resize-none field-sizing-content min-h-20"
        />
        <div className="flex flex-col gap-2 text-sm">
          <button
            type="button"
            onClick={() => {
              setContent("");
              close();
            }}
            className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2  rounded-md disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Responder"}
          </button>
        </div>
      </div>
    </form>
  );
};
