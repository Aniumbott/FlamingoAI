// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./ChatFolder.ts");
require("./Message.ts");
require("./Workspace.ts");

const PromptSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    content: { type: String, required: true },
    createdBy: { type: String, ref: "users", required: true },
    scope: {
      type: String,
      enum: ["public", "private", "system"],
      required: true,
    },
    parentFolder: {
      type: Mongoose.Types.ObjectId || null,
      ref: "prompt_folders",
    },
    workspaceId: {
      type: String,
      ref: "workspaces",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IPrompt {
  name: string;
  description: string;
  content: string;
  createdBy: string;
  workspaceId: string;
  scope: string;
  parentFolder: Mongoose.Types.ObjectId | null;
}

interface IPromptDocument extends IPrompt, Document {}
interface IPromptModel extends Model<IPromptDocument> {}

const Prompt: IPromptModel =
  Mongoose.models.prompts ||
  Mongoose.model<IPromptDocument>("prompts", PromptSchema);

export default Prompt;
export type { IPromptDocument };
