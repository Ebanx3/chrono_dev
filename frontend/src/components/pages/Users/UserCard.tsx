import { Link } from "react-router-dom";
import NoAvatar from "../../../assets/no-avatar.png";

export const UserCard = ({ user }: { user: User }) => {
  return (
    <Link to={`/usuarios/${user._id}`} className="hover:scale-102 transition ease-in-out duration-300 w-56">
    <article className="flex flex-col items-center border border-slate-800 rounded-lg p-4 ">
       <img
          src={user.urlAvatar ?? NoAvatar}
          alt="user avatar"
          className="size-full rounded-full border border-slate-600"
        />
      <h2 className="text-xl font-bold mt-2 text-slate-100">{user.username}</h2>
      <span className="h-8 text-slate-400 text-sm">{user.title || "Sin título"}</span>
    </article>
    </Link>
  );
};
