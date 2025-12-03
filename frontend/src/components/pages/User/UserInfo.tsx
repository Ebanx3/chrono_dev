import { useState } from "react";
import { EditUserInfoButton } from "./EditUserInfoButton";
import { EditUserModal } from "./EditUserModal";

export const UserInfo = ({
  user,
  canEdit,
}: {
  user: User;
  canEdit: boolean;
}) => {
  const { username, title, description, stack } = user;
  const [showEditMenu, setShowEditMenu] = useState(false);

  return (
    <>
      <section className="p-4 relative flex-1">
        {canEdit && (
          <EditUserInfoButton showEditMenu={() => setShowEditMenu(true)} />
        )}
        <h2 className="text-2xl font-bold text-stone-800">{username}</h2>
        <h3 className="text-stone-600 text-lg mt-1">{title || "Sin título"}</h3>
        <p className="mt-4 whitespace-pre-wrap">
          {description || "Sin descripción"}
        </p>

        {stack && stack.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Stack:</h4>
            <ul className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <li
                  key={tech}
                  className="bg-stone-200 text-stone-800 px-2 py-1 rounded-full text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      {showEditMenu && canEdit && (
        <EditUserModal closeModal={() => setShowEditMenu(false)} user={user}/>
      )}
    </>
  );
};
