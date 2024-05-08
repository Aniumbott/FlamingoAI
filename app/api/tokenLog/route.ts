// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import TokenLog from "@/app/models/TokenLog";

// GET Request handler
export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const workspaceId = reqParam.get("workspaceId");

    if (workspaceId) {
      const tokenLogs = await TokenLog.find({
        workspaceId: workspaceId,
      });
      return NextResponse.json({ tokenLogs }, { status: 200 });
    }
    return NextResponse.json("Workspace ID not found", { status: 404 });
  } catch (error: any) {
    console.log("error at GET in TokenLog route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const tokenLog = await TokenLog.create({
      inputTokens: body.inputTokens,
      outputTokens: body.outputTokens,
      createdBy: body.createdBy,
      chatId: body.chatId,
      workspaceId: body.workspaceId,
    });
    return NextResponse.json({ tokenLog }, { status: 201 });
  } catch (error: any) {
    console.log("error at POST in TokenLog route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
