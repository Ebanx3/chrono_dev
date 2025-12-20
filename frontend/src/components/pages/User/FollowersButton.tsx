import { EmpryStarSVG } from "../../../assets/EmpryStarSVG";

export const FollowersButton = ({followers}:{followers: string[]}) => {
  return (<button className="flex gap-2 items-center text-white bg-emerald-900 py-1 px-2 rounded-xl hover:bg-emerald-600 cursor-pointer"><EmpryStarSVG />{followers.length}</button>);
};