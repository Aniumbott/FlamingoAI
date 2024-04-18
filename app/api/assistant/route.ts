// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Workspace from "@/app/models/Workspace";
import Assistant from "@/app/models/Assistant";

// GET Request handler
export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const id = reqParam.get("id");

    if (id) {
      const assistant = await Assistant.findById(id);
      return NextResponse.json({ assistant }, { status: 200 });
    } else {
      const assistants = await Assistant.find();
      return NextResponse.json({ assistants }, { status: 200 });
    }
  } catch (error: any) {
    console.log("error at GET in Assistant route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// POST Request handler
export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const { messages, workspaceId, assistant } = body;

    const workspace = await Workspace.findById(workspaceId);

    const apiKey = workspace?.assistants.find(
      (a) =>
        a.assistantId == assistant.assistantId._id && a.scope == assistant.scope
    )?.apiKey;

    if (!apiKey) return NextResponse.json("API Key not found", { status: 404 });

    const gptRes = await (
      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: assistant.model,
          messages: messages,
        }),
      })
    ).json();

    return NextResponse.json({ gptRes }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Assistant route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
