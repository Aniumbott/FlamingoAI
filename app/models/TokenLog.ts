// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./Chat.ts");
require("./Workspace.ts");

const TokenLogSchema = new Mongoose.Schema(
  {
    inputTokens: { type: Number, required: true },
    outputTokens: { type: Number, required: true },
    workspaceId: { type: String, ref: "workspaces", required: true },
    chatId: { type: String, ref: "chats", required: true },
    createdBy: { type: String, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

interface ITokenLog {
  inpuTtokens: number;
  outputTokens: number;
  workspaceId: string;
  chatId: string;
  createdBy: string;
}

interface ITokenLogDocument extends ITokenLog, Document {}
interface ITokenLogModel extends Model<ITokenLogDocument> {}

const TokenLog: ITokenLogModel =
  Mongoose.models.token_logs ||
  Mongoose.model<ITokenLogDocument>("token_logs", TokenLogSchema);

export default TokenLog;
export type { ITokenLogDocument };
