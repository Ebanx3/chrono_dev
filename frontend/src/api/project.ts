const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const buildProjectUrl = (projectId: string, ...pathParts: string[]) => {
  const safeParts = ["project", projectId, ...pathParts.filter(Boolean)];
  return `${SERVER_URL}/${safeParts.join("/")}`;
};

export const createProject = async ({
  name,
  details,
  techs,
  isPublic,
  areas
}: {
  name: string;
  details: string;
  isPublic: boolean;
  techs: string[];
  areas: string[];
}) => {
  try {
    const data = await fetch(`${SERVER_URL}/project`, {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "post",
      body: JSON.stringify({ name, details, techs, isPublic,areas }),
    });
    const json = (await data.json()) as ServerResponse<string>;
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
    const data = await fetch(buildProjectUrl(id), {
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
    const data = await fetch(buildProjectUrl(projectId, "addResource"), {
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

export const joinAsPendingMember = async (projectId: string) => {
  try {
    const data = await fetch(buildProjectUrl(projectId, "joinAsPendingMember"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
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

export const joinAsMember = async (projectId: string) => {
  try {
    const data = await fetch(buildProjectUrl(projectId, "joinAsMember"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
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

export const acceptPendingMember = async (projectId: string, userId: string) => {
  try {
    const data = await fetch(buildProjectUrl(projectId, "acceptPendingMember", userId), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
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

export const rejectPendingMember = async (projectId: string, userId: string) => {
  try {
    const data = await fetch(buildProjectUrl(projectId, "rejectPendingMember", userId), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
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
    const data = await fetch(buildProjectUrl(projectId, "editMember", userId), {
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
    const data = await fetch(buildProjectUrl(projectId, "removeMember", userId), {
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

export const getProjectTickets = async (projectId: string) => {
  try {
    const response = await fetch(buildProjectUrl(projectId, "tickets"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    return (await response.json()) as ServerResponse<ProjectTicket[]>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const createTicket = async ({
  projectId,
  title,
  area,
  description,
  durationDays,
}: {
  projectId: string;
  title: string;
  area: string;
  description?: string;
  durationDays: number;
}) => {
  try {
    const response = await fetch(buildProjectUrl(projectId, "tickets"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ title, area, description, durationDays }),
    });
    return (await response.json()) as ServerResponse<ProjectTicket>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const requestTicket = async ({
  projectId,
  ticketId,
}: {
  projectId: string;
  ticketId: string;
}) => {
  try {
    const response = await fetch(buildProjectUrl(projectId, `tickets/${ticketId}/request`), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
    });
    return (await response.json()) as ServerResponse<ProjectTicket>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const assignTicket = async ({
  projectId,
  ticketId,
  userId,
}: {
  projectId: string;
  ticketId: string;
  userId: string;
}) => {
  try {
    const response = await fetch(buildProjectUrl(projectId, `tickets/${ticketId}/assign`), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({ userId }),
    });
    return (await response.json()) as ServerResponse<ProjectTicket>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const finishTicket = async ({
  projectId,
  ticketId,
}: {
  projectId: string;
  ticketId: string;
}) => {
  try {
    const response = await fetch(buildProjectUrl(projectId, `tickets/${ticketId}/finish`), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
    });
    return (await response.json()) as ServerResponse<ProjectTicket>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const getProjectActivity = async (projectId: string) => {
  try {
    const response = await fetch(buildProjectUrl(projectId, "activity"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    return (await response.json()) as ServerResponse<ProjectActivityItem[]>;
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
    const response = await fetch(buildProjectUrl(projectId, "activity"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(activity),
    });
    return (await response.json()) as ServerResponse<null>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const addDiscussionMessage = async ({
  projectId,
  activityId,
  content,
}: {
  projectId: string;
  activityId: string;
  content: string;
}) => {
  try {
    const response = await fetch(
      buildProjectUrl(projectId, "activity", activityId, "messages"),
      {
        headers: { "content-type": "application/json" },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ content }),
      },
    );
    return (await response.json()) as ServerResponse<ProjectActivityItem>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const addVote = async ({
  projectId,
  activityId,
  option,
}: {
  projectId: string;
  activityId: string;
  option: string;
}) => {
  try {
    const response = await fetch(
      buildProjectUrl(projectId, "activity", activityId, "votes"),
      {
        headers: { "content-type": "application/json" },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ option }),
      },
    );
    return (await response.json()) as ServerResponse<ProjectActivityItem>;
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al intentar conectar con el servidor" };
  }
};

export const updateProjectSettings = async ({
  projectId,
  settings,
}: {
  projectId: string;
  settings: Partial<ProjectSettings>;
}) => {
  try {
    const data = await fetch(buildProjectUrl(projectId, "settings"), {
      headers: { "content-type": "application/json" },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify(settings),
    });
    return (await data.json()) as ServerResponse<Project>;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Error al intentar conectar con el servidor",
    };
  }
};