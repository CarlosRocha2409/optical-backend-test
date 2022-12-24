import { Schema, Types } from "mongoose";

const CommentSchema = new Schema(
  {
    staff: { type: Types.ObjectId, ref: "Staff", required: true },
    description: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const TicketSchema = new Schema(
  {
    assignee: { type: Types.ObjectId, ref: "Staff", default: null },
    description: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 1,
      required: true,
    },
    product: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    comments: [CommentSchema],
  },

  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
