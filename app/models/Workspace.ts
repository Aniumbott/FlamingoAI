// Modules
import { Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./AIModel.ts");

const workspaceSchema = new Mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String, required: false },
    allowPersonal: { type: Boolean, default: true },
    allowPublic: { type: Boolean, default: true },
    apiKeys: {
      type: [
        {
          key: { type: String },
          provider: { type: String, required: true },
          aiModel: {
            type: Mongoose.Types.ObjectId,
            ref: "ai_models",
            required: true,
          },
          scope: { type: String, enum: ["public", "private"], required: true },
        },
      ],
      default: [
        {
          key: "",
          provider: "openai",
          aiModel: new Mongoose.Types.ObjectId("667e7ea9f9e460d48440784b"),
          scope: "public",
        },
        {
          key: "",
          provider: "openai",
          aiModel: new Mongoose.Types.ObjectId("667e7ea9f9e460d48440784b"),
          scope: "private",
        },
      ],
    },
    instructions: {
      type: String,
      default:
        "You are a large language model trained to provide helpful and informative responses. Please follow the user's instructions carefully and generate responses using markdown. Be specific, provide context when needed, and support your answers with sources or explanations when requested. If the initial response doesn't meet the user's expectations, iterate and try again. Avoid sharing personal, identifying, or sensitive information in your responses. Stay focused on providing accurate and reliable information to the best of your abilities.",
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
  apiKeys: {
    key: string;
    provider: string;
    aiModel: Mongoose.Types.ObjectId;
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
