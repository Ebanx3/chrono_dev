import PostReplies from "./schema";

const createPostReply = async ({
  author,
  postId,
  content,
}: {
  author: string;
  postId: string;
  content: string;
}) => {
  const newReplyPost = new PostReplies({
    author,
    postId,
    content,
  });
  return newReplyPost.save();
};

const getPostReplies = async (postId: string) => {
  return PostReplies.find({ postId }).populate("author", "username").sort({
      createdAt: -1,
    });
};

export const ReplyPostModel = { createPostReply, getPostReplies };
