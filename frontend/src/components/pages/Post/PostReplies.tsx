import {useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import "./prose.css";

export const PostReplies = () => {
  const { postId } = useParams();
  const { error, loading } = useFetch<PostReply[]>(`/post-reply/${postId}`);

  if (error) {
    return (
      <>
        <title>Error</title>
        <div className="text-center">
          Hubo un error intentando traer las publicaciones.
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <title>Chrono-dev</title>
        <div className="w-full flex justify-center mt-10">
          <LoaderSVG />
        </div>
      </>
    );
  }

  return (
    <>
        <div>
            {}
        </div>
    </>
  );
};
