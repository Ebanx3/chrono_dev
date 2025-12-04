import { Schema, Document, model, Types } from "mongoose";

interface IPostStats {
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

export type PostStatKey = keyof IPostStats;

interface IProjectStats {
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

export interface IUser extends Document {
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
  projects: Array<{ id: Types.ObjectId; name: string }>;
  posts: Array<{ id: Types.ObjectId; title: string }>;
  postsStats: IPostStats;
  projectsStats: IProjectStats;
}

const LinkSchenma = new Schema(
  {
    site: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const postStatsSchema = new Schema(
  {
    created: {
      type: Number,
      default: 0,
    },
    likes_received: {
      type: Number,
      default: 0,
    },
    comments_received: {
      type: Number,
      default: 0,
    },
    mentorship_received: {
      // “Mentoría técnica”
      type: Number,
      default: 0,
    },
    documentation_received: {
      // “Documentación clara”
      type: Number,
      default: 0,
    },
    innovation_received: {
      // “Idea innovadora”
      type: Number,
      default: 0,
    },
    resolution_received: {
      // “Resolución efectiva”
      type: Number,
      default: 0,
    },
    inspiration_received: {
      // “Inspiración creativa”
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const projectStatsSchema = new Schema(
  {
    created: {
      type: Number,
      default: 0,
    },
    projects_completed: {
      type: Number,
      default: 0,
    },
    projects_completed_as_founder: {
      type: Number,
      default: 0,
    },
    tasks_completed: {
      type: Number,
      default: 0,
    },
    // Reconocimientos por tareas
    mentor_recognitions: { type: Number, default: 0 }, // "Mentoría técnica"
    resolver_recognitions: { type: Number, default: 0 }, // "Resolución efectiva"
    quality_recognitions: { type: Number, default: 0 }, // "Documentación clara / calidad"
    innovation_recognitions: { type: Number, default: 0 }, // "Idea innovadora"
    team_support_recognitions: { type: Number, default: 0 }, // "Apoyo al equipo"

    // Reconocimientos por proyectos
    leadership_recognitions: { type: Number, default: 0 }, // "Liderazgo"
    documentation_recognitions: { type: Number, default: 0 }, // "Documentador oficial"
    collaboration_recognitions: { type: Number, default: 0 }, // "Colaboración destacada"
    impact_recognitions: { type: Number, default: 0 }, // "Aporte clave"
    inspiration_recognitions: { type: Number, default: 0 }, // "Inspirador"
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    urlAvatar: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    stack: {
      type: [String],
      default: [],
    },
    links: {
      type: [LinkSchenma],
      default: [],
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    verificationEmailCode: {
      type: String,
      required: true,
    },
    projects: {
      type: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    posts: {
      type: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
    postsStats: { type: postStatsSchema, default:{} },
    projectsStats: { type: projectStatsSchema, default:{} },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
