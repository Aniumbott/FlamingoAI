import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Page, { IPageDocument } from "@/app/models/Page";

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const id = reqParam.get("id");
    const workspaceId = reqParam.get("workspaceId") || "";
    let pages;

    if (id) {
      pages = await Page.find({
        workspaceId: workspaceId,
        _id: id,
      });
    } else {
      pages = await Page.find({ workspaceId: workspaceId });
    }

    //   return res.status(200).json({ name: "John Doe" });
    return NextResponse.json({ pages }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();

    const page = await Page.create({
      name: "New Page",
      workspaceId: body.workspaceId,
      createdBy: body.createdBy,
    });

    return NextResponse.json({ page }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const page = await Page.findByIdAndUpdate(body.id, body, { new: true });
    return NextResponse.json({ page }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const page = await Page.findByIdAndDelete(body.id);
    return NextResponse.json({ page }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
