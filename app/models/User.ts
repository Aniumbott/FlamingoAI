import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const userSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  primary_email: {
    type: String,
    required: true,
  },
  photo_url: {
    type: String,
    required: false,
  },
  email_list: {
    type: [String],
    required: false,
  },
});
//how our post looks like
// interface IPost {
//   name: string;
//   type: string;
// }

// interface IPostDocument extends IPost, Document {}
// interface IPostModel extends Model<IPostDocument> {}

//postSchema->Document->Model

// const PostModel: IPostModel = Mongoose.model<IPostDocument>("post", postSchema);

const User = Mongoose.models.users || Mongoose.model("users", userSchema);

export default User;

// name, primary-email, photo-url, email-list
