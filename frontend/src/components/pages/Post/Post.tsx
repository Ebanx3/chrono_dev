import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { RecognitionButton } from "./RecognitionButton";
import { PostReplies } from "./PostReplies";

export const Post = () => {
  const { postId } = useParams();
  const { data, error, loading } = useFetch<Post>(`/post/${postId}`);

  if (error) {
    return (
      <>
        <title>Error</title>
        <div className="text-center text-slate-400">
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
      <title>{data!.title}</title>
      <main className="max-w-[1160px] m-auto p-4">
        <article className="flex flex-col my-4 border-b pb-8 border-slate-800">
          <h1 className="text-2xl font-bold text-slate-100">{data!.title}</h1>
          <span className="text-slate-300">
            Publicado por:{" "}
            <Link
              to={`/usuarios/${data!.authorId}`}
              className="font-bold text-purple-400 hover:text-purple-600"
            >
              {data?.authorUsername}
            </Link>
          </span>
          <span className="text-xs text-slate-400">{new Date(data!.createdAt).toLocaleDateString()}</span>
          <p className="mt-10 whitespace-pre-line text-slate-400">{data?.content}</p>
          <div className="self-end flex gap-4">
            <RecognitionButton post={data!} recognitionType="likes" users={data!.likes_received}/>
            <RecognitionButton post={data!} recognitionType="documentation" users={data!.documentation_received}/>
            <RecognitionButton post={data!} recognitionType="innovation" users={data!.innovation_received}/>
            <RecognitionButton post={data!} recognitionType="mentorship" users={data!.mentorship_received}/>
            <RecognitionButton post={data!} recognitionType="inspiration" users={data!.inspiration_received}/>
            <RecognitionButton post={data!} recognitionType="resolution" users={data!.resolution_received}/>
          </div>
        </article>
        <PostReplies postId={data!._id} />
        {/* <p className="whitespace-pre-line text-xs text-stone-400 absolute bottom-0 left-0">{JSON.stringify(data, null, 2)}</p> */}
      </main>
    </>
  );
};
