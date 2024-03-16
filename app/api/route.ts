// import accounts from "@/app/models/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const Accounts = await accounts.find();

//     return NextResponse.json({ Accounts }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "Error", err }, { status: 500 });
//   }
// }

// export async function POST(req: any) {
//   try {
//     const body = await req.json();
//     const ticketData = body.formData;

//     await accounts.create(ticketData);

//     return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({ message: "Error", err }, { status: 500 });
//   }
// }
