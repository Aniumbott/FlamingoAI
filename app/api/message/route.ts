import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Message, { IMessageDocument } from "@/app/models/Message";
import Chat from "@/app/models/Chat";
import Comment from "@/app/models/Comment";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const message = await Message.create({
      createdBy: body.createdBy,
      content: body.content,
      type: body.type,
      chatId: body.chatId,
      updatedAt: new Date(),
      comments: [],
    });

    const chat = await Chat.findByIdAndUpdate(body.chatId, {
      $push: { messages: message._id },
    });

    // console.log("newMessage", message, chat);

    return NextResponse.json({ message, chat }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  // console.log("hit get chat");
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const id = reqParam.get("id");
    const chatId = reqParam.get("chatId");

    let messages;
    let message;

    if (chatId) {
      messages = await Message.find({ chatId: chatId }).populate({
        path: "comments",
        populate: {
          path: "replies",
        },
      });
    } else if (id) {
      message = await Message.findById(id).populate({
        path: "comments",
        populate: {
          path: "replies",
        },
      });
    } // console.log("chatId", chatId);

    return NextResponse.json({ message, messages }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put message");
  try {
    await dbConnect();
    const { body, action } = await req.json();

    if (action && action === "deleteMany") {
      // Fetch the current message
      // const currentMessage = await Message.findById(body.id);

      // Delete all messages from the chat that were created after the current message
      const messages = await Message.deleteMany({
        chatId: body.chatId,
        createdAt: { $gt: body.createdAt },
      });

      const message = await Message.findByIdAndUpdate(body._id, body).populate({
        path: "comments",
        populate: {
          path: "replies",
        },
      });

      // Delete the current message
      // await Message.findByIdAndDelete(body.id);

      return NextResponse.json({ message }, { status: 200 });
    } else {
      const message = await Message.findByIdAndUpdate(body.id, body, {
        new: true,
      }).populate({
        path: "comments",
        populate: {
          path: "replies",
        },
      });
      console.log("updatedMessage", message);
      return NextResponse.json({ message }, { status: 200 });
    }
  } catch (error: any) {
    console.log("error from PUT at Message", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  // console.log("hit delete message");
  try {
    await dbConnect();
    const body = await req.json();

    const message = await Message.findById(body._id).populate("comments");

    message?.comments.forEach(async (comment: any) => {
      comment.replies.forEach(async (reply: any) => {
        await Comment.findByIdAndDelete(reply._id);
      });
      await Comment.findByIdAndDelete(comment._id);
    });

    const deleteMessage = await Message.findByIdAndDelete(body._id);

    console.log("deleteMessage", body);

    const updateChat = await Chat.findByIdAndUpdate(body.chatId, {
      $pull: { messages: body._id },
    });

    console.log(updateChat);
    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
