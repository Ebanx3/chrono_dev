import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useFetch } from "../../../hooks/useFetch";
import { UserCard } from "./UserCard";

export const Users = () => {
  const { data, loading, error } = useFetch<User[]>("/user");

  if (error) {
    return (
      <div className="text-center">
        Hubo un error intentando traer los usuarios.
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <title>Usuarios</title>
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }

  return (
    <>
      <title>Usuarios</title>
      <div className="max-w-[1160px] m-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 p-4">
        {data &&
          data.map((user) => (
            <>
              <UserCard key={user._id} user={user} />
            </>
          ))}
      </div>
    </>
  );
};
