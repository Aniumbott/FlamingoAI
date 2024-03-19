import { Invitation } from "@clerk/nextjs/server";
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const invitationsSchema = new Mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    workspace: {
      type: Mongoose.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

interface IInvitation {
  email: string;
  workspace: Mongoose.Types.ObjectId;
  role: string;
  status: string;
}

interface IInvitationDocument extends IInvitation, Document {}
interface IInvitationModel extends Model<IInvitationDocument> {}

const User: IInvitationModel =
  Mongoose.models.invitations ||
  Mongoose.model<IInvitationDocument>("invitations", invitationsSchema);
export default Invitation;
