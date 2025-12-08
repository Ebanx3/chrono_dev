import { LoaderSVG } from "../../../assets/LoaderSVG";
import { useFetch } from "../../../hooks/useFetch";
import { PostCard } from "./PostCard";

export const PostsContainer = () => {
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
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }

  return (
    <>
      <div className=" flex flex-col gap-6 p-4">
        {data &&
          data.map((post) => (
              <PostCard key={post._id} post={post} />
          ))}
      </div>
    </>
  );
};
