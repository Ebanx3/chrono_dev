import Post from "./schema";

const create = async ({
  ownerId,
  title,
  content,
  tags
}: {
  ownerId: string;
  title: string;
  content: string;
  tags:string[]
}) => {
  try {
    const newPost = new Post({ ownerId, title, content,tags });
    await newPost.save();
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

export const PostModel = { create, getPosts };
