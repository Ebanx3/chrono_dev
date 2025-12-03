import NoAvatar from "../../../assets/no-avatar.png";

export const Avatar = ({ url }: { url?: string }) => {
  return (
    <img
      src={url ?? NoAvatar}
      alt="user avatar"
      className="size-64 rounded-full border border-stone-200"
    />
  );
};
