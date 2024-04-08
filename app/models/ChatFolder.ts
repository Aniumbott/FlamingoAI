import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";
import { IChatDocument } from "./Chat";
require("./User.ts");
require("./Workspace.ts");
require("./ChatFolder.ts");

const ChatFolderSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    folderColor: {
      type: String,
      enum: ["#2596FF", "#AF75F8", "#1CAB83", "#FFE066", "#FF5656", "#F875B4"],
      required: false,
      default: "#FFE066",
    },
    createdBy: { type: String, ref: "users", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    workspaceId: { type: String, ref: "workspaces", required: true },
    parentFolder: {
      type: Mongoose.Types.ObjectId || null,
      ref: "chat_folders",
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
  folderColor: string;
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
