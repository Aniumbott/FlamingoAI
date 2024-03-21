import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const ChatSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, ref: "User", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    parentFolder: {
      type: Mongoose.Types.ObjectId || null,
      ref: "chat_folders",
      required: true,
    },
    archived: { type: Boolean, required: false, default: false },

    messages: [{ type: Mongoose.Types.ObjectId, ref: "Message", default: [] }],
    workspaceId: {
      type: String,
      ref: "Workspace",
      required: true,
    },
    participants: [{ type: String, ref: "User", default: [] }],
    // model
  },
  {
    timestamps: true,
  }
);

interface IChat {
  name: string;
  createdBy: string;
  workspaceId: string;
  scope: string;
  parentFolder: Mongoose.Types.ObjectId | null;
  archived: boolean;
  messages: Mongoose.Types.ObjectId[];
  participants: string[];
}

interface IChatDocument extends IChat, Document {}
interface IChatModel extends Model<IChatDocument> {}

const Chat: IChatModel =
  Mongoose.models.chats || Mongoose.model<IChatDocument>("chats", ChatSchema);

export default Chat;
export type { IChatDocument };
