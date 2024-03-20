import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const ChatSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: Mongoose.Types.ObjectId, ref: "User", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    parentFolder: {
      type: Mongoose.Types.ObjectId,
      ref: "ChatFolder",
      required: false,
    },
    archived: { type: Boolean, required: false, default: false },

    messages: [{ type: Mongoose.Types.ObjectId, ref: "Message", default: [] }],
    workspaceId: {
      type: Mongoose.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    participants: [{ type: Mongoose.Types.ObjectId, ref: "User", default: [] }],
    // model
  },
  {
    timestamps: true,
  }
);

interface IChat {
  name: string;
  createdBy: Mongoose.Types.ObjectId;
  scope: string;
  parentFolder: Mongoose.Types.ObjectId;
  archived: boolean;
  messages: Mongoose.Types.ObjectId[];
  workspaceId: Mongoose.Types.ObjectId;
  participants: Mongoose.Types.ObjectId[];
}

interface IChatDocument extends IChat, Document {}
interface IChatModel extends Model<IChatDocument> {}

const Chat: IChatModel =
  Mongoose.models.chats || Mongoose.model<IChatDocument>("chats", ChatSchema);

export default Chat;
export type { IChatDocument };
