const get_signature_endpoint = `${
  import.meta.env.VITE_SERVER_URL
}/user/cloudinary_signature`;
const cloudinary_api_key = import.meta.env.VITE_CLOUDINARY_API_KEY;
const cloud_name = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const cloudinary_endpoint = import.meta.env.VITE_CLOUDINARY_ENDPOINT;

type CloudinaryData = {
  signature: string;
  timestamp: number;
  folder: string;
};

export const uploadPicture = async (image: File) => {
  try {
    const signatureResponse = await fetch(get_signature_endpoint, {
      credentials: "include",
    });
    const json =
      (await signatureResponse.json()) as ServerResponse<CloudinaryData>;
      console.log(json); 
    if (!json.success) {
      return null;
    }

    const { signature, timestamp, folder } = json.data!;

    const data = new FormData();

    data.append("file", image);
    data.append("api_key", cloudinary_api_key);
    data.append("signature", signature);
    data.append("timestamp", timestamp.toString());
    data.append("folder", folder);

    const cloudinaryResponse = await fetch(
      `${cloudinary_endpoint}/${cloud_name}/image/upload`,
      { method: "POST", body: data }
    );
    const jsonC = await cloudinaryResponse.json();
    return jsonC.secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};
