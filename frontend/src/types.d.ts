type Iask = {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "done";
  assignedTo?: { userId: Types.ObjectId; username: string };
  dueDate?: Date;
}

type Module = {
  name: string;
  details: string;
  isPublic: boolean;
  allowedRoles: string[]; // ej: ["admin", "editor"]
  allowedUsers: { userId: Types.ObjectId; username: string }[];
  tasks: ITask[];
  connections: { targetModuleId: Types.ObjectId; type: string }[]; // ej: "dependency", "related"
  projectId: Types.ObjectId;
}

type Project = {
  _id:string;
  name: string;
  details: string;
  founderId: Types.ObjectId;
  founderUsername: string;
  techs: string[];
  members: { userId: Types.ObjectId; username: string; role: string }[];
  pendingMembers: { userId: Types.ObjectId; username: string }[];
  modules: Types.ObjectId[]; // relación con módulos
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

type User = {
  _id: string;
  username: string;
  email: string;
  urlAvatar?: string;
  title?: string;
  description?: string;
  stack: string[];
  links: Link[];
  projects: Project[];
  posts: Post[];
};

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
