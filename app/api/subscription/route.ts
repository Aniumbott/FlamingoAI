// import { getAuth } from "@clerk/nextjs/server";
// import { NextApiRequest, NextApiResponse } from "next";
// import { NextRequest, NextResponse } from "next/server";
// import { subscriptionHandler } from "use-stripe-subscription";
// // import { NextRequest, NextResponse } from "next/server";
// // import { clerkClient } from "@clerk/nextjs/server";
// // import { stripeApiClient } from "use-stripe-subscription";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   // Determine the Stripe Customer ID for this request
//   // use-stripe-subscription doesn't care how you implement this...
//   // you can make it specific to the user, or specific to their organization
//   // but we implemented it here with Clerk for user management

//   // const { userId } = getAuth(req);
//   // console.log("userId", userId);

//   // if (!userId) {
//   //   res.status(401).send("Not logged in");
//   //   return;
//   // }

//   const customerId = 'org_1234'

//   console.log("customerId", customerId);

//   const result = await subscriptionHandler({ customerId, query: req.query, body: req.body })
//   res.json(
//     result
//   );
// };

// // const findOrCreateCustomerId = async ({
// //   clerkUserId,
// // }: {
// //   clerkUserId: string;
// // }) => {
// //   let user = await clerkClient.users.getUser(clerkUserId);
// //   if (user.publicMetadata.stripeCustomerId) {
// //     console.log(
// //       "user.publicMetadata.stripeCustomerId",
// //       user.publicMetadata.stripeCustomerId
// //     );
// //     return user.publicMetadata.stripeCustomerId as string;
// //   }

// //   const primaryEmailAddress = user.emailAddresses.find(
// //     (x) => x.id === user.primaryEmailAddressId
// //   );
// //   const email = primaryEmailAddress ? primaryEmailAddress.emailAddress : "";
// //   const customerCreate = await stripeApiClient.customers.create(
// //     {
// //       name: user.firstName + " " + user.lastName,
// //       email: email,
// //       metadata: {
// //         clerkUserId: user.id,
// //       },
// //     },
// //     {
// //       idempotencyKey: user.id,
// //     }
// //   );
// //   console.log("customerCreate", customerCreate);
// //   user = await clerkClient.users.updateUser(user.id, {
// //     publicMetadata: {
// //       stripeCustomerId: customerCreate.id,
// //     },
// //   });
// //   return user.publicMetadata.stripeCustomerId as string;
// // };

// export default handler;
