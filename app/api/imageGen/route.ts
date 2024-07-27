// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import ImageGen from "@/app/models/ImageGen";
import Workspace from "@/app/models/Workspace";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET request handler
export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const action = reqParam.get("action");
    switch (action) {
      case "all":
        const imageGens = await ImageGen.find({
          workspaceId: reqParam.get("workspaceId"),
        });
        return NextResponse.json({ imageGens }, { status: 200 });
        break;
      default:
        const imageGen = await ImageGen.findById(reqParam.get("id"));
        return NextResponse.json({ imageGen }, { status: 200 });
        break;
    }
  } catch (error: any) {
    console.log("error at GET in ImageGen route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

// POST request handler
export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();

    // First: gnerate the image
    const workspace = await Workspace.findById(body.workspaceId);

    const apiKey = workspace?.apiKeys.find(
      (key) => key.provider == "openai" && key.scope == "public"
    )?.key;

    if (!apiKey) return NextResponse.json("API Key not found", { status: 404 });

    const generatedImageUrl = await getGeneratedImage(
      body.prompt,
      body.isHD,
      body.resolution,
      body.modelName,
      apiKey
    );

    console.log("generatedImageUrl: ", generatedImageUrl);

    // Second: Toekn Log endtry skipped

    // Thrid: save entry in the database
    const imageGen = await ImageGen.create({
      createdBy: body.createdBy,
      prompt: body.prompt,
      resolution: body.resolution,
      isHD: body.isHD,
      workspaceId: body.workspaceId,
      modelName: body.modelName,
    });

    console.log("imageGen: ", imageGen);

    // Forth: Cloudinary Entry
    const uploadResult = await saveToCloudinary(
      generatedImageUrl,
      imageGen._id.toString(),
      body.workspaceId
    );
    console.log("uploadResult: ", uploadResult);

    return NextResponse.json({ imageGen }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in ImageGen route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

// No need for PUT request handler
// DELETE request handler
export async function DELETE(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    await ImageGen.findByIdAndDelete(body.id);
    await deleteFromCloudinary(body.id, body.workspaceId);
    return NextResponse.json(
      { Comment: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error at DELETE in ImageGen route: ", error);
    return NextResponse.json(error.Comment, { status: 500 });
  }
}

async function getGeneratedImage(
  prompt: string,
  isHD: boolean,
  resolution: string,
  model: string,
  apiKey: string
) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${apiKey}`);

  let raw = JSON.stringify({
    model: model,
    prompt: prompt,
    n: 1,
    size: resolution,
  });

  if (isHD) {
    raw = JSON.stringify({
      model: model,
      prompt: prompt,
      n: 1,
      size: resolution,
      quality: "hd",
    });
  }

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let response = await (
    await fetch(
      "https://api.openai.com/v1/images/generations",
      requestOptions as any
    )
  ).json();

  console.log("response: ", response);

  return response.data[0].url;
}

async function saveToCloudinary(
  imageUrl: string,
  publicId: string,
  orgId: string
) {
  // get all folders inside workspace
  const workspaceFolder = await cloudinary.api
    .sub_folders("workspaces/" + orgId)
    .catch(async (error) => {
      await cloudinary.api
        .create_folder("workspaces/" + orgId)
        .catch((error) => {
          return error;
        });
    });

  await workspaceFolder;

  const uploadResult = await cloudinary.uploader
    .upload(imageUrl, {
      public_id: publicId,
      folder: "workspaces/" + orgId,
    })
    .catch((error) => {
      return error;
    });

  return uploadResult;
}

async function deleteFromCloudinary(publicId: string, orgId: string) {
  console.log(`workspaces/${orgId}/${publicId}`);
  const deleteResult = cloudinary.uploader
    .destroy(`workspaces/${orgId}/${publicId}`)
    .then((res) => console.log(res))
    .catch((error) => {
      console.log("error at deleteFromCloudinary: ", error);
      return error;
    });

  return deleteResult;
}
