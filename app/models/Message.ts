// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./Comment.ts");
require("./Chat.ts");

const MessageSchema = new Mongoose.Schema(
  {
    createdBy: { type: String, ref: "users", required: true },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    chatId: {
      type: String,
      ref: "chats",
      required: true,
    },
    comments: {
      type: [{ type: Mongoose.Types.ObjectId, ref: "comments", default: [] }],
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

interface IMessage {
  createdBy: String;
  content: String;
  type: String;
  chatId: String;
  comments: Mongoose.Types.ObjectId[];
  updatedAt: Date;
  createdAt: Date;
}

interface IMessageDocument extends IMessage, Document {}

interface IMessageModel extends Model<IMessageDocument> {}

const Message: IMessageModel =
  Mongoose.models.messages ||
  Mongoose.model<IMessageDocument>("messages", MessageSchema);

export default Message;
export type { IMessageDocument };
