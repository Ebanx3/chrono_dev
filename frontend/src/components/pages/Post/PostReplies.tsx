import { Link } from "react-router-dom";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useFetch } from "../../../hooks/useFetch";
import { CreateButton } from "../../ui/CreateButton";
import { useUserContext } from "../../../hooks/useUserContext";
import { useState } from "react";
import { ReplyForm } from "./ReplyForm";

export const PostReplies = ({ postId }: { postId: string }) => {
  const { data, error, loading } = useFetch<Reply[]>(`/post-reply/${postId}`);
  const { user } = useUserContext();
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (error) {
    return (
      <div className="text-center text-slate-400">
        Hubo un error intentando traer las respuestas.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-10">
        <LoaderSVG />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {user && (
        <CreateButton
          label="Responder publicación"
          onClickMethod={() => {
            setShowReplyForm(true);
          }}
        />
      )}
      {user && showReplyForm && (
        <ReplyForm
          postId={postId}
          onReplyAdded={() => {}}
          close={() => setShowReplyForm(false)}
        />
      )}

      {data?.length === 0 ? (
        <div className="text-center text-slate-400">No hay respuestas aún.</div>
      ) : (
        data?.map((reply) => (
          <div
            key={reply._id}
            className="border border-slate-950 rounded-md p-4 text-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <Link
                to={`/usuarios/${reply.authorId}`}
                className="font-medium text-slate-300"
              >
                {reply.authorUsername}
              </Link>
              <span className="text-xs text-slate-500">
                {new Date(reply.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-slate-400">{reply.content}</p>
          </div>
        ))
      )}
    </div>
  );
};
