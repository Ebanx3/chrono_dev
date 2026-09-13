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

export const addResourceToProject = async ({
  projectId,
  name,
  url,
}: {
  projectId: string;
  name: string;
  url: string;
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/addResource`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ name, url }),
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

export const joinAsPendingMember = async (projectId:string) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/joinAsPendingMember`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH"
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
}

export const joinAsMember = async (projectId:string) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/joinAsMember`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH"
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
}

export const acceptPendingMember = async (projectId:string, userId:string) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/acceptPendingMember/${userId}`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH"
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
}

export const rejectPendingMember = async (projectId:string, userId:string) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/rejectPendingMember/${userId}`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH"
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
}

export const editMember = async ({
  projectId,
  userId,
  role,
  permissions,
}: {
  projectId: string;
  userId: string;
  role: string;
  permissions: ProjectPermission[];
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/editMember/${userId}`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ role, permissions }),
    });
    return (await data.json()) as ServerResponse<Project>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const removeMember = async (projectId: string, userId: string) => {
  try {
    const data = await fetch(`${SERVER_URL}/project/${projectId}/removeMember/${userId}`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
    });
    return (await data.json()) as ServerResponse<Project>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const getProjectActivity = async (projectId: string) => {
  try {
    const response = await fetch(`${SERVER_URL}/project/${projectId}/activity`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    return (await response.json()) as ServerResponse<ProjectActivity>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const addActivityToProject = async ({
  projectId,
  activity,
}: {
  projectId: string;
  activity: AddProjectActivity;
}) => {
  try {
    const response = await fetch(`${SERVER_URL}/project/${projectId}/activity`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(activity),
    });
    return (await response.json()) as ServerResponse<ProjectActivity>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};