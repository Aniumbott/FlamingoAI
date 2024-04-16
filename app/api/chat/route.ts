import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import ChatFolder from "@/app/models/ChatFolder";
import Message from "@/app/models/Message";
import Comment from "@/app/models/Comment";
import Workspace from "@/app/models/Workspace";

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

      chat = await Chat.create({
        name: body.name,
        createdBy: body.createdBy,
        scope: body.scope,
        parentFolder: null,
        workspaceId: body?.workspaceId,
        participants: [body.createdBy],
        messages: [],
        instructions: chatToClone?.instructions,
        assistant: chatToClone?.assistant,
        // messages: messages.map((message: any) => message._id),
      });

      let messages = [];

      for (const messageToClone of messagesToClone as any) {
        const newMessage = await Message.create({
          createdBy: messageToClone.createdBy,
          content: messageToClone.content,
          type: messageToClone.type,
          chatId: chat._id,
          comments: [],
        });
        messages.push(newMessage);

        let comments = [];

        if (body.isComments) {
          for (const commentToClone of messageToClone.comments) {
            const newComment = await Comment.create({
              createdBy: commentToClone.createdBy,
              content: commentToClone.content,
              status: commentToClone.status,
              messageId: newMessage._id,
              replies: [],
              parent: null,
            });
            comments.push(newComment);

            let replies = [];
            for (const replyToClone of commentToClone.replies) {
              replies.push(
                await Comment.create({
                  createdBy: replyToClone.createdBy,
                  content: replyToClone.content,
                  status: replyToClone.status,
                  messageId: newMessage._id,
                  replies: [],
                  parent: newComment._id,
                })
              );
            }
            // console.log("replies", replies);
            replies.length > 0
              ? await Comment.findByIdAndUpdate(
                  newComment._id,
                  {
                    replies: replies.map((reply: any) => reply._id),
                  },
                  { new: true }
                )
              : null;
          }
        }
        // console.log("comments", comments);
        comments.length > 0
          ? await Message.findByIdAndUpdate(
              newMessage._id,
              {
                comments: comments.map((comment: any) => comment._id),
              },
              {
                new: true,
              }
            )
          : null;
      }
      // console.log("messages", messages);
      chat = await Chat.findByIdAndUpdate(
        chat._id,
        {
          messages: messages.map((message: any) => message._id),
        },
        {
          new: true,
        }
      );

      // console.log("chat", chat);
    } else {
      const workspace = await Workspace.findById(body.workspaceId);

      chat = await Chat.create({
        name: "New Chat",
        createdBy: body.createdBy,
        scope: body.scope,
        parentFolder: body.parentFolder,
        workspaceId: body.workspaceId,
        participants: [body.createdBy],
        memberAccess: body.members.map((memberId: string) => ({
          userId: memberId,
          access: "inherit",
        })),
        instructions: workspace?.instructions,
        assistant: workspace?.assistants.find(
          (assistant) =>
            (assistant.scope == "private" && body.scope == "private") ||
            (assistant.scope == "pbulic" && body.scope != "private")
        ),
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
    const action = reqParam.get("action");
    let chats;

    // get independent chats based on scope
    if (action === "independent") {
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
    else if (action === "all") {
      chats = await Chat.find({
        workspaceId: workspaceId,
        archived: false,
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
      }).sort({ updatedAt: -1 });
    } else if (action === "allPopulated") {
      chats = await Chat.find({
        workspaceId: workspaceId,
        archived: false,
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
      })
        .populate({
          path: "messages",
          populate: {
            path: "comments",
            populate: {
              path: "replies",
            },
          },
        })
        .sort({ updatedAt: -1 });
    }

    // get archived chats
    else if (action === "archived") {
      chats = await Chat.find({
        workspaceId: workspaceId,
        archived: true,
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
      }).sort({ updatedAt: -1 });
    }

    // get specific chat by id
    else if (id) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        _id: id,
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
      })
        .populate({
          path: "messages",
          populate: {
            path: "comments",
            populate: {
              path: "replies",
            },
          },
        })
        .populate("assistant.assistantId");
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
        await Chat.findByIdAndUpdate(id, { scope: newScope });
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
