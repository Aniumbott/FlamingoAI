// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./ChatFolder.ts");
require("./Message.ts");
require("./Workspace.ts");

const AssistantSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    models: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

interface IAssistant {
  name: string;
  models: {
    label: string;
    value: string;
  }[];
}

interface IAssistantDocument extends IAssistant, Document {}
interface IAssistantModel extends Model<IAssistantDocument> {}

const Assistant: IAssistantModel =
  Mongoose.models.assistants ||
  Mongoose.model<IAssistantDocument>("assistants", AssistantSchema);

export default Assistant;
export type { IAssistantDocument };
