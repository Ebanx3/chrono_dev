import { type RecognitionType } from "../components/pages/Post/RecognitionButton";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createPost = async ({
  title,
  content,
  tags,
}: {
  title: string;
  content: string;
  tags: string[];
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/post`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
      body: JSON.stringify({ title, content, tags }),
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

export const addOrRemoveRecognition = async ({postId, recognitionType}:{postId:string, recognitionType: RecognitionType}) => {
  try {
    const data = await fetch(`${SERVER_URL}/post/${recognitionType}/${postId}`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
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
}