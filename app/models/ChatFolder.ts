import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const ChatFolderSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    user_id: { type: Mongoose.Types.ObjectId, ref: "User", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    sub_folders: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "ChatFolder",
        required: false,
        default: [],
      },
    ],
    chats: [{ type: Mongoose.Types.ObjectId, ref: "Chat", default: [] }],

    // workspace_id: { type: Mongoose.Types.ObjectId, ref: "Workspace", required: true },
  },
  {
    timestamps: true,
  }
);

interface IChatFolder {
  name: string;
  user_id: Mongoose.Types.ObjectId;
  scope: string;
  sub_folders: Mongoose.Types.ObjectId;
  chats: Mongoose.Types.ObjectId[];
  // workspace_id: Mongoose.Types.ObjectId;
}

interface IChatFolderDocument extends IChatFolder, Document {}
interface IChatFolderModel extends Model<IChatFolderDocument> {}

const ChatFolder: IChatFolderModel =
  Mongoose.models.chat_folders ||
  Mongoose.model<IChatFolderDocument>("chat_folders", ChatFolderSchema);

export default ChatFolder;
