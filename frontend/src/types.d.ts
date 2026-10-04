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

type ProjectJoinMode = "open" | "request";
type ProjectVisibility = "public" | "private";

interface ProjectSettings {
  autoAssignTicket: boolean;
  areas: string[];
  maxTicketsPerMember: number;
  joinMode: ProjectJoinMode;
  visibility: ProjectVisibility;
}

type Project = {
  _id: string;
  name: string;
  details: string;
  founder: { _id: string; username: string };
  techs: string[];
  members: ProjectMember[];
  pendingMembers: { _id: string; username: string }[];
  modules: string[];
  roles: string[];
  isPublic: boolean;
  followers: string[];
  createdAt: string;
  updatedAt: string;
  resources: Link[];
  iAmMember: boolean;
  iAmFounder: boolean;
  iAmPendingMember: boolean;
  ticketsCount: number;
  membersBanned: string[];
  settings: ProjectSettings;
};

type ProjectWithUserFlags = Project & {
  iAmMember: boolean;
  iAmPendingMember: boolean;
} & { permissions: Record<ProjectPermission, boolean> };

type ProjectTicket = {
  _id: string;
  ticketId: number;
  title: string;
  area: string;
  description: string;
  durationDays: number;
  status: "available" | "requested" | "in-progress" | "done";
  assignedTo?: { userId: string | { _id: string; username: string } };
  dueDate?: string;
  createdAt: string;
};

type ProjectActivityItem = {
  _id: string;
  type: "discussion" | "vote" | "ticket";
  author: { _id: string; username: string };
  projectId: string;
  discussion?: {
    title: string;
    content: string;
    status: "open" | "closed";
    messages: {
      _id: string;
      content: string;
      author: { _id: string; username: string };
      createdAt: string;
    }[];
  };
  vote?: {
    details: string;
    options: string[];
    votes: { userId: string; option: string }[];
    closesAt?: string;
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
  areas?: string[];
};

type PendingMember = {
  _id: string;
  username: string;
};

type Link = {
  name: string;
  url: string;
};

type UserLink = { site: string; link: string };

type ReactionState = {
  count: number;
  byMe: boolean;
};

type Post = {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; username: string };
  authorId: string;
  isMine: boolean;
  tags: string[];
  likes: ReactionState;
  comments_received: number;
  recognitions: {
    mentorship: ReactionState;
    documentation: ReactionState;
    innovation: ReactionState;
    resolution: ReactionState;
    inspiration: ReactionState;
  };
  createdAt: string;
  updatedAt: string;
};

type User = {
  _id: string;
  username: string;
  email: string;
  urlAvatar?: string;
  title?: string;
  description?: string;
  stack: string[];
  links: UserLink[];
  projects: Project[];
  posts: Post[];
  followers: string[];
};

type ServerResponse<T> = {
  success: boolean;
  message: string;
  data: T;
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
  | { type: "vote"; details: string; options: string[]; closesAt: string }
  | {
      type: "ticket";
      ticketId: string;
      action: "created" | "updated" | "deleted" | "assigned";
      assignedTo?: string;
    };
