// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const AIModelSchema = new Mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true },
    provider: { type: String, required: true },
    contextWindow: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

interface IAIModel {
  name: string;
  value: string;
  provider: string;
  contextWindow: number;
}

interface IAIModelDocument extends IAIModel, Document {}
interface IAiModelModel extends Model<IAIModelDocument> {}

const AIModel: IAiModelModel =
  Mongoose.models.ai_models ||
  Mongoose.model<IAIModelDocument>("ai_models", AIModelSchema);

export default AIModel;
export type { IAIModel, IAIModelDocument };
