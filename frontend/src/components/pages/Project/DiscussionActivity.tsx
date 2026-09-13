export const DiscussionActivity = ({
  discussion,
  authorUsername
}: {
  discussion: NonNullable<ProjectActivityItem["discussion"]>;
  authorUsername: string
}) => {
  return (
    <>
      <h3 className="font-semibold text-slate-200">{discussion.title}</h3>
      <p className="mt-1 whitespace-pre-line text-sm text-slate-400">
        {discussion.content}
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Por {authorUsername}
      </p>
    </>
  );
};