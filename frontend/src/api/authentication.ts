const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/user/login`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
      body: JSON.stringify({ username, password }),
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

export const register = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/user/register`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
      body: JSON.stringify({ username, email, password }),
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

export const logout = async () => {
  try {
    const data = await fetch(`${SERVER_URL}/user/logout`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
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
