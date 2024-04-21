// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const userSchema = new Mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    imgaeUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

interface IUser {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
}

interface IUserDocument extends IUser, Document {
  _id: string;
}
interface IUserModel extends Model<IUserDocument> {}

const User: IUserModel =
  Mongoose.models.users || Mongoose.model<IUserDocument>("users", userSchema);
export default User;
