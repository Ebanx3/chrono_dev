import { Link } from "react-router-dom";
import { MessageSVG } from "../../../assets/MessageSVG";
import { LikeEmptySVG } from "../../../assets/LikeEmptySVG";
import { StarsSVG } from "../../../assets/recognitions/StarsSVG";

const addRecognitions = (post: Post):number => {
  const { documentation_received, innovation_received, inspiration_received, mentorship_received, resolution_received} = post;
  return documentation_received.length + innovation_received.length + inspiration_received.length + mentorship_received.length + resolution_received.length
} 

export const PostCard = ({ post }: { post: Post }) => {
  return (
    <Link
      to={`/publicaciones/${post._id}`}
      className="block border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white hover:bg-stone-100 border-stone-400"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-stone-800">{post.title}</h2>
        <span className="text-xs text-stone-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-stone-600 mb-2">
        Publicado por <span className="font-medium">{post.authorUsername}</span>
      </p>

      {/* <p className="text-sm text-stone-500 line-clamp-3 mb-3 whitespace-pre-line">
        {post.content}
      </p> */}

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-3 text-stone-500">
          <span className="flex items-center gap-1">
            <LikeEmptySVG /> {post.likes_received.length}
          </span>
          <span className="flex items-center gap-1">
            <MessageSVG /> {post.comments_received}
          </span>
          <span className="flex items-center gap-1">
            <StarsSVG /> {addRecognitions(post)}
          </span>
        </div>
      </div>
    </Link>
  );
};
