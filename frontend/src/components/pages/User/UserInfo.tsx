import { useState } from "react";
import { EditUserInfoButton } from "./EditUserInfoButton";
import { EditUserModal } from "./EditUserModal";
import { FollowersButton } from "./FollowersButton";


export const UserInfo = ({
  user,
  canEdit,
  refetchUser,
}: {
  user: User;
  canEdit: boolean;
  refetchUser: () => void;
}) => {
  const { username, title, description, stack, followers } = user;
  const [showEditMenu, setShowEditMenu] = useState(false);

  return (
    <>
      <section className="p-4 relative flex-1 flex flex-col justify-between ">
        {canEdit && (
          <EditUserInfoButton showEditMenu={() => setShowEditMenu(true)} />
        )}
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-200 ">{username} </h2>
            <FollowersButton followers={followers} />
          </div>
          <h3 className="text-slate-300 text-xl font-medium mb-2">
            {title || "Sin título"}
          </h3>
          <p className="mt-4 whitespace-pre-wrap text-slate-400">
            {description || "Sin descripción"}
          </p>
        </div>

        {stack && stack.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Stack:</h4>
            <ul className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <li
                  key={tech}
                  className="border  text-slate-500 px-2 border-slate-700 rounded-full text-sm font-medium"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      {showEditMenu && canEdit && (
        <EditUserModal
          closeModal={() => setShowEditMenu(false)}
          user={user}
          refetchUser={refetchUser}
        />
      )}
    </>
  );
};
