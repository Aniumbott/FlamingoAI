// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

// Dependencies
require("./User.ts");
require("./Workspace.ts");

const imageGenSchema = new Mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    createdBy: { type: String, ref: "users", required: true },
    resolution: {
      type: String,
      enum: ["1024x1024", "1024x1792", "1792x1024"],

      required: true,
    },
    isHD: { type: Boolean, required: true },
    workspaceId: {
      type: String,
      ref: "workspaces",
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IImageGen {
  createdBy: string;
  prompt: string;
  resolution: string;
  isHD: boolean;
  workspaceId: string;
  modelName: string;
  createdAt: Date;
}

interface IImageGenDocument extends IImageGen, Document {}
interface IImageGenModel extends Model<IImageGenDocument> {}

const ImageGen: IImageGenModel =
  Mongoose.models.imageGens ||
  Mongoose.model<IImageGenDocument>("imageGens", imageGenSchema);
export default ImageGen;
export type { IImageGenDocument };
