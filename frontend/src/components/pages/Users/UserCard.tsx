import { Link } from "react-router-dom";
import NoAvatar from "../../../assets/no-avatar.png";

export const UserCard = ({ user }: { user: User }) => {
  return (
    <Link to={`/usuario/${user._id}`} className="hover:bg-stone-100 w-56">
    <article className="flex flex-col items-center border border-stone-300 rounded-lg p-4 ">
       <img
          src={user.urlAvatar ?? NoAvatar}
          alt="user avatar"
          className="size-full rounded-full border border-stone-200"
        />
      <h2 className="text-xl font-bold mt-2">{user.username}</h2>
      <span className="h-8 text-stone-600 text-sm">{user.title || "Sin título"}</span>
    </article>
    </Link>
  );
};
