// Modules
import { Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./Workspace.ts");

const pageSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    workspaceId: { type: String, ref: "workspaces", required: true },
    createdBy: { type: String, ref: "users", required: true },
    // content: [{ type: String, default: ["<p></p>"] }],
    content: { type: [String], default: [""] },
  },
  {
    timestamps: true,
  }
);

interface IPage {
  name: string;
  workspaceId: string;
  createdBy: string;
  content: string[];
}

interface IPageDocument extends IPage, Mongoose.Document {}
interface IPageModel extends Model<IPageDocument> {}

const Page: IPageModel =
  Mongoose.models.pages || Mongoose.model<IPageDocument>("pages", pageSchema);
export default Page;
export type { IPageDocument, IPage };
