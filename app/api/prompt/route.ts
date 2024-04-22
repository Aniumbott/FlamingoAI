// Modules
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import Prompt from "@/app/models/Prompt";
import PromptFolder from "@/app/models/PromptFolder";

// GET request handler
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId");
    const createdBy = reqParam.get("createdBy");
    const id = reqParam.get("id");
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
    } else if (id === "all" && workspaceId && createdBy) {
      prompts = await Prompt.find({
        $or: [
          { scope: "system" },
          { scope: "public", workspaceId: workspaceId },
          { scope: "private", createdBy: createdBy, workspaceId: workspaceId },
        ],
      }).sort({ updatedAt: -1 });
    }

    return NextResponse.json({ prompts }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Chat route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// POST request handler
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const {variables , updatedText} = fetchVariables(body.content);
    
    const prompt = await Prompt.create({
      name: body.name,
      content: updatedText,
      description: body.description,
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder,
      workspaceId: body.workspaceId,
      variables,
    });

    // If parentFolder was provided, add the new chat ID to the parent folder's chats array
    if (body.parentFolder) {
      await PromptFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { prompts: prompt._id },
      });
    }

    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Prompt route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// PUT request handler
export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    let prompt;

    const { id, targetFolderId, parentFolderId, newScope } = body;

    if (id && targetFolderId && parentFolderId) {
      // If the prompt currently has a parent folder, remove it from the parent folder's prompts
      if (parentFolderId !== "null") {
        await PromptFolder.findByIdAndUpdate(parentFolderId, {
          $pull: { prompts: id },
        });
      }

      // If the target folder id is not "null", add the prompt to the target folder's prompts
      if (targetFolderId !== "public" && targetFolderId !== "private") {
        await PromptFolder.findByIdAndUpdate(targetFolderId, {
          $push: { prompts: id },
        });
      }

      // Update the prompt's parentFolder
      if (newScope) {
        prompt = await Prompt.findByIdAndUpdate(
          id,
          {
            parentFolder:
              targetFolderId === "public" || targetFolderId === "private"
                ? null
                : targetFolderId,
            scope: newScope,
          },
          {
            new: true,
          }
        );
      } else {
        prompt = await Prompt.findByIdAndUpdate(
          id,
          {
            parentFolder:
              targetFolderId === "public" || targetFolderId === "private"
                ? null
                : targetFolderId,
          },
          {
            new: true,
          }
        );
      }
    } else {
      prompt = await Prompt.findByIdAndUpdate(body.id, body, {
        new: true,
      });
    }
    return NextResponse.json({ prompt }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Prompt route: ", error);
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
    console.log("error at DELETE in Prompt route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// function fetchVariables(text: string) {
//   const variableRegex = /{{(.*?)}}/g;
//   const variables = [];
//   let match;

//   while ((match = variableRegex.exec(text)) !== null) {
//     variables.push(match[1]);
//   }

//   return variables;
// }

// function fetchVariables(text: string) {
//   const variables = Array.from(text.matchAll(/\{\{(.*?)\}\}/g)).map((match) =>
//     match[1].trim()
//   );
//   return variables;
// }

function fetchVariables(text: string) {
    const variableRegex = /\{\{(.*?)\}\}/g;
    let updatedText = text;

    const variables = Array.from(text.matchAll(variableRegex)).map(match => {
        const variable = match[1].trim();
        updatedText = updatedText.replace(match[0], `{{${variable}}}`);
        return variable;
    });

    return { variables, updatedText };
}