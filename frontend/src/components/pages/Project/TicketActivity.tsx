export const TicketActivity = ({
  ticketActivity,
}: {
  ticketActivity: NonNullable<ProjectActivityItem["ticketActivity"]>;
}) => {
  return (
    <p className="text-sm text-slate-300">
      Ticket{" "}
      <span className="font-mono text-slate-400">
        {ticketActivity.ticketId}
      </span>
      : {ticketActivity.action}
    </p>
  );
};