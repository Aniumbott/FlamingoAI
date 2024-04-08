import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
// import get from workspace route
import Workspace from "@/app/models/Workspace";

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    // console.log("req ------->", req);
    const reqParam = req.nextUrl.searchParams;
    const messages = reqParam.get("messages") || "";
    const workspaceId = reqParam.get("workspaceId") || "";
    const model = reqParam.get("model");
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
          messages: JSON.parse(messages),
        }),
      })
    ).json();
    return NextResponse.json({ gptRes }, { status: 200 });
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
