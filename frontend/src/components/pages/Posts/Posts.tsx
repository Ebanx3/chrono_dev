import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useFetch } from "../../../hooks/useFetch";
import { PostCard } from "./PostCard";

export const Posts = () => {
  const { data, loading, error } = useFetch<Post[]>("/post");

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
        <div className="max-w-[1160px] m-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 p-4">
          {data &&
            data.map((post) => (
              <>
                <PostCard key={post._id} post={post} />
              </>
            ))}
        </div>
      </>);
};