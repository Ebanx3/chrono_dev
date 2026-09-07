export const PendingMembers = ({
  pendingMembers,
}: {
  pendingMembers: PendingMember[];
}) => {
  return (
    <div className="mt-8 w-full">
      <h2 className=" font-semibold mb-2 text-slate-300">Pendientes de aprobación</h2>
      {pendingMembers.length === 0 ? (
        <span className="text-slate-500 text-sm">No hay miembros pendientes.</span>
      ) : (
        pendingMembers.map((member) => (
          <div key={member._id}>
            <span>{member.username}</span>
          </div>
        ))
      )}
    </div>
  );
};
