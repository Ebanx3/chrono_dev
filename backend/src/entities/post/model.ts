import Post from "./schema";

const create = async ({
  authorId,
  authorUsername,
  title,
  content,
  tags
}: {
  authorId: string;
  authorUsername: string;
  title: string;
  content: string;
  tags:string[]
}) => {
  try {
    const newPost = new Post({ authorId, authorUsername, title, content,tags });
    return await newPost.save();
  } catch (error) {
    console.error("Error al crear una nueva publicacion:", error);
    return "Error inesperado al crear la publicacion";
  }
};

const getPosts = async () => {
  try {
    return await Post.find();
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getPostById = async (postId:string) => {
  try {
    return await Post.findById(postId)
  } catch (error) {
    console.log(error);
    return null;
  }
}

export type RecognitionType = "documentation" | "inspiration" | "innovation" | "resolution" | "mentorship" | "likes"

const addOrRemoveRecognition = async ({recognitionType, postId, userId}:{ recognitionType: RecognitionType ,postId:string, userId:string}) => {
  try {
    const post = await Post.findById(postId);
    if(!post) return "No se encontró la publicación";

    const field = `${recognitionType}_received` as keyof typeof post;
    const arr = post[field] as string[];

    const index = arr.findIndex(uId => uId === userId);

    if(index < 0) {
      arr.push(userId);
    }
    else{
      arr.splice(index, 1)
    }

    return (await post.save()).toJSON()
  } catch (error) {
    console.error("Error al crear una nueva publicacion:", error);
    return "Error inesperado al crear la publicacion";
  }
}

export const PostModel = { create, getPosts, getPostById, addOrRemoveRecognition };
