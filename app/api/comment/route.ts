import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Comment, { ICommentDocument } from "@/app/models/Comment";
import Chat from "@/app/models/Chat";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const comment = await Comment.create({
      createdBy: body.createdBy,
      content: body.content,
      status: "unresolved",
      messageId: body.messageId,
      replies: [],
    });
    return NextResponse.json({ comment }, { status: 200 });
  } catch (error: any) {
    console.log("error from comment route", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  // console.log("hit get chat");
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const messageId = reqParam.get("messageId");
    // console.log("messageId", messageId);
    // find by messageId
    const comments = await Comment.find({ messageId: messageId }).populate(
      "replies"
    );

    // console.log("comments", comments);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put Comment");
  try {
    await dbConnect();
    const body = await req.json();

    const comment = await Comment.findByIdAndUpdate(body.id, body, {
      new: true,
    }).populate("replies");

    return NextResponse.json({ comment }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  // console.log("hit delete Comment");
  try {
    await dbConnect();
    const body = await req.json();

    // console.log("body", body);

    if (body.replies.length > 0) {
      for (const replyId of body.replies) {
        await Comment.findByIdAndDelete(replyId);
      }
    }

    const comment = await Comment.findByIdAndDelete(body.id);

    return NextResponse.json(
      { Comment: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}
