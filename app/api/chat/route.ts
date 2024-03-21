import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import ChatFolder from "@/app/models/ChatFolder";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    console.log("body", body);
    const chat = await Chat.create({
      name: "New Chat",
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder,
      workspaceId: body.workspaceId,
      participants: [body.createdBy],
    });

    // If parentFolder was provided, add the new chat ID to the parent folder's chats array
    if (body.parentFolder) {
      await ChatFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { chats: chat._id },
      });
      console.log("pushed ", chat._id, "to parent folder ", body.parentFolder);
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    // export const GET = async (request, { params }) => {
    //   try{
    //        Path Params are received from {params} variable

    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId");
    const createdBy = reqParam.get("createdBy");

    // find by workspaceId and socpe
    let chats;
    if (scope === "public") {
      chats = await Chat.find({
        workspaceId: workspaceId,
        scope: scope,
        parentFolder: null,
      });
    } else if (scope === "private") {
      chats = await Chat.find({
        workspaceId: workspaceId,
        scope: scope,
        createdBy: createdBy,
        parentFolder: null,
      });
    }
    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  console.log("hit put chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findByIdAndUpdate(body.id, body, { new: true });
    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  console.log("hit delete chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findByIdAndDelete(body.id);
    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error at DELETE in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// NextRequest [Request] {
//   [Symbol(realm)]: {
//     settingsObject: { baseUrl: undefined, origin: [Getter], policyContainer: [Object] }
//   },
//   [Symbol(state)]: {
//     method: 'GET',
//     localURLsOnly: false,
//     unsafeRequest: false,
//     body: null,
//     client: { baseUrl: undefined, origin: [Getter], policyContainer: [Object] },
//     reservedClient: null,
//     replacesClientId: '',
//     window: 'client',
//     keepalive: false,
//     serviceWorkers: 'all',
//     initiator: '',
//     destination: '',
//     priority: null,
//     origin: 'client',
//     policyContainer: 'client',
//     referrer: 'client',
//     referrerPolicy: '',
//     mode: 'cors',
//     useCORSPreflightFlag: false,
//     credentials: 'same-origin',
//     useCredentials: false,
//     cache: 'default',
//     redirect: 'follow',
//     integrity: '',
//     cryptoGraphicsNonceMetadata: '',
//     parserMetadata: '',
//     reloadNavigation: false,
//     historyNavigation: false,
//     userActivation: false,
//     taintedOrigin: false,
//     redirectCount: 0,
//     responseTainting: 'basic',
//     preventNoCacheCacheControlHeaderModification: false,
//     done: false,
//     timingAllowFailed: false,
//     headersList: HeadersList {
//       cookies: null,
//       [Symbol(headers map)]: [Map],
//       [Symbol(headers map sorted)]: [Array]
//     },
//     urlList: [ URL {} ],
//     url: URL {
//       href: 'http://localhost:3000/api/chat?scope=private&workspaceId=org_2dsZqn6iZka7bixMpUXGc9oa8at&createdBy=user_2dsZmTZTBij5xjWmPjvirpXKtsL',
//       origin: 'http://localhost:3000',
//       protocol: 'http:',
//       username: '',
//       password: '',
//       host: 'localhost:3000',
//       hostname: 'localhost',
//       port: '3000',
//       pathname: '/api/chat',
//       search: '?scope=private&workspaceId=org_2dsZqn6iZka7bixMpUXGc9oa8at&createdBy=user_2dsZmTZTBij5xjWmPjvirpXKtsL',
//       searchParams: URLSearchParams {
//         'scope' => 'private',
//         'workspaceId' => 'org_2dsZqn6iZka7bixMpUXGc9oa8at',
//         'createdBy' => 'user_2dsZmTZTBij5xjWmPjvirpXKtsL' },
//       hash: ''
//     }
//   },
//   [Symbol(signal)]: AbortSignal { aborted: false },
//   [Symbol(abortController)]: AbortController { signal: AbortSignal
// { aborted: false } },
//   [Symbol(headers)]: HeadersList {
//     cookies: null,
//     [Symbol(headers map)]: Map(20) {
//       'accept' => [Object],
//       'accept-encoding' => [Object],
//       'accept-language' => [Object],
//       'connection' => [Object],
//       'content-type' => [Object],
//       'cookie' => [Object],
//       'host' => [Object],
//       'referer' => [Object],
//       'sec-ch-ua' => [Object],
//       'sec-ch-ua-mobile' => [Object],
//       'sec-ch-ua-platform' => [Object],
//       'sec-fetch-dest' => [Object],
//       'sec-fetch-mode' => [Object],
//       'sec-fetch-site' => [Object],
//       'user-agent' => [Object],
//       'x-clerk-auth-reason' => [Object],
//       'x-forwarded-for' => [Object],
//       'x-forwarded-host' => [Object],
//       'x-forwarded-port' => [Object],
//       'x-forwarded-proto' => [Object]
//     },
//     [Symbol(headers map sorted)]: [
//       [Array], [Array], [Array],
//       [Array], [Array], [Array],
//       [Array], [Array], [Array],
//       [Array], [Array], [Array],
//       [Array], [Array], [Array],
//       [Array], [Array], [Array],
//       [Array], [Array]
//     ]
//   },
//   [Symbol(internal request)]: {
//     cookies: RequestCookies { _parsed: [Map], _headers: [HeadersList] },
//     geo: {},
//     ip: undefined,
//     nextUrl: NextURL { [Symbol(NextURLInternal)]: [Object] },
//     url: 'http://localhost:3000/api/chat?scope=private&workspaceId=org_2dsZqn6iZka7bixMpUXGc9oka7bixMpUXGc9oa8at&createdBy=user_2dsZmTZTBij5xjWmPjvirpXKtsL'
//   }
// }
