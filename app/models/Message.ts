import { Document, Model } from "mongoose";
import * as Mongoose from "mongoose";

const MessageSchema = new Mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    participant: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    chat: {
      type: Mongoose.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    // comments
  },
  {
    timestamps: true,
  }
);

interface IMessage {
  user_id: string;
  content: string;
  participant: string;
}

interface IMessageDocument extends IMessage, Document {}

interface IMessageModel extends Model<IMessageDocument> {}

const Message: IMessageModel =
  Mongoose.models.messages ||
  Mongoose.model<IMessageDocument>("messages", MessageSchema);

export default Message;
