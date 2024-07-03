// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import AIModel from "@/app/models/AIModel";
import Workspace, { IWorkspaceDocument } from "@/app/models/Workspace";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const workspaceId = reqParam.get("workspaceId");
    const workspace = await Workspace.findById(workspaceId);
    // console.log("WORKSPACE: ", workspace);
    // console.log("MAX PRODUCT ID: ", process.env.NEXT_PUBLIC_MAX_PLAN);
    let aiModels;
    if (
      workspace?.subscription?.product_id === process.env.NEXT_PUBLIC_MAX_PLAN
    ) {
      aiModels = await AIModel.find({});
    } else {
      aiModels = await AIModel.find({ provider: "openai" });
    }

    return NextResponse.json({ aiModels }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in AIModels route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const { messages, workspaceId, model, scope } = body;

    const workspace = await Workspace.findById(workspaceId);

    const apiKey = workspace?.apiKeys.find(
      (key) => key.provider == model.provider && key.scope == scope
    )?.key;

    // console.log(model, workspace);
    // console.log("apiKey: ", apiKey);

    if (!apiKey) return NextResponse.json("API Key not found", { status: 404 });

    let text = "";
    let tokenUsage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    let chatModel: any;

    switch (model.provider) {
      case "google":
        chatModel = createGoogleGenerativeAI({
          apiKey: apiKey,
        });
        break;
      case "anthropic":
        chatModel = createAnthropic({
          apiKey: apiKey,
        });
        break;
      default:
        chatModel = createOpenAI({
          apiKey: apiKey,
          compatibility: "strict",
        });
        break;
    }

    const result = await streamText({
      model: chatModel(model.value),
      messages: messages,
    });

    for await (const delta of result.textStream) {
      text += delta;
      process.stdout.write(delta);
    }

    tokenUsage = await result.usage;

    return NextResponse.json({ text, tokenUsage }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in AIModels route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
