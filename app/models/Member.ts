import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const memberSchema = new Mongoose.Schema(
  {
    clerk_user_id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
    },
    // workspace_id: {
    //   type: Mongoose.Types.ObjectId,
    //   ref: "Workspace",
    //   required: true,
    // },
    joined_at: {
      type: Date,
      required: true,
    },
    // invited_at: { Can be replaced by createdAt or timestamp
    //   type: Date,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

interface IMember {
  clerk_user_id: string;
  role: string;
  // workspace_id: Mongoose.Types.ObjectId;
  joined_at: Date;
  invited_at: Date;
}

interface IMemberDocument extends IMember, Document {}
interface IMemberModel extends Model<IMemberDocument> {}

const Member: IMemberModel =
  Mongoose.models.members ||
  Mongoose.model<IMemberDocument>("members", memberSchema);

export default Member;
