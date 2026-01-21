const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createPostReply = async ({ postId, content }: { postId: string; content: string }) => {
  try {
    const data = await fetch(`${SERVER_URL}/post-reply/${postId}`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
      body: JSON.stringify({ content }),
    });
    const json = (await data.json()) as ServerResponse<null>;
    return json;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al intentar conectar con el servidor",
    };
  }
};
