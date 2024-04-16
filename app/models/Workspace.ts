import { Model } from "mongoose";
import * as Mongoose from "mongoose";
require("./User.ts");
require("./Assistant.ts");

const workspaceSchema = new Mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String, required: false },
    allowPersonal: { type: Boolean, required: true },
    allowPublic: { type: Boolean, required: true },
    apiKey: { type: String, required: false },
    assistants: [
      {
        apiKey: { type: String, required: true },
        assistantId: {
          type: Mongoose.Types.ObjectId,
          ref: "assistants",
          required: true,
        },
        model: { type: String, required: true },
        scope: {
          type: String,
          enum: ["private", "public"],
          required: true,
        },
      },
    ],
    instructions: { type: String, required: false },
    createdBy: { type: Mongoose.Types.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

interface IWorkspace {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  allowPersonal: boolean;
  allowPublic: boolean;
  apiKey: string;
  assistants: {
    apiKey: string;
    assistantId: Mongoose.Types.ObjectId;
    model: string;
    scope: string;
  }[];
  instructions: string;
  createdBy: Mongoose.Types.ObjectId;
}

interface IWorkspaceDocument extends IWorkspace, Mongoose.Document {
  _id: string;
}
interface IWorkspaceModel extends Model<IWorkspaceDocument> {}

const Workspace: IWorkspaceModel =
  Mongoose.models.workspaces ||
  Mongoose.model<IWorkspaceDocument>("workspaces", workspaceSchema);
export default Workspace;
