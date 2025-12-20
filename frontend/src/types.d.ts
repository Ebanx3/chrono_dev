type Iask = {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
  assignedTo?: { userId: string; username: string };
  dueDate?: Date;
}

type Module = {
  name: string;
  details: string;
  isPublic: boolean;
  allowedRoles: string[]; // ej: ["admin", "editor"]
  allowedUsers: { userId: string; username: string }[];
  tasks: ITask[];
  connections: { targetModuleId: string; type: string }[]; // ej: "dependency", "related"
  projectId: string;
}

type Project = {
  _id:string;
  name: string;
  details: string;
  founderId: string;
  founderUsername: string;
  techs: string[];
  members: { userId: string; username: string; role: string }[];
  pendingMembers: { userId: string; username: string }[];
  modules: string[]; // relación con módulos
  roles: Array<string>;
  isPublic:boolean;
}

type Link = {
  site: string;
  link: string;
};

type PostRecognition = {
    mentorship_received: string[];
  documentation_received: string[];
  innovation_received: string[];
  resolution_received: string[];
  inspiration_received: string[];
}

type Post = PostRecognition & {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername: string;
  tags: string[];
  likes_received: string[];
  comments_received: string[];
  createdAt: string;
};

type PostStats = {
  created: number;
  likes_received: number;
  comments_received: number;

  // Reacciones especializadas
  mentorship_received: number; // “Mentoría técnica”
  documentation_received: number; // “Documentación clara”
  innovation_received: number; // “Idea innovadora”
  resolution_received: number; // “Resolución efectiva”
  inspiration_received: number; // “Inspiración creativa”
}

type ProjectStats = {
  created: number;
  projects_completed: number;
  projects_completed_as_founder: number;
  tasks_completed: number;

  // Reconocimientos por tareas
  mentor_recognitions: number; // "Mentoría técnica"
  resolver_recognitions: number; // "Resolución efectiva"
  quality_recognitions: number; // "Documentación clara / calidad"
  innovation_recognitions: number; // "Idea innovadora"
  team_support_recognitions: number; // "Apoyo al equipo"

  // Reconocimientos por proyectos
  leadership_recognitions: number; // "Liderazgo"
  documentation_recognitions: number; // "Documentador oficial"
  collaboration_recognitions: number; // "Colaboración destacada"
  impact_recognitions: number; // "Aporte clave"
  inspiration_recognitions: number; // "Inspirador"
}

type User = {
  email: string;
  username: string;
  password: string;
  urlAvatar?: string;
  title?: string;
  description?: string;
  stack: Array<string>;
  links: Array<{ site: string; link: string }>;
  isVerifiedEmail: boolean;
  verificationEmailCode?: string | null;
  projects: Array<{ id: string; name: string }>;
  posts: Array<{ id: string; title: string }>;
  postsStats: PostStats;
  projectsStats: ProjectStats;
  followers: Array<string>;
  users_following: Array<string>;
  projects_following: Array<string>;
}

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
