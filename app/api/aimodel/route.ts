// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import AIModel from "@/app/models/AIModel";
import Workspace, { IWorkspaceDocument } from "@/app/models/Workspace";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, streamText } from "ai";

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

    if (!apiKey) return NextResponse.json("API Key not found", { status: 404 });

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

    try {
      const { text, usage } = await generateText({
        model: chatModel(model.value),
        messages: messages,
      });
      return NextResponse.json({ text, usage }, { status: 200 });
    } catch (error: any) {
      console.log("error", error);
      return NextResponse.json(error.data.error.message, {
        status: 500,
      });
    }
  } catch (error: any) {
    console.log("error at POST in AIModels route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

//

/*
Streaming code ------------------------------------------------------------------------------------------------->

import { NextRequest, NextResponse } from "next/server";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const chatModel = createOpenAI({
    apiKey: "",
    compatibility: "strict",
  });

  const result = await streamText({
    model: chatModel("gpt-3.5-turbo"),
    messages: [
      {
        role: "user",
        content: "Give me a big explanation of vercel AI SDK in 1000 words",
      },
    ],
  });

  const reader = result.textStream.getReader();

  let intervalId = setInterval(async () => {
    const { done, value } = await reader.read();
    if (done) {
      clearInterval(intervalId);
      return;
    }
    process.stdout.write(value);
    writer.write(encoder.encode(`event: my-event\n`));
    writer.write(encoder.encode(`data: ${value}\n\n`));
  }, 1);

  req.signal.onabort = () => {
    console.log("------->abort");
    writer.close();
    result.textStream.cancel();
    clearInterval(intervalId);
  };

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
    status: 200,
  });
}
*/
