import Post from "./schema";

const create = async ({
  author,
  title,
  content,
  tags
}: {
  author: string;
  title: string;
  content: string;
  tags:string[]
}) => {
  const newPost = new Post({ author, title, content, tags });
  return newPost.save();
};

const getPosts = async () => {
  return Post.find().populate("author", "username").sort({ createdAt: -1 });
};

const getPostById = async (postId:string) => {
  return Post.findById(postId).populate("author", "username");
}

const getPostsByUserId = async (userId:string) => {
  return Post.find({ author: userId }).populate("author", "username").sort({ createdAt: -1 });
}

export type RecognitionType = "documentation" | "inspiration" | "innovation" | "resolution" | "mentorship" | "likes"

const addOrRemoveRecognition = async ({recognitionType, postId, userId}:{ recognitionType: RecognitionType ,postId:string, userId:string}) => {
  const post = await Post.findById(postId);
  if (!post) return null;

  const field = `${recognitionType}_received` as keyof typeof post;
  const arr = post[field] as string[];

  const index = arr.findIndex(uId => uId === userId);

  if (index < 0) {
    arr.push(userId);
  } else {
    arr.splice(index, 1);
  }

  return (await post.save()).toJSON();
}

export const PostModel = { create, getPosts, getPostById, addOrRemoveRecognition, getPostsByUserId };
