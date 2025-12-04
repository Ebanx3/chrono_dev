type Project = {
  name: string;
  details: string;
  id: string;
};

type Link = {
  site: string;
  link: string;
};

type Post = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  likes_received: number;
  mentorship_received: number;
  documentation_received: number;
  innovation_received: number;
  resolution_received: number;
  inspiration_received: number;
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
