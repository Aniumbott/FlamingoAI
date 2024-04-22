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
    allowPersonal: { type: Boolean, default: true },
    allowPublic: { type: Boolean, default: true },
    assistants: {
      type: [
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
      default: [
        {
          apiKey: "",
          assistantId: "661a34b0bf589f58ba211c94",
          model: "gpt-3.5-turbo",
          scope: "public",
        },
        {
          apiKey: "",
          assistantId: "661a34b0bf589f58ba211c94",
          model: "gpt-3.5-turbo",
          scope: "private",
        },
      ],
    },

    instructions: {
      type: String,
      default:
        "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
    },
    createdBy: { type: String, ref: "users", required: true },
    customerId: { type: String, default: null },
    subscription: {
      type:
        {
          id: { type: String, required: false },
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
          current_period_start: { type: Number, required: false },
          current_period_ends: { type: Number, required: false },
          quantity: { type: Number, required: false },
        } || null,
      default: null,
    },
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
    product_id: string;
    status: string;
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
