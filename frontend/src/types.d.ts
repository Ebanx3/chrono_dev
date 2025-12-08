type Project = {
  name: string;
  details: string;
  id: string;
};

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
