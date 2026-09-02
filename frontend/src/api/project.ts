const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createProject = async ({
  name,
  details,
  techs,
  isPublic,
}: {
  name: string;
  details: string;
  isPublic: boolean;
  techs: string[];
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/project`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
      body: JSON.stringify({ name, details, techs, isPublic }),
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

export const getProjectById = async (id: string) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${id}`, { 
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const json = (await data.json()) as ServerResponse<Project>;
    return json;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al intentar conectar con el servidor",
    };
  } 
};