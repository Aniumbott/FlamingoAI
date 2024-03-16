import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const ChatSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    user_id: { type: Mongoose.Types.ObjectId, ref: "User", required: true },
    scope: { type: String, enum: ["public", "private"], required: true },
    parent_folder: {
      type: Mongoose.Types.ObjectId,
      ref: "ChatFolder",
      required: false,
    },
    archived: { type: Boolean, required: false, default: false },
    messages: [{ type: Mongoose.Types.ObjectId, ref: "Message", default: [] }],

    // workspace_id: { type: Mongoose.Types.ObjectId, ref: "Workspace", required: true },
    // model
  },
  {
    timestamps: true,
  }
);

interface IChat {
  name: string;
  user_id: Mongoose.Types.ObjectId;
  scope: string;
  parent_folder: Mongoose.Types.ObjectId;
  archived: boolean;
  messages: Mongoose.Types.ObjectId[];
  // workspace_id: Mongoose.Types.ObjectId;
}

interface IChatDocument extends IChat, Document {}
interface IChatModel extends Model<IChatDocument> {}

const Chat: IChatModel =
  Mongoose.models.chats || Mongoose.model<IChatDocument>("chats", ChatSchema);

export default Chat;
