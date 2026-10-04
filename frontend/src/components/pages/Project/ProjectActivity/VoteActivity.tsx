import { useState } from "react";
import { toast } from "sonner";
import { addVote } from "../../../../api/project";
import { useUserContext } from "../../../../hooks/useUserContext";

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
  const isExpired = vote.closesAt
    ? new Date(vote.closesAt).getTime() <= Date.now()
    : false;
  const isClosed = vote.status === "closed" || isExpired;
  const hasUserVoted = Boolean(userVote) || isClosed;
  const votesByOption = vote.options.reduce(
    (acc, option) => {
      acc[option] = vote.votes.filter((entry) => entry.option === option).length;
      return acc;
    },
    {} as Record<string, number>,
  );
  const totalVotes = vote.votes.length;

  const handleVote = async (option: string) => {
    if (isVoting || isClosed) return;

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
        Votos emitidos: {totalVotes}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {vote.closesAt
          ? `Cierre: ${new Date(vote.closesAt).toLocaleString()}`
          : "Sin fecha de cierre"}
      </p>

      {hasUserVoted ? (
        <div className="mt-3 space-y-2">
          {vote.options.map((option) => {
            const count = votesByOption[option] ?? 0;
            const percentage = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
            const isChosen = currentUserOption === option;

            return (
              <div key={option} className=" px-4 py-1">
                <div className="mb-1 flex items-center justify-between gap-2 text-[11px]">
                  <span className={`${isChosen ? "text-purple-300" : "text-slate-300"} flex items-center gap-4`}>
                    {option}{isChosen && <span>Tu voto</span>}
                  </span>
                  <span className="text-slate-400">
                    {count} · {percentage}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${isChosen ? "bg-purple-500" : "bg-slate-500"}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {vote.options.map((option) => (
            <button
              key={option}
              type="button"
              disabled={isVoting || isClosed}
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
      )}

      {isClosed && (
        <p className="mt-2 text-xs text-slate-500">Esta votación está cerrada.</p>
      )}
    </>
  );
};