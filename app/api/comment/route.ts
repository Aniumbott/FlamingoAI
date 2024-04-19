// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Comment from "@/app/models/Comment";
import Message from "@/app/models/Message";

// GET request handler
export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const messageId = reqParam.get("messageId");
    // find by messageId
    const comments = await Comment.find({ messageId: messageId }).populate(
      "replies"
    );

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Comment route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

// POST request handler
export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const comment = await Comment.create({
      createdBy: body.createdBy,
      content: body.content,
      status: "unresolved",
      messageId: body.messageId,
      parent: body.parent,
      replies: [],
    });

    let parentComment;
    let message;

    if (body.parent != null) {
      parentComment = await Comment.findByIdAndUpdate(body.parent, {
        $push: { replies: comment._id },
      });
    } else {
      message = await Message.findByIdAndUpdate(body.messageId, {
        $push: { comments: comment._id },
      });
    }

    return NextResponse.json(
      { comment, message, parentComment },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error at POST in Comment route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

// PUT request handler
export async function PUT(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();

    const comment = await Comment.findByIdAndUpdate(body.id, body, {
      new: true,
    }).populate("replies");

    return NextResponse.json({ comment }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Comment route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

// DELETE request handler
export async function DELETE(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();

    if (body.replies.length > 0) {
      for (const replyId of body.replies) {
        await Comment.findByIdAndDelete(replyId);
      }
    }

    await Comment.findByIdAndDelete(body._id);

    if (body.parent) {
      await Comment.findByIdAndUpdate(body.parent, {
        $pull: { replies: body._id },
      });
    } else {
      await Message.findByIdAndUpdate(body.messageId, {
        $pull: { comments: body._id },
      });
    }

    return NextResponse.json(
      { Comment: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error at DELETE in Comment route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}
