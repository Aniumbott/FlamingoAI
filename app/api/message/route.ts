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
    return NextResponse.json({ message }, { status: 200 });
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
    const chatId = reqParam.get("chatId");

    console.log("chatId", chatId);

    const messages = await Message.find({
      chatId: chatId,
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put message");
  try {
    await dbConnect();
    const body = await req.json();

    if (body.action && body.action === "deleteMany") {
      // Fetch the current message
      // const currentMessage = await Message.findById(body.id);

      // Delete all messages from the chat that were created after the current message
      const messages = await Message.deleteMany({
        chatId: body.chatId,
        createdAt: { $gte: body.createdAt },
      });

      // Delete the current message
      // await Message.findByIdAndDelete(body.id);

      return NextResponse.json({ messages }, { status: 200 });
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

    const message = await Message.findById(body.id).populate("comments");

    message?.comments.forEach(async (comment: any) => {
      comment.replies.forEach(async (reply: any) => {
        await Comment.findByIdAndDelete(reply._id);
      });
      await Comment.findByIdAndDelete(comment._id);
    });

    await Message.findByIdAndDelete(body.id);

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
