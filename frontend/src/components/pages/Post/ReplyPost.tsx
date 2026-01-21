import { useState } from "react";
import { toast } from "sonner";
import { createPostReply } from "../../../api/postReply";
import { LoaderSVG } from "../../../assets/LoaderSVG";

export const ReplyPost = ({postId}:{postId:string}) => {
  const [showreplyInput, setShowReplyInput] = useState(false);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (content.length < 1) {
      toast.error("El contenido no puede estar vacío", {
        style: { whiteSpace: "pre-line" },
      });
      return;
    }

    setIsLoading(true);
    const result = await createPostReply({ postId, content });
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success("Publicación creada correctamente");

    setShowReplyInput(false);
    setContent("");
  };

  return (
    <>
      <button
        className="self-end border rounded-md py-1 px-2 text-emerald-700 font-medium hover:bg-emerald-700 hover:text-white cursor-pointer"
        onClick={() => setShowReplyInput(!showreplyInput)}
      >
        {showreplyInput ? "Cancelar" : "Responder"}
      </button>
      {showreplyInput && (
        <div className="mt-4 flex flex-col">
          <textarea
                className="border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 p-2 transition mb-4 focus:outline-none resize-none field-sizing-content min-h-28 w-full"
                rows={4}
                placeholder="Escribe tu respuesta aquí..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
          {isLoading ? (
            <div className="self-end h-10">
              <LoaderSVG />
            </div>
          ) : (              
              <button
                className="mt-2 bg-emerald-600 text-white py-1 px-4 rounded-md hover:bg-emerald-700 cursor-pointer self-end"
                onClick={handleClick}
                disabled={isLoading}
              >
                Enviar Respuesta
              </button>
          )}
        </div>
      )}
    </>
  );
};
