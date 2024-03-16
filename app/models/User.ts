import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const userSchema = new Mongoose.Schema(
  {
    clerk_user_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photo_url: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

interface IUser {
  clerk_user_id: string;
  name: string;
  email: string;
  photo_url: string;
}

interface IUserDocument extends IUser, Document {}
interface IUserModel extends Model<IUserDocument> {}

const User: IUserModel =
  Mongoose.models.users || Mongoose.model<IUserDocument>("users", userSchema);
export default User;

// interface IPost {
//   name: string;
//   type: string;
// }
// interface IPostDocument extends IPost, Document {}
// interface IPostModel extends Model<IPostDocument> {}

// // postSchema->Document->Model

// const PostModel: IPostModel = Mongoose.model<IPostDocument>("post", postSchema);

// const User = Mongoose.models.users || Mongoose.model("users", userSchema);

// name, primary-email, photo-url, email-list
