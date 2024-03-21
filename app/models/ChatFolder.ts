import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";
import { IChatDocument } from "./Chat";

const ChatFolderSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, ref: "User", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    workspaceId: { type: String, ref: "Workspace", required: true },
    parentFolder: {
      type: Mongoose.Types.ObjectId || null,
      ref: "chat_folders",
      required: true,
    },
    subFolders: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "chat_folders",
        required: false,
        default: [],
      },
    ],
    chats: [{ type: Mongoose.Types.ObjectId, ref: "chats", default: [] }],
  },
  {
    timestamps: true,
  }
);

interface IChatFolder {
  name: string;
  createdBy: string;
  workspaceId: string;
  parentFolder: Mongoose.Types.ObjectId | null;
  scope: string;
  subFolders: Mongoose.Types.ObjectId[] | IChatFolderDocument[];
  chats: Mongoose.Types.ObjectId[] | IChatDocument[];
}

interface IChatFolderDocument extends IChatFolder, Document {}
interface IChatFolderModel extends Model<IChatFolderDocument> {}

const ChatFolder: IChatFolderModel =
  Mongoose.models.chat_folders ||
  Mongoose.model<IChatFolderDocument>("chat_folders", ChatFolderSchema);

export default ChatFolder;
export type { IChatFolderDocument };
