import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import get from workspace route
import Workspace from "@/app/models/Workspace";
import Assitant from "@/app/models/Assistant";
import Assistant from "@/app/models/Assistant";

export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    // console.log("req ------->", req);s
    const body = await req.json();
    const { action } = body;
    // console.log("ASSISTANT-------->", messages);
    if (action && action == "apiCall") {
      const { messages, workspaceId, model } = body;
      const workspace = await getWorkspace(workspaceId);
      const apiKey = workspace?.toJSON().apiKey;

      const gptRes = await (
        await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
          }),
        })
      ).json();

      return NextResponse.json({ gptRes }, { status: 200 });
    } else {
      const { name, models } = body;
      // console.log("name", name, "models", models);

      const assistant = await Assistant.create({ name, models });
      return NextResponse.json(assistant, { status: 200 });
    }

    // console.log("gptRes", gptRes);
  } catch (error: any) {
    console.log("error at POST in Assistant route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const assistants = await Assistant.find();
    // console.log("assistants", assistants);
    return NextResponse.json({ assistants }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Assistant route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

async function getWorkspace(workspaceId: string) {
  await dbConnect();
  const workspace = await Workspace.findById(workspaceId);
  return workspace;
}
