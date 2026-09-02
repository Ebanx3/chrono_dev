import { EmptyStarSVG } from "../../../assets/EmptyStarSVG";

export const FollowersButton = ({ followers }: { followers: string[] }) => {
  return (
    <button className="flex gap-2 items-center text-purple-400 py-1 px-2 rounded-xl hover:bg-purple-900 hover:text-white cursor-pointer text-sm font-medium">
      <EmptyStarSVG />
      {followers.length}
    </button>
  );
};
