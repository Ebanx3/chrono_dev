import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useUserContext } from "../../../hooks/useUserContext";
import { Avatar } from "./Avatar";
import { UserInfo } from "./UserInfo";
import { UserLinks } from "./UserLinks";

export const User = () => {
  const { userId } = useParams();
  const { data, loading, error } = useFetch<User>(`/user/${userId}`);
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
      <main className="flex max-w-[1160px] m-auto my-8">
        <div className="flex w-full gap-4">
          <Avatar url={data?.urlAvatar} />
          <UserInfo user={data!} canEdit={user?._id === data!._id}/>
          <UserLinks links={data!.links} />
        </div>
      </main>
        <p className="whitespace-pre text-stone-400 text-sm absolute top-0 left-0">{JSON.stringify(data, null, 2)}</p>
    </>
  );
};
