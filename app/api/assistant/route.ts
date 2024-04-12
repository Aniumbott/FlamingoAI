import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import get from workspace route
import Workspace from "@/app/models/Workspace";

export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    // console.log("req ------->", req);s
    const body = await req.json();
    const { messages, workspaceId, model } = body;
    // console.log("ASSISTANT-------->", messages);
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

    // console.log("gptRes", gptRes);

    return NextResponse.json({ gptRes }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Assistant route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

async function getWorkspace(workspaceId: string) {
  await dbConnect();
  const workspace = await Workspace.findById(workspaceId);
  return workspace;
}
