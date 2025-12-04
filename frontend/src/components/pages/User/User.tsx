import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useUserContext } from "../../../hooks/useUserContext";
import { Avatar } from "./Avatar";
import { UserInfo } from "./UserInfo";
import { UserLinks } from "./UserLinks";
import { UserProjects } from "./UserProjects";

export const User = () => {
  const { userId } = useParams();
  const { data, loading, error, refetch } = useFetch<User>(`/user/${userId}`);
  const { user } = useUserContext();

  if (error) {
    return (
      <div className="text-center">
        Hubo un error intentando traer el usuario.
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <title>Cargando usuario...</title>
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }

  return (
    <>
      <title>{data!.username}</title>
      <main className="max-w-[1160px] m-auto">
        <div className="flex w-full gap-4 my-6">
          <Avatar url={data?.urlAvatar} canEdit={user?._id === data!._id} />
          <UserInfo user={data!} canEdit={user?._id === data!._id} refetchUser={refetch}/>
          <UserLinks links={data!.links} />
        </div>
        <UserProjects />
      </main>
        <p className="whitespace-pre text-stone-400 text-xs absolute top-0 left-0">{JSON.stringify(data, null, 2)}</p>
    </>
  );
};
