// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";
import { IPromptDocument } from "./Prompt";

// Dependencies
require("./User.ts");
require("./Workspace.ts");
require("./ChatFolder.ts");

const PromptFolderSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    folderColor: {
      type: String,
      enum: ["#2596FF", "#AF75F8", "#1CAB83", "#FFE066", "#FF5656", "#F875B4"],
      required: false,
      default: "#FFE066",
    },
    createdBy: { type: String, ref: "users", required: true },
    scope: {
      type: String,
      enum: ["public", "private", "system"],
      required: true,
    },
    workspaceId: { type: String, ref: "workspaces", required: true },
    parentFolder: {
      type: Mongoose.Types.ObjectId || null,
      ref: "prompt_folders",
    },
    subFolders: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "prompt_folders",
        required: false,
        default: [],
      },
    ],
    prompts: [{ type: Mongoose.Types.ObjectId, ref: "prompts", default: [] }],
  },
  {
    timestamps: true,
  }
);

interface IPromptFolder {
  name: string;
  folderColor: string;
  createdBy: string;
  workspaceId: string;
  parentFolder: Mongoose.Types.ObjectId | null;
  scope: string;
  subFolders: Mongoose.Types.ObjectId[] | IPromptFolderDocument[];
  prompts: Mongoose.Types.ObjectId[] | IPromptDocument[];
}

interface IPromptFolderDocument extends IPromptFolder, Document {}
interface IPromptFolderModel extends Model<IPromptFolderDocument> {}

const PromptFolder: IPromptFolderModel =
  Mongoose.models.prompt_folders ||
  Mongoose.model<IPromptFolderDocument>("prompt_folders", PromptFolderSchema);

export default PromptFolder;
export type { IPromptFolderDocument };
