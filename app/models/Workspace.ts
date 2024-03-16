import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

interface Scope {
  type: string;
  enum: ["public", "private"];
}

const workspaceSchema = new Mongoose.Schema(
  {
    scope: { type: String, enum: ["public", "private"], required: true },
    name: { type: String, required: true },
    photo_url: { type: String, required: false },
    workspace_url: { type: String, required: true },
    allow_personal: { type: Boolean, required: true },
    allow_public: { type: Boolean, required: true },
    user_id: { type: Mongoose.Types.ObjectId, ref: "User", required: true },
    // chat_folders, chats, favorites, members, prompt_folders
  },
  {
    timestamps: true,
  }
);

interface IWorkspace {
  scope: string;
  name: string;
  photo_url: string;
  workspace_url: string;
  allow_personal: boolean;
  allow_public: boolean;
  user_id: Mongoose.Types.ObjectId;
}

interface IWorkspaceDocument extends IWorkspace, Document {}
interface IWorkspaceModel extends Model<IWorkspaceDocument> {}

const Workspace: IWorkspaceModel =
  Mongoose.models.workspaces ||
  Mongoose.model<IWorkspaceDocument>("workspaces", workspaceSchema);
export default Workspace;
