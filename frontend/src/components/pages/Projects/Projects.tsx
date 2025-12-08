import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useFetch } from "../../../hooks/useFetch";
import { CreateButton } from "../../Layout/CreateButton";
// import { PostCard } from "./PostCard";

export const Projects = () => {
  const { data, loading, error } = useFetch<Post[]>("/project");

   if (error) {
    return (
      <div className="text-center">
        Hubo un error intentando traer las publicaciones.
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <title>Publicaciones</title>
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }


  return ( <>
        <title>Publicaciones</title>
        <main className="max-w-[1160px] m-auto flex flex-col">
          <CreateButton label='Nueva publicación' onClickMethod={()=>{}}/>
          <div className=" flex flex-col gap-6 p-4">
          {data &&
            data.map((post) => (
              <>
                {/* <PostCard key={post._id} post={post} /> */}
              </>
            ))}
        </div>
        </main>
      </>);
};