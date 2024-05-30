// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Workspace from "@/app/models/Workspace";
import Chat from "@/app/models/Chat";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { stripe } from "@/app/lib/stripe";
import User from "@/app/models/User";
import { deleteChatbyId } from "../chat/route";
import Message from "@/app/models/Message";
import Comment from "@/app/models/Comment";
import ImageGen from "@/app/models/ImageGen";

const webhookSecret = process.env.CLERK_WORKSPACE_WEBHOOK_SECRET || ``;

// GET request handler
export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const id = reqParam.get("id");

    const workspace = await Workspace.findById(id);

    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Workspace route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// PUt request handler
export async function PUT(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const workspace = await Workspace.findByIdAndUpdate(body._id, body, {
      new: true,
    });
    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Workspace route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// All POST requests are handled by the CLERK webhook
export async function POST(request: Request) {
  const payload = await validateRequest(request);
  await dbConnect();
  let workspace;
  let customer;
  let user;
  switch (payload.type) {
    case "organization.created":
      workspace = await Workspace.create(getWorkspaceDataFromEvent(payload));
      user = await User.findById(workspace.createdBy);
      customer = await stripe.customers.create({
        name: workspace.name,
        email: user?.email,
        metadata: {
          workspaceId: workspace._id,
          workspaceSlug: workspace.slug,
        },
      });
      await Workspace.findByIdAndUpdate(workspace._id, {
        customerId: customer.id,
      });
      console.log(`Successfully created workspace with _id: ${workspace._id}`);
      break;
    case "organization.updated":
      workspace = await Workspace.findByIdAndUpdate(
        payload.data.id,
        getWorkspaceDataFromEvent(payload),
        {
          new: true,
        }
      );
      customer = stripe.customers.update(workspace?.customerId || "", {
        name: workspace?.name,
        metadata: {
          workspaceSlug: String(workspace?.slug),
        },
      });
      console.log(`Successfully updated workspace with _id: ${workspace?._id}`);
      break;
    case "organization.deleted":
      const chats = Chat.find({ workspaceId: payload.data.id });
      (await chats).forEach(async (chat) => {
        await deleteChatbyId(chat._id, Chat, Message, Comment);
      });
      await ImageGen.find({ workspaceId: payload.data.id }).deleteMany();
      workspace = await Workspace.findByIdAndDelete(payload.data.id);
      console.log(
        `Successfully deleted workspace with _id: ${payload.data.id}`
      );
      break;
  }

  // console.log(customer);

  return Response.json({ message: "Received" });
}

// Essential Functions
async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

function getWorkspaceDataFromEvent(evt: any) {
  return {
    _id: evt.data.id,
    name: evt.data.name,
    slug: evt.data.slug,
    imageUrl: evt.data.image_url,
    createdBy: evt.data.created_by,
  };
}
