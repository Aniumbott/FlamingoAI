import { dbConnect } from "@/app/lib/db";
import Prompt from "@/app/models/Prompt";
import PromptFolder from "@/app/models/PromptFolder";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const promptFolder = await PromptFolder.create({
      name: "New Folder",
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder,
      workspaceId: body.workspaceId,
    });

    // If parentFolder was provided, add the new chat ID to the parent folder's chats array
    if (body.parentFolder) {
      await PromptFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { subFolders: promptFolder._id },
      });
      // console.log("pushed ", chat._id, "to parent folder ", body.parentFolder);
    }

    return NextResponse.json({ promptFolder }, { status: 200 });
  } catch (error: any) {
    // console.log("error at POST in Chat route", error);
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
    let promptFolders;

    if (scope === "public" && workspaceId) {
      promptFolders = await PromptFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    } else if (scope === "private" && workspaceId && createdBy) {
      promptFolders = await PromptFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        createdBy: createdBy,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    } else if (scope === "system") {
      promptFolders = await PromptFolder.find({
        scope: scope,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    }

    let populatedFolders = [];
    if (promptFolders) {
      for (let folder of promptFolders) {
        let populatedFolder = await populateSubFolders(folder);
        populatedFolders.push(populatedFolder);
      }
      promptFolders = populatedFolders;
    }

    return NextResponse.json({ promptFolders }, { status: 200 });
  } catch (error: any) {
    // console.log("error at POST in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  // console.log("hit put chatfolder");
  try {
    await dbConnect();
    const body = await req.json();
    const promptFolder = await PromptFolder.findByIdAndUpdate(body.id, body, {
      new: true,
    });
    return NextResponse.json({ promptFolder }, { status: 200 });
  } catch (error: any) {
    // console.log("error at PUT in Chatfolder route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  // console.log("hit delete chatfolder");
  try {
    await dbConnect();
    const body = await req.json();
    // const chatFolder = await ChatFolder.findByIdAndDelete(body.id);
    await deleteFolderAndContents(body.id);
    return NextResponse.json(
      { message: "Prompt Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("error at DELETE in Chatfolder route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

async function deleteFolderAndContents(folderId: string) {
  const folder = await PromptFolder.findById(folderId);

  if (folder) {
    // Delete all prompts in folder.prompts
    for (const promptId of folder.prompts) {
      console.log("deleting prompt", promptId);
      await Prompt.findByIdAndDelete(promptId);
    }
    // Recursively delete all subfolders
    for (const subFolderId of folder.subFolders) {
      console.log("deleting subfolder", subFolderId._id);
      await deleteFolderAndContents(subFolderId._id);
    }
    // Delete the folder
    await PromptFolder.findByIdAndDelete(folderId);
  }
}

async function populateSubFolders(folder: any) {
  if (folder.subFolders && folder.subFolders.length > 0) {
    folder = await PromptFolder.populate(folder, {
      path: "subFolders",
      options: { sort: { updatedAt: -1 } },
    });
    for (let i = 0; i < folder.subFolders.length; i++) {
      folder.subFolders[i] = await populateSubFolders(folder.subFolders[i]);
    }
  }

  if (folder.prompts && folder.prompts.length > 0) {
    folder = await PromptFolder.populate(folder, {
      path: "prompts",
      options: { sort: { updatedAt: -1 } },
    });
  }
  return folder;
}
