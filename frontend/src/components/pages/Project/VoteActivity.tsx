export const VoteActivity = ({
  vote,
}: {
  vote: NonNullable<ProjectActivityItem["vote"]>;
}) => {
  return (
    <>
      <h3 className="font-semibold text-slate-200">{vote.details}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {vote.options.map((option) => (
          <span
            key={option}
            className="rounded-md bg-slate-800 px-2 py-1 text-sm text-slate-300"
          >
            {option}
          </span>
        ))}
      </div>
    </>
  );
};