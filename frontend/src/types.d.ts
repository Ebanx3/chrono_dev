type ProjectPermission =
  | "project.pending_members.view"
  | "project.members.invite"
  | "project.members.accept"
  | "project.members.remove"
  | "project.members.edit_role"
  | "project.members.ban"
  | "project.details.edit"
  | "project.resources.add"
  | "project.resources.remove"
  | "project.resources.edit"
  | "project.tickets.create"
  | "project.tickets.edit"
  | "project.tickets.delete"
  | "project.tickets.request"
  | "project.tickets.assign"
  | "project.activity.add"
  | "project.activity.edit"
  | "project.activity.delete";

type Project = {
  _id: string;
  name: string;
  details: string;
  founder: { _id: string; username: string };
  techs: string[];
  members: ProjectMember[];
  pendingMembers: ProjectPendingMember[];
  modules: string[];
  roles: string[];
  isPublic: boolean;
  followers: string[];
  createdAt: string;
  updatedAt: string;
  resources: Link[];
  iAmMember: boolean;
  iAmPendingMember: boolean;
};

type ProjectWithUserFlags = Project & {
  iAmMember: boolean;
  iAmPendingMember: boolean;
} & { permissions: Record<ProjectPermission, boolean> };

type ProjectActivityItem = {
  _id: string;
  type: "discussion" | "vote" | "ticket";
  author: { _id: string; username: string };
  projectId:string;
  discussion?: {
    title: string;
    content: string;
    status: "open" | "closed";
  };
  vote?: {
    details: string;
    options: string[];
    votes: { userId: string; option: string }[];
    status: "open" | "closed";
  };
  ticketActivity?: {
    ticketId: string;
    action: "created" | "updated" | "deleted" | "assigned";
    assignedTo?: { userId: string | { _id: string; username: string } };
    createdAt?: string;
  };
  createdAt: string;
};


type ProjectMember = {
  user: { _id: string; username: string };
  role: string;
  permissions: ProjectPermission[];
};

type PendingMember = {
  _id: string;
  username: string;
};

type Link = {
  name: string;
  url: string;
};

type PostRecognition = {
  mentorship_received: string[];
  documentation_received: string[];
  innovation_received: string[];
  resolution_received: string[];
  inspiration_received: string[];
};

type Post = PostRecognition & {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; username: string };
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
  followers: string[];
};

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  isLoggedIn: boolean;
};

type Reply = {
  _id: string;
  postId: string;
  author: { _id: string; username: string };
  content: string;
  createdAt: string;
};

type AddProjectActivity =
  | { type: "discussion"; title: string; content: string }
  | { type: "vote"; details: string; options: string[] }
  | {
      type: "ticket";
      ticketId: string;
      action: "created" | "updated" | "deleted" | "assigned";
      assignedTo?: string;
    };
