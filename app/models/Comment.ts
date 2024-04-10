import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";
require("./User.ts");
require("./Message.ts");

const CommentsSchema = new Mongoose.Schema(
  {
    createdBy: { type: String, ref: "users", required: true },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["resolved", "unresolved"],
      required: true,
    },
    messageId: {
      type: String,
      ref: "messages",
      required: true,
    },
    replies: {
      type: [{ type: Mongoose.Types.ObjectId, ref: "comments", default: [] }],
    },
    parent: {
      type: String || null,
      ref: "comments",
      required: false,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
    createdAt: {
      type: Date,
      required: false,
    },
    // comments
  },
  {
    timestamps: true,
  }
);

interface IComment {
  createdBy: String;
  content: String;
  status: String;
  messageId: String;
  replies: Mongoose.Types.ObjectId[];
  parent: String | null;
  updatedAt: Date;
  createdAt: Date;
}

interface ICommentDocument extends IComment, Document {}

interface ICommentModel extends Model<ICommentDocument> {}

const Comment: ICommentModel =
  Mongoose.models.comments ||
  Mongoose.model<ICommentDocument>("comments", CommentsSchema);

export default Comment;
export type { ICommentDocument };
