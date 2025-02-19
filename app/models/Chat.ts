// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./ChatFolder.ts");
require("./Message.ts");
require("./Workspace.ts");
require("./Page.ts");
require("./AIModel.ts");

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
    instructions: {
      type: {
        type: String,
        enum: ["text", "page"],
        default: "text",
        required: true,
      },
      text: { type: String, required: false },
      pageId: { type: Mongoose.Types.ObjectId, default: null, required: false },
    },
    aiModel: {
      type: Mongoose.Types.ObjectId,
      ref: "ai_models",
      required: false,
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
  instructions: {
    type: string;
    text: string;
    pageId: Mongoose.Types.ObjectId;
  };
  aiModel: Mongoose.Types.ObjectId;
}

interface IChatDocument extends IChat, Document {}
interface IChatModel extends Model<IChatDocument> {}

const Chat: IChatModel =
  Mongoose.models.chats || Mongoose.model<IChatDocument>("chats", ChatSchema);

export default Chat;
export type { IChatDocument, IChatModel };
