import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const ChatFolderSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, ref: "User", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    workspaceId: { type: String, ref: "Workspace", required: true, },
    subFolders: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "ChatFolder",
        required: false,
        default: [],
      },
    ],
    chats: [{ type: Mongoose.Types.ObjectId, ref: "Chat", default: [] }],
  },
  {
    timestamps: true,
  }
);

interface IChatFolder {
  name: string;
  createdBy: string;
  workspaceId: string;
  scope: string;
  subFolders: Mongoose.Types.ObjectId[];
  chats: Mongoose.Types.ObjectId[];
}

interface IChatFolderDocument extends IChatFolder, Document {}
interface IChatFolderModel extends Model<IChatFolderDocument> {}

const ChatFolder: IChatFolderModel =
  Mongoose.models.chat_folders ||
  Mongoose.model<IChatFolderDocument>("chat_folders", ChatFolderSchema);

export default ChatFolder;
export type { IChatFolderDocument };
