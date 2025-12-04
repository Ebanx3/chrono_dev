const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type UpdatableUserFields = {
  title?: string;
    description?: string;
    links?: Link[];
    stack?: string[];
};

export const updateUser = async ({
  title,
  description,
  links,
  stack,
}: UpdatableUserFields) => {
  try {
    const data = await fetch(`${SERVER_URL}/user/`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ title, description, links, stack }),
    });
    const json = (await data.json()) as ServerResponse<User>;
    return json;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al intentar conectar con el servidor",
    };
  }
};

export const updateAvatar = async (urlAvatar: string) => {
  try {
    const data = await fetch(`${SERVER_URL}/user/`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ urlAvatar }),
    });
    const json = (await data.json()) as ServerResponse<User>;
    return json;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al intentar conectar con el servidor",
    };
  }
};