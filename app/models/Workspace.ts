import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";
require("./User.ts");

const workspaceSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String, required: false },
    allowPersonal: { type: Boolean, required: true },
    allowPublic: { type: Boolean, required: true },
    createdBy: { type: Mongoose.Types.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

interface IWorkspace {
  name: string;
  slug: string;
  imageUrl: string;
  allowPersonal: boolean;
  allowPublic: boolean;
  createdBy: Mongoose.Types.ObjectId;
}

interface IWorkspaceDocument extends IWorkspace, Document {}
interface IWorkspaceModel extends Model<IWorkspaceDocument> {}

const Workspace: IWorkspaceModel =
  Mongoose.models.workspaces ||
  Mongoose.model<IWorkspaceDocument>("workspaces", workspaceSchema);
export default Workspace;
