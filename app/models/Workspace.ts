// Modules
import { Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
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
    assistants: [
      {
        apiKey: { type: String },
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
    createdBy: { type: String, ref: "users", required: true },
    customerId: { type: String, required: false },
    subscription:
      {
        id: { type: String, required: false },
        customer_id: { type: String, required: false },
        product_id: { type: String, required: false },
        status: {
          type: String,
          enum: [
            "trialing",
            "active",
            "incomplete",
            "incomplete_expired",
            "past_due",
            "canceled",
            "unpaid",
            "paused",
          ],
          required: false,
        },
        product_name: { type: String, required: false },
        current_period_start: { type: Number, required: false },
        current_period_ends: { type: Number, required: false },
        quantity: { type: Number, required: false },
      } || null,
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
  assistants: {
    apiKey: string;
    assistantId: Mongoose.Types.ObjectId;
    model: string;
    scope: string;
  }[];
  instructions: string;
  createdBy: string;
  customerId: string;
  subscription: {
    id: string;
    customer_id: string;
    product_id: string;
    status: string;
    product_name: string;
    current_period_start: number;
    current_period_ends: number;
    quantity: number;
  } | null;
}

interface IWorkspaceDocument extends IWorkspace, Mongoose.Document {
  _id: string;
}
interface IWorkspaceModel extends Model<IWorkspaceDocument> {}

const Workspace: IWorkspaceModel =
  Mongoose.models.workspaces ||
  Mongoose.model<IWorkspaceDocument>("workspaces", workspaceSchema);
export default Workspace;
export type { IWorkspaceDocument };
