import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/db";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_USER_WEBHOOK_SECRET || ``;

export async function POST(request: Request) {
  const payload = await validateRequest(request);
  await dbConnect();
  let user;
  switch (payload.type) {
    case "user.created":
      user = await User.create(getUserDataFromEvent(payload));
      break;
    case "user.updated":
      user = await User.findByIdAndUpdate(
        payload.data.id,
        getUserDataFromEvent(payload),
        {
          new: true,
        }
      );
      break;
    case "user.deleted":
      user = await User.findByIdAndDelete(payload.data.id);
      break;
  }
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

function getUserDataFromEvent(evt: any) {
  return {
    _id: evt.data.id,
    name: evt.data.first_name + " " + evt.data.last_name,
    email: evt.data.email_addresses[0].email_address,
    imageUrl: evt.data.profile_image_url,
  };
}
