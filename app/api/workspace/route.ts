import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Workspace from "@/app/models/Workspace";
import { get } from "http";
import Assistant from "@/app/models/Assistant";

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const id = reqParam.get("id");

    const workspace = await Workspace.findById(id);

    // console.log("workspace", workspace);
    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error: any) {
    // console.log("error at GET in Workspace route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const workspace = await Workspace.findByIdAndUpdate(body._id, body, {
      new: true,
    });

    // console.log("workspace", workspace);

    // console.log("body", body);
    return NextResponse.json({ workspace }, { status: 200 });
  } catch (error: any) {
    // console.log("error at PUT in Workspace route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
