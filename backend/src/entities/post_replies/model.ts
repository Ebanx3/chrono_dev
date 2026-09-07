import PostReplies from "./schema";

const createPostReply = async ({
  author,
  postId,
  content,
}: {
  author: String;
  postId: String;
  content: String;
}) => {
  try {
    const newReplyPost = new PostReplies({
      author,
      postId,
      content,
    });
    await newReplyPost.save();
  } catch (err) {
    console.error("Error al responder una publicacion: ", err);
    return "Error inesperado al responder la publicacion";
  }
};

const getPostReplies = async (postId: string) => {
  try {
    return await PostReplies.find({ postId }).populate("author", "username").sort({
      createdAt: -1,
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const ReplyPostModel = { createPostReply, getPostReplies };
