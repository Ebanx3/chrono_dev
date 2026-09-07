import { model, Schema, Types } from "mongoose";
import { Project } from "../project/schema";

interface ITicket {
  title: string;
  ticketId: number;
  description: string;
  durationDays: number;
  status: "available" | "requested" | "in-progress" | "done";
  assignedTo?: { userId: Types.ObjectId };
  dueDate?: Date;
  projectId: Types.ObjectId;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    ticketId: { type: Number, required: true },
    description: { type: String },
    durationDays: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["available", "requested", "in-progress", "done"],
      default: "available",
    },
    assignedTo: {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    },
    dueDate: { type: Date },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true },
);

ticketSchema.index({ projectId: 1, ticketId: 1 }, { unique: true });

ticketSchema.pre("validate", async function () {
  if (this.isNew) {
    const project = await Project.findByIdAndUpdate(
      this.projectId,
      { $inc: { ticketsCount: 1 } },
      { new: true },
    );

    if (!project) {
      throw new Error("No se encontró el proyecto del ticket");
    }

    this.ticketId = project.ticketsCount;
  }

  if (this.isModified("assignedTo") || this.isModified("durationDays")) {
    if (this.assignedTo?.userId) {
      this.dueDate = new Date(Date.now() + this.durationDays * 24 * 60 * 60 * 1000);
    } else {
      this.dueDate = undefined;
    }
  }
});

export const Ticket = model<ITicket>("Ticket", ticketSchema);