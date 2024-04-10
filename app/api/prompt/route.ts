import { dbConnect } from "@/app/lib/db";
import Prompt from "@/app/models/Prompt";
import PromptFolder from "@/app/models/PromptFolder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const prompt = await Prompt.create({
      name: body.name,
      content: body.content,
      description: body.description,
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder,
      workspaceId: body.workspaceId,
    });

    // If parentFolder was provided, add the new chat ID to the parent folder's chats array
    if (body.parentFolder) {
      await PromptFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { prompts: prompt._id },
      });
      // console.log("pushed ", chat._id, "to parent folder ", body.parentFolder);
    }

    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Prompt route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId");
    const createdBy = reqParam.get("createdBy");
    let prompts;

    if (scope === "public" && workspaceId) {
      prompts = await Prompt.find({
        workspaceId: workspaceId,
        scope: scope,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    } else if (scope === "private" && workspaceId && createdBy) {
      prompts = await Prompt.find({
        workspaceId: workspaceId,
        scope: scope,
        createdBy: createdBy,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    } else if (scope === "system") {
      prompts = await Prompt.find({
        scope: scope,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    }

    return NextResponse.json({ prompts }, { status: 200 });
  } catch (error: any) {
    // console.log("error at POST in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const prompt = await Prompt.findByIdAndUpdate(body.id, body);
    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    await Prompt.findByIdAndDelete(body.id);
    return NextResponse.json({ message: "Prompt deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
