import { useState } from "react";
import { toast } from "sonner";
import { addVote } from "../../../api/project";
import { useUserContext } from "../../../hooks/useUserContext";

export const VoteActivity = ({
  activityId,
  projectId,
  vote,
  onVoteAdded,
}: {
  activityId: string;
  projectId: string;
  vote: NonNullable<ProjectActivityItem["vote"]>;
  onVoteAdded: VoidFunction;
}) => {
  const { user } = useUserContext();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const userVote = user
    ? vote.votes.find((entry) => entry.userId === user._id)
    : undefined;
  const currentUserOption = userVote?.option ?? selectedOption;

  const handleVote = async (option: string) => {
    if (isVoting || vote.status === "closed") return;

    setSelectedOption(option);
    setIsVoting(true);
    const response = await addVote({ activityId, projectId, option });
    setIsVoting(false);

    if (!response.success) {
      setSelectedOption(null);
      toast.error(response.message);
      return;
    }

    toast.success("Voto registrado correctamente.");
    onVoteAdded();
  };

  return (
    <>
      <h3 className="font-semibold text-slate-200">{vote.details}</h3>
      <p className="mt-2 text-xs text-slate-500">
        Votos emitidos: {vote.votes.length}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {vote.options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={isVoting || vote.status === "closed" || Boolean(userVote)}
            onClick={() => void handleVote(option)}
            className={`rounded-md border px-3 py-2 text-sm transition ${
              currentUserOption === option
                ? "border-purple-400 bg-purple-600 text-white"
                : "border-transparent bg-slate-800 text-slate-300 hover:bg-slate-700"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {option}
            {currentUserOption === option && (
              <span className="ml-2 text-xs text-purple-100">Tu voto</span>
            )}
          </button>
        ))}
      </div>
      {userVote && (
        <p className="mt-2 text-xs text-purple-300">Ya has votado en esta encuesta.</p>
      )}
      {vote.status === "closed" && (
        <p className="mt-2 text-xs text-slate-500">Esta votación está cerrada.</p>
      )}
    </>
  );
};