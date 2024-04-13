import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import ChatFolder from "@/app/models/ChatFolder";
import Message from "@/app/models/Message";
import Comment from "@/app/models/Comment";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();

    let chat;

    if (body.action && body.action === "fork") {
      const chatToClone = await Chat.findById(body.id).populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });

      const messagesToClone = chatToClone?.messages.slice(
        chatToClone?.messages.findIndex(
          (message: any) => String(message._id) === body.messageId
        )
      );

      let messages = [];

      for (const messageToClone of messagesToClone as any) {
        let comments = [];

        if (body.isComments) {
          for (const commentToClone of messageToClone.comments) {
            let replies = [];
            for (const replyToClone of commentToClone.replies) {
              replies.push(
                await Comment.create({
                  createdBy: replyToClone.createdBy,
                  content: replyToClone.content,
                  status: replyToClone.status,
                  messageId: replyToClone.messageId,
                  replies: [],
                  parent: replyToClone.parent,
                })
              );
            }
            comments.push(
              await Comment.create({
                createdBy: commentToClone.createdBy,
                content: commentToClone.content,
                status: commentToClone.status,
                messageId: commentToClone.messageId,
                replies: replies.map((reply: any) => reply._id),
                parent: null,
              })
            );
          }
        }
        const message = await Message.create({
          createdBy: messageToClone.createdBy,
          content: messageToClone.content,
          type: messageToClone.type,
          chatId: messageToClone.chatId,
          comments: comments.map((comment: any) => comment._id),
        });

        // Update the messageId in comments and replies
        for (const comment of comments) {
          await Comment.findByIdAndUpdate(comment._id, {
            messageId: message._id,
          });
          for (const reply of comment.replies) {
            await Comment.findByIdAndUpdate(reply._id, {
              messageId: message._id,
            });
          }
        }

        messages.push(message);
      }

      console.log("messages", messages);

      chat = await Chat.create({
        name: body.name,
        createdBy: body.createdBy,
        scope: body.scope,
        parentFolder: null,
        workspaceId: body?.workspaceId,
        participants: chatToClone?.participants,
        messages: messages.map((message: any) => message._id),
      });
    } else {
      chat = await Chat.create({
        name: "New Chat",
        createdBy: body.createdBy,
        scope: body.scope,
        parentFolder: body.parentFolder,
        workspaceId: body.workspaceId,
        participants: [body.createdBy],
        memberAccess: body.members.map((memberId:string) => ({
          userId: memberId,
          access: 'inherit',
        }))
      });

      // If parentFolder was provided, add the new chat ID to the parent folder's chats array
      if (body.parentFolder) {
        await ChatFolder.findByIdAndUpdate(body.parentFolder, {
          $push: { chats: chat._id },
        });
        // console.log("pushed ", chat._id, "to parent folder ", body.parentFolder);
      }
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    // console.log("error at POST in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId") || "";
    const createdBy = reqParam.get("createdBy") || "";
    const id = reqParam.get("id");
    const independent = reqParam.get("independent");
    let chats;

    // get independent chats based on scope
    if (independent && workspaceId && createdBy) {
      if (scope === "public") {
        chats = await Chat.find({
          workspaceId: workspaceId,
          scope: { $ne: "private" },
          parentFolder: null,
          archived: false,
        }).sort({ updatedAt: -1 });
      } else if (scope === "private") {
        chats = await Chat.find({
          workspaceId: workspaceId,
          parentFolder: null,
          archived: false,
          scope: scope,
          $or: [
            { createdBy: createdBy },
            {
              memberAccess: {
                $elemMatch: {
                  userId: createdBy,
                  access: { $ne: "inherit" },
                },
              },
            },
          ],
        }).sort({ updatedAt: -1 });
      }
    }
    //get all chats relevant to workspace and user
    else if (id === "all" && workspaceId && createdBy) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        $or: [
          { scope: { $ne: "private" } },
          {
            scope: "private",
            $or: [
              { createdBy: createdBy },
              {
                memberAccess: {
                  $elemMatch: {
                    userId: createdBy,
                    access: { $ne: "inherit" },
                  },
                },
              },
            ],
          },
        ],
        archived: false,
      }).sort({ updatedAt: -1 });
    }
    // get archived chats
    else if (id === "archived" && workspaceId && createdBy) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        $or: [
          { scope: { $ne: "private" } },
          {
            scope: "private",
            $or: [
              { createdBy: createdBy },
              {
                memberAccess: {
                  $elemMatch: {
                    userId: createdBy,
                    access: { $ne: "inherit" },
                  },
                },
              },
            ],
          },
        ],
        archived: true,
      }).sort({ updatedAt: -1 });
    }
    // get specific chat by id
    else if (id && workspaceId) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        _id: id,
      }).populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });
    }
    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put chat");
  try {
    await dbConnect();
    const body = await req.json();
    let chat;
    const { id, targetFolderId, parentFolderId, newScope } = body;
    // MOVE Chat Operation
    if (id && targetFolderId && parentFolderId) {
      // If the chat currently has a parent folder, remove it from the parent folder's chats
      if (parentFolderId !== "null") {
        await ChatFolder.findByIdAndUpdate(parentFolderId, {
          $pull: { chats: id },
        });
      }

      // If the target folder id is not "null", add the chat to the target folder's chats
      if (targetFolderId !== "public" && targetFolderId !== "private") {
        await ChatFolder.findByIdAndUpdate(targetFolderId, {
          $push: { chats: id },
        });
      }

      // Update the chat's parentFolder
      chat = await Chat.findByIdAndUpdate(
        id,
        {
          parentFolder:
            targetFolderId === "public" || targetFolderId === "private"
              ? null
              : targetFolderId,
        },
        {
          new: true,
        }
      );

      if (newScope) {
        // If newScope is not null, update the scope of all messages in the chat
        await Chat.findByIdAndUpdate(id, { scope: newScope });
        await Message.updateMany({ chat: id }, { scope: newScope });
      }

      chat = await chat?.populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });
    } else {
      chat = await Chat.findByIdAndUpdate(body.id, body, {
        new: true,
      }).populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  console.log("hit delete chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findById(body.id).populate({
      path: "messages",
      populate: {
        path: "comments",
        populate: {
          path: "replies",
        },
      },
    });

    chat?.messages.forEach(async (message: any) => {
      message.comments.forEach(async (comment: any) => {
        comment.replies.forEach(async (reply: any) => {
          await Comment.findByIdAndDelete(reply._id);
        });
        await Comment.findByIdAndDelete(comment._id);
      });
      await Message.findByIdAndDelete(message._id);
    });

    await Chat.findByIdAndDelete(body.id);

    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
