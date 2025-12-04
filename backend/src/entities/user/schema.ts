import { Schema, Document, model, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  urlAvatar?: string;
  title?: string;
  description?: string;
  stack: Array<string>;
  links: Array<{site:string, link:string}>
  isVerifiedEmail: boolean;
  verificationEmailCode?: string | null;
  projects: Array<{ id: Types.ObjectId; name: string }>;
  posts: Array<{ id: Types.ObjectId; title: string }>;
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
  {_id: false}
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
    title:{
        type: String,
        default:null
    },
    description: {
        type:String, 
        default: null
    },
    stack:{
        type: [String],
        default: []
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
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
