// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./ChatFolder.ts");
require("./Message.ts");
require("./Workspace.ts");
require("./Assistant.ts");

const ChatSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, ref: "users", required: true },
    scope: {
      type: String,
      enum: ["public", "private", "viewOnly"],
      required: true,
    },
    parentFolder: {
      type: Mongoose.Types.ObjectId || null,
      ref: "chat_folders",
    },
    archived: { type: Boolean, required: false, default: false },
    messages: [{ type: Mongoose.Types.ObjectId, ref: "messages", default: [] }],
    workspaceId: {
      type: String,
      ref: "workspaces",
      required: true,
    },
    participants: [{ type: String, ref: "users", default: [] }],
    favourites: [{ type: String, ref: "users", default: [] }],
    memberAccess: [
      {
        // _id: false,
        userId: { type: String, ref: "users", required: true },
        access: {
          type: String,
          enum: ["inherit", "view", "edit"],
          required: true,
        },
      },
    ],
    instructions: { type: String, required: false },
    assistant: {
      assistantId: {
        type: Mongoose.Types.ObjectId,
        ref: "assistants",
        required: false,
      },
      model: { type: String, required: false },
    },
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
  favourites: string[];
  messages: Mongoose.Types.ObjectId[];
  participants: string[];
  memberAccess: {
    userId: string;
    access: string;
  }[];
  instructions: string;
  assistant: {
    assistantId: Mongoose.Types.ObjectId;
    model: string;
  };
}

interface IChatDocument extends IChat, Document {}
interface IChatModel extends Model<IChatDocument> {}

const Chat: IChatModel =
  Mongoose.models.chats || Mongoose.model<IChatDocument>("chats", ChatSchema);

export default Chat;
export type { IChatDocument };
