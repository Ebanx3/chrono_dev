import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addDiscussionMessage } from "../../../api/project";

export const DiscussionActivity = ({
  activityId,
  projectId,
  discussion,
  authorUsername,
  onMessageAdded,
}: {
  activityId: string;
  projectId: string;
  discussion: NonNullable<ProjectActivityItem["discussion"]>;
  authorUsername: string;
  onMessageAdded: VoidFunction;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = message.trim();

    if (!content) {
      toast.error("La respuesta no puede estar vacía.");
      return;
    }

    setIsSending(true);
    const response = await addDiscussionMessage({
      activityId,
      content,
      projectId,
    });
    setIsSending(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setMessage("");
    toast.success("Respuesta agregada correctamente.");
    onMessageAdded();
  };

  return (
    <>
      <div
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className="rounded-md outline-none "
      >
        <h3 className="font-semibold text-slate-200">{discussion.title}</h3>
        <p className="mt-1 whitespace-pre-line text-sm text-slate-400">
          {discussion.content}
        </p>
        <p className="mt-2 text-xs text-slate-500">Por {authorUsername}</p>
        <button onClick={() => setIsOpen(true)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
          <p className="mt-3 text-xs ">
          {discussion.messages.length} respuesta
          {discussion.messages.length === 1 ? "" : "s"}
        </p>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`discussion-title-${activityId}`}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Discusión
                </p>
                <h2
                  id={`discussion-title-${activityId}`}
                  className="mt-1 text-xl font-semibold text-slate-100"
                >
                  {discussion.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar discusión"
                onClick={() => setIsOpen(false)}
                className="text-2xl leading-none text-slate-400 hover:text-slate-100"
              >
                ×
              </button>
            </div>

            <p className="mt-4 whitespace-pre-line text-sm text-slate-300">
              {discussion.content}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Iniciada por {authorUsername}
            </p>

            <div className="mt-6 border-t border-slate-800 pt-4">
              <h3 className="text-sm font-semibold text-slate-200">
                Respuestas
              </h3>
              {discussion.messages.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  Todavía no hay respuestas.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {discussion.messages.map((entry) => (
                    <div
                      key={entry._id}
                      className="rounded-md border border-slate-800 bg-slate-950/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                        <span className="font-medium text-slate-300">
                          {entry.author.username}
                        </span>
                        <time>
                          {new Date(entry.createdAt).toLocaleString()}
                        </time>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                        {entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {discussion.status === "open" && (
              <form
                onSubmit={handleSubmit}
                className="mt-6 border-t border-slate-800 pt-4"
              >
                <label
                  htmlFor={`discussion-reply-${activityId}`}
                  className="text-sm font-medium text-slate-300"
                >
                  Responder a la discusión
                </label>
                <textarea
                  id={`discussion-reply-${activityId}`}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="mt-2 min-h-24 w-full resize-none rounded-md border border-slate-700 bg-slate-950 p-3 text-sm text-slate-200 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-500 field-sizing-content"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSending ? "Enviando..." : "Responder"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
