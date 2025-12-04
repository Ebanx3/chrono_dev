import { useState } from "react";
import { EditUserInfoButton } from "./EditUserInfoButton";
import { EditUserModal } from "./EditUserModal";

export const UserInfo = ({
  user,
  canEdit,
  refetchUser,
}: {
  user: User;
  canEdit: boolean;
  refetchUser: () => void;
}) => {
  const { username, title, description, stack } = user;
  const [showEditMenu, setShowEditMenu] = useState(false);

  return (
    <>
      <section className="p-4 relative flex-1 flex flex-col justify-between">
        {canEdit && (
          <EditUserInfoButton showEditMenu={() => setShowEditMenu(true)} />
        )}
        <div>
          <h2 className="text-2xl font-bold text-stone-800">{username}</h2>
          <h3 className="text-stone-600 text-lg font-medium mb-2">
            {title || "Sin título"}
          </h3>
          <p className="mt-4 whitespace-pre-wrap text-stone-500">
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
                  className="border  text-stone-600 px-2  rounded-full text-sm font-medium"
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
