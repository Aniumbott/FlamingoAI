// Modules
import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import ImageGen from "@/app/models/ImageGen";
import Workspace from "@/app/models/Workspace";
import { v2 as cloudinary } from "cloudinary";

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

    const apiKey = workspace?.assistants.find(
      (a) =>
        a.assistantId.toString() == process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID
    )?.apiKey;

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
      imageGen._id.toString()
    );

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
    console.log("body: ", body);
    switch (body.action) {
      case "all":
        const images = await ImageGen.find({ workspaceId: body.workspaceId });
        images.forEach(async (image) => {
          await deleteFromCloudinary(image._id.toString());
        });
        await ImageGen.deleteMany({
          workspaceId: body.workspaceId,
        });
        return NextResponse.json(
          { Comment: "All images deleted successfully" },
          { status: 200 }
        );
        break;
      default:
        console.log("body.id: ", body.id);
        await ImageGen.findByIdAndDelete(body.id);
        await deleteFromCloudinary(body.id);
        return NextResponse.json(
          { Comment: "Image deleted successfully" },
          { status: 200 }
        );
        break;
    }
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

async function saveToCloudinary(imageUrl: string, publicId: string) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(imageUrl, {
      public_id: publicId,
    })
    .catch((error) => {
      return error;
    });

  return uploadResult;
}

async function deleteFromCloudinary(publicId: string) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
  });

  // Delete an image
  const deleteResult = await cloudinary.uploader
    .destroy(publicId)
    .catch((error) => {
      return error;
    });

  return deleteResult;
}
