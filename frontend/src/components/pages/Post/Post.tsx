import { Link, useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { LoaderSVG } from "../../../assets/LoaderSVG";
import { RecognitionButton } from "./RecognitionButton";
import "./prose.css";
import { MarkdownRenderer } from "./MarjdownRenderer";

export const Post = () => {
  const { postId } = useParams();
  const { data, error, loading } = useFetch<Post>(`/post/${postId}`);

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
      <title>{data!.title}</title>
      <main className="max-w-[1160px] min-h-screen m-auto p-4">
        <article className="flex flex-col my-4 border-b pb-8 border-stone-300">
          <h1 className="text-2xl font-bold text-stone-800">{data!.title}</h1>
          <span className="text-stone-500">
            Publicado por:{" "}
            <Link
              to={`/usuarios/${data!.authorId}`}
              className="font-medium text-emerald-600 hover:border-b-2"
            >
              {data?.authorUsername}
            </Link>
          </span>
          <span className="text-xs text-stone-500">
            {new Date(data!.createdAt).toLocaleDateString()}
          </span>
          <div className="prose p-4">
            <MarkdownRenderer content={data!.content} />
          </div>

          <div className="self-end flex gap-4">
            <RecognitionButton
              post={data!}
              recognitionType="likes"
              users={data!.likes_received}
            />
            <RecognitionButton
              post={data!}
              recognitionType="documentation"
              users={data!.documentation_received}
            />
            <RecognitionButton
              post={data!}
              recognitionType="innovation"
              users={data!.innovation_received}
            />
            <RecognitionButton
              post={data!}
              recognitionType="mentorship"
              users={data!.mentorship_received}
            />
            <RecognitionButton
              post={data!}
              recognitionType="inspiration"
              users={data!.inspiration_received}
            />
            <RecognitionButton
              post={data!}
              recognitionType="resolution"
              users={data!.resolution_received}
            />
          </div>
        </article>
        {/* <p className="whitespace-pre-line text-xs text-stone-400 absolute bottom-0 left-0">
          {JSON.stringify(data, null, 2)}
        </p> */}
      </main>
    </>
  );
};
