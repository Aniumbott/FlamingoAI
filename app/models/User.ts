// Modules
import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const userSchema = new Mongoose.Schema(
  {
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
  name: string;
  email: string;
  imageUrl: string;
}

interface IUserDocument extends IUser, Document {}
interface IUserModel extends Model<IUserDocument> {}

const User: IUserModel =
  Mongoose.models.users || Mongoose.model<IUserDocument>("users", userSchema);
export default User;
